import { useEffect, useState } from 'react'
import './App.css'
import Borrowings from './Borrowings'
import Reservations from './Reservations'
import { storage } from './utils'

function App() {
  const [tab, setTab] = useState('BORROW')
  const [theme, setTheme] = useState(() => storage.get('ui.theme', 'dark'))

  useEffect(() => {
    storage.set('ui.theme', theme)
  }, [theme])
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('theme-dark', 'theme-light')
    root.classList.add(`theme-${theme}`)
  }, [theme])
  return (
    <div>
      <div className="topbar card">
        <div className="topbar-row">
          <h1>Library Management</h1>
          <button onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))} className="secondary">{theme === 'dark' ? 'Light theme' : 'Dark theme'}</button>
        </div>
        <div className="tabs">
          <button onClick={() => setTab('BORROW')} className={tab === 'BORROW' ? 'success' : ''}>Borrowings</button>
          <button onClick={() => setTab('RESERVE')} className={tab === 'RESERVE' ? 'success' : ''}>Reservations</button>
        </div>
      </div>
      {tab === 'BORROW' ? <Borrowings /> : <Reservations />}
    </div>
  )
}

export default App
