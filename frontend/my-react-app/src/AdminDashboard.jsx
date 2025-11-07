import { useState, useEffect } from 'react'
import './App.css'

function AdminDashboard({ onLogout }) {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
        setError('')
      } else {
        setError('ઓર્ડર લાવવામાં સમસ્યા આવી')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError('સર્વર સાથે કનેક્શન નથી')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn')
    onLogout()
  }

  const handleStatusChange = async (orderId, currentStatus) => {
    if (!orderId) {
      console.error('Order ID is missing:', orderId)
      alert('ઓર્ડર ID મળ્યું નથી')
      return
    }
    
    console.log('Updating order status:', { orderId, currentStatus })
    const newStatus = !currentStatus
    
    try {
      const url = `http://localhost:3000/api/orders/${orderId}`
      console.log('Request URL:', url)
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      })
      
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Status updated successfully:', data)
        fetchOrders()
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Error response:', response.status, errorData)
        alert(`સ્થિતિ બદલવામાં સમસ્યા આવી: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert(`સર્વર સાથે કનેક્શન નથી: ${error.message}`)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('gu-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => 
        filterStatus === 'pending' ? !order.status : order.status
      )

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
  const totalOrders = orders.length
  const pendingOrders = orders.filter(order => !order.status).length
  const completedOrders = orders.filter(order => order.status).length

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="container">
          <div className="admin-header-content">
            <h1 className="admin-logo">એડમિન ડેશબોર્ડ</h1>
            <button onClick={handleLogout} className="btn-logout">
              લોગઆઉટ
            </button>
          </div>
        </div>
      </header>

      <div className="admin-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-info">
                <h3>કુલ ઓર્ડર</h3>
                <p className="stat-number">{totalOrders}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-info">
                <h3>પેન્ડિંગ</h3>
                <p className="stat-number">{pendingOrders}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <h3>પૂર્ણ થયેલ</h3>
                <p className="stat-number">{completedOrders}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <h3>કુલ આવક</h3>
                <p className="stat-number">₹{totalRevenue.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="container">
          <div className="admin-controls">
            <h2 className="section-title">બધા ઓર્ડર</h2>
            <div className="filter-buttons">
              <button
                className={filterStatus === 'all' ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setFilterStatus('all')}
              >
                બધા
              </button>
              <button
                className={filterStatus === 'pending' ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setFilterStatus('pending')}
              >
                પેન્ડિંગ
              </button>
              <button
                className={filterStatus === 'completed' ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setFilterStatus('completed')}
              >
                પૂર્ણ થયેલ
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="loading-message">લોડ થઈ રહ્યું છે...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : filteredOrders.length === 0 ? (
            <div className="no-orders">કોઈ ઓર્ડર મળ્યા નથી</div>
          ) : (
            <div className="orders-table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>ક્રમ</th>
                    <th>નામ</th>
                    <th>ફોન</th>
                    <th>સરનામું</th>
                    <th>બાટલી કદ</th>
                    <th>પ્રમાણ</th>
                    <th>એકમ ભાવ</th>
                    <th>કુલ રકમ</th>
                    <th>તારીખ</th>
                    <th>સ્થિતિ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <tr key={order._id || index}>
                      <td>{index + 1}</td>
                      <td>{order.name || 'N/A'}</td>
                      <td>{order.phone || 'N/A'}</td>
                      <td className="address-cell">{order.address || 'N/A'}</td>
                      <td>{order.bottleSize || 'N/A'}</td>
                      <td>{order.quantity || 0}</td>
                      <td>₹{order.price || 0}</td>
                      <td className="total-cell">₹{order.total || 0}</td>
                      <td>{formatDate(order.date)}</td>
                      <td>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={order.status || false}
                            onChange={() => handleStatusChange(order._id, order.status)}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

