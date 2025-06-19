import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <main>
      <h1>Welcome to Fantasy Draft Assistant</h1>
      <p>Get ready to draft the perfect team!</p>
      <Link to="/import-league">Import League</Link>
    </main>
  )
}
