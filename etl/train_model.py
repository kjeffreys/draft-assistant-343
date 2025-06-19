import argparse
import json
from pathlib import Path
import tempfile

import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType
import joblib
import tensorflowjs as tfjs
from onnx_tf.backend import prepare


def load_dataset(path: Path) -> pd.DataFrame:
    with path.open() as f:
        data = json.load(f)
    return pd.DataFrame(data)


def build_features(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series]:
    X = pd.DataFrame()
    if "vor" in df.columns:
        X["vor"] = df["vor"]
    else:
        X["vor"] = 0
    X["injured"] = df.get("injured", False).astype(int)
    y = (X["vor"] <= X["vor"].median()).astype(int)
    return X, y


def train_model(dataset_path: Path, out_dir: Path) -> None:
    df = load_dataset(dataset_path)
    X, y = build_features(df)

    model = GradientBoostingClassifier(n_estimators=20, max_depth=3)
    model.fit(X, y)

    out_dir.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, out_dir / "availability_model.joblib")

    initial_type = [("float_input", FloatTensorType([None, X.shape[1]]))]
    onnx_model = convert_sklearn(model, initial_types=initial_type)
    onnx_path = out_dir / "availability_model.onnx"
    with onnx_path.open("wb") as f:
        f.write(onnx_model.SerializeToString())

    tf_model_dir = tempfile.mkdtemp()
    prepare(onnx_model).export_graph(tf_model_dir)
    tfjs.converters.convert_tf_saved_model(tf_model_dir, str(out_dir / "availability_model_tfjs"))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset", type=Path, default=Path("public/players_2024.json"))
    parser.add_argument("--output-dir", type=Path, default=Path("public"))
    args = parser.parse_args()
    train_model(args.dataset, args.output_dir)
