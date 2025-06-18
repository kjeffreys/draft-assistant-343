import argparse
import datetime as dt
import json
from io import StringIO
from pathlib import Path

import pandas as pd
import requests
from pysleeper import Sleeper


ADP_URL = "https://api.sleeper.app/v1/adp/nfl"
INJURY_URL = "https://api.sleeper.app/v1/players/injuries"
FANTASYPROS_URL = (
    "https://www.fantasypros.com/nfl/projections/all.csv?week=draft&scoring=PPR"
)


def fetch_adp(year: int) -> pd.DataFrame:
    """Fetch Sleeper ADP data for the given season."""
    api = Sleeper()
    resp = api.get(ADP_URL, params={"season": year, "sport": "nfl"})
    resp.raise_for_status()
    return pd.DataFrame(resp.json())


def fetch_projections(year: int) -> pd.DataFrame:
    """Fetch FantasyPros projections for the given season."""
    resp = requests.get(FANTASYPROS_URL + f"&year={year}")
    resp.raise_for_status()
    return pd.read_csv(StringIO(resp.text))


def fetch_injuries() -> pd.DataFrame:
    """Fetch current injury data from Sleeper."""
    resp = requests.get(INJURY_URL)
    resp.raise_for_status()
    return pd.DataFrame(resp.json())


def build_dataset(year: int) -> pd.DataFrame:
    adp = fetch_adp(year)
    projections = fetch_projections(year)
    injuries = fetch_injuries()

    merged = projections.merge(
        adp,
        how="left",
        left_on="player_id",
        right_on="player_id",
        suffixes=("", "_adp"),
    )

    if not injuries.empty:
        merged = merged.merge(
            injuries[["player_id", "status"]],
            how="left",
            on="player_id",
        )
        merged.rename(columns={"status": "injury_status"}, inplace=True)
    else:
        merged["injury_status"] = "healthy"

    return merged


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--year",
        type=int,
        default=dt.datetime.utcnow().year,
        help="Season year for data",
    )
    parser.add_argument(
        "--output-dir", default="public", help="Directory for output JSON"
    )
    args = parser.parse_args()

    dataset = build_dataset(args.year)

    out_dir = Path(args.output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    out_file = out_dir / f"players_{args.year}.json"
    with out_file.open("w") as f:
        json.dump(json.loads(dataset.to_json(orient="records")), f, indent=2)

    print(f"Wrote {len(dataset)} players to {out_file}")


if __name__ == "__main__":
    main()
