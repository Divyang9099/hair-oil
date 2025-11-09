import { useState } from 'react'
import { motion } from 'framer-motion'
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
      const response = await fetch('https://hair-oil.onrender.com/api/admin/login', {
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
    <motion.div 
      className="admin-login-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="admin-login-box"
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 100,
          damping: 15,
          duration: 0.6
        }}
      >
        <motion.h2 
          className="admin-login-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          એડમિન લોગિન
        </motion.h2>
        <motion.form 
          onSubmit={handleSubmit} 
          className="admin-login-form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div 
            className="form-group"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <label htmlFor="adminId">ID *</label>
            <motion.input
              type="text"
              id="adminId"
              name="id"
              required
              placeholder="તમારું ID દાખલ કરો"
              value={credentials.id}
              onChange={handleChange}
              whileFocus={{ scale: 1.02, borderColor: "var(--dark-gold)" }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
          <motion.div 
            className="form-group"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <label htmlFor="adminPassword">પાસવર્ડ *</label>
            <motion.input
              type="password"
              id="adminPassword"
              name="password"
              required
              placeholder="તમારું પાસવર્ડ દાખલ કરો"
              value={credentials.password}
              onChange={handleChange}
              whileFocus={{ scale: 1.02, borderColor: "var(--dark-gold)" }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
          {error && (
            <motion.div 
              className="error-message"
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
            >
              {error}
            </motion.div>
          )}
          <motion.button 
            type="submit" 
            className="btn-secondary" 
            disabled={isLoading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 6px 20px rgba(139, 69, 19, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? (
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                લોગિન થઈ રહ્યું છે...
              </motion.span>
            ) : (
              'લોગિન કરો'
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    </motion.div>
  )
}

export default AdminLogin

