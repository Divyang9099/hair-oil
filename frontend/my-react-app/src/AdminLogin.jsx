import { useState } from 'react'
import './App.css'

function AdminLogin({ onLogin }) {
  const [credentials, setCredentials] = useState({
    id: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

 

  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:3000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: credentials.id,
          password: credentials.password
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        localStorage.setItem('adminLoggedIn', 'true')
        onLogin(true)
      } else {
        setError(data.error || 'અમાન્ય ID અથવા પાસવર્ડ')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('સર્વર સાથે કનેક્શન નથી')
      setIsLoading(false)
    }
  }

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2 className="admin-login-title">એડમિન લોગિન</h2>
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="adminId">ID *</label>
            <input
              type="text"
              id="adminId"
              name="id"
              required
              placeholder="તમારું ID દાખલ કરો"
              value={credentials.id}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="adminPassword">પાસવર્ડ *</label>
            <input
              type="password"
              id="adminPassword"
              name="password"
              required
              placeholder="તમારું પાસવર્ડ દાખલ કરો"
              value={credentials.password}
              onChange={handleChange}
            />
          </div>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <button type="submit" className="btn-secondary" disabled={isLoading}>
            {isLoading ? 'લોગિન થઈ રહ્યું છે...' : 'લોગિન કરો'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin

