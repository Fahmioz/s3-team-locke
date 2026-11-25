import { useState } from 'react'
import { seedDemoData } from '../services/vendors.js'

function SeedPage() {
  const [message, setMessage] = useState('')

  async function handleSeed() {
    setMessage('Seeding...')
    try {
      const response = await fetch('/api/vendors.json')
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      const count = await seedDemoData(data)
      setMessage(`Done: ${count} vendors written to Firestore.`)
    } catch (err) {
      setMessage(`Failed: ${err.message}`)
    }
  }

  return (
    <section className="card">
      <h2 className="section-title">Seed Firestore</h2>
      <button className="btn" type="button" onClick={handleSeed}>Load demo data</button>
      {message && <p>{message}</p>}
    </section>
  )
}

export default SeedPage
