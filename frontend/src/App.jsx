import React, { useEffect, useState } from 'react'
import Login from './components/Login'
import Genres from './components/Genres'
import { clearAuth, loadAuthFromStorage } from './api'

const App = () => {
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    loadAuthFromStorage()
    const hasAuth = !!localStorage.getItem('auth.basic')
    setIsAuthed(hasAuth)
  }, [])

  const logout = () => {
    clearAuth()
    setIsAuthed(false)
  }

  if (!isAuthed) {
    return <Login onAuthenticated={() => setIsAuthed(true)} />
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Library Admin</h1>
        <button onClick={logout}>Logout</button>
      </div>
      <Genres />
    </div>
  )
}

export default App