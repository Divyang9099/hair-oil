import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import './App.css'
import API_BASE_URL from './config'
import ProductManager from './components/ProductManager'

function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('orders') // 'orders' or 'products'
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders()
      const interval = setInterval(fetchOrders, 30000)
      return () => clearInterval(interval)
    }
  }, [activeTab])

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`)
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

  const handleDeleteClick = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          alert('Order deleted successfully');
          fetchOrders();
        } else {
          alert('Failed to delete order');
        }
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Error deleting order');
      }
    }
  }

  const handleEditClick = (order) => {
    // For now, just alert. Future: Open a modal to edit
    alert(`Edit functionality coming soon for order: ${order.name}`);
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
      const url = `${API_BASE_URL}/api/orders/${orderId}`
      console.log('Request URL:', url)

      const orderToUpdate = orders.find(o => o._id === orderId)
      const updatedOrderData = { ...orderToUpdate, status: newStatus }

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedOrderData)
      })

      console.log('Response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('Status updated successfully:', data)
        const message = newStatus ? '✅ Status Updated & Confirmation Email Sent!' : '✅ Status Updated'
        alert(message)
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

  // Filter by status first
  const statusFilteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(order =>
      filterStatus === 'pending' ? !order.status : order.status
    )

  // Then filter by search query
  const filteredOrders = searchQuery.trim() === ''
    ? statusFilteredOrders
    : statusFilteredOrders.filter(order => {
      const query = searchQuery.toLowerCase().trim()
      const name = (order.name || '').toLowerCase()
      const email = (order.email || '').toLowerCase()
      const phone = (order.phone || '').toString()
      const address = (order.address || '').toLowerCase()
      const bottleSize = (order.bottleSize || '').toLowerCase()

      return name.includes(query) ||
        email.includes(query) ||
        phone.includes(query) ||
        address.includes(query) ||
        bottleSize.includes(query)
    })

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
  const totalOrders = orders.length
  const pendingOrders = orders.filter(order => !order.status).length
  const completedOrders = orders.filter(order => order.status).length

  const statCardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 30 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5
      }
    }),
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 400
      }
    }
  }

  // Sync Scroll Logic
  const tableContainerRef = useState(null) // Using callback ref or effect? simpler to use standard ref
  const [tableContainer, setTableContainer] = useState(null)
  const [dummyScroll, setDummyScroll] = useState(null)

  useEffect(() => {
    if (tableContainer && dummyScroll) {
      const handleTableScroll = () => {
        dummyScroll.scrollLeft = tableContainer.scrollLeft
      }

      const handleDummyScroll = () => {
        tableContainer.scrollLeft = dummyScroll.scrollLeft
      }

      tableContainer.addEventListener('scroll', handleTableScroll)
      dummyScroll.addEventListener('scroll', handleDummyScroll)

      return () => {
        tableContainer.removeEventListener('scroll', handleTableScroll)
        dummyScroll.removeEventListener('scroll', handleDummyScroll)
      }
    }
  }, [tableContainer, dummyScroll])

  // Update dummy width on resize or data load
  const [tableWidth, setTableWidth] = useState(1500)
  useEffect(() => {
    if (tableContainer) {
      const resizeObserver = new ResizeObserver(() => {
        setTableWidth(tableContainer.scrollWidth)
      })
      resizeObserver.observe(tableContainer)
      return () => resizeObserver.disconnect()
    }
  }, [tableContainer, orders])


  return (
    <motion.div
      className="admin-dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* ... Headers ... */}
      <motion.header
        className="admin-header"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
          duration: 0.6
        }}
      >
        <div className="container">
          <div className="admin-header-content">
            <motion.h1
              className="admin-logo"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              એડમિન ડેશબોર્ડ
            </motion.h1>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {/* Product Cart Button */}
              <motion.button
                onClick={() => setActiveTab(activeTab === 'orders' ? 'products' : 'orders')}
                className="btn-primary"
                style={{
                  margin: 0,
                  padding: '0.5rem 1rem',
                  backgroundColor: activeTab === 'products' ? 'var(--deep-green)' : 'white',
                  color: activeTab === 'products' ? 'white' : 'var(--deep-green)',
                  border: '2px solid white'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {activeTab === 'orders' ? '🛍️ Product Cart' : '📦 View Orders'}
              </motion.button>

              <motion.button
                onClick={handleLogout}
                className="btn-logout"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 6px 20px rgba(139, 69, 19, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                લોગઆઉટ
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {activeTab === 'products' ? (
        <motion.div
          className="admin-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container">
            <ProductManager />
          </div>
        </motion.div>
      ) : (
        <>
          <motion.div
            className="admin-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="container">
              <div className="stats-grid">
                <motion.div
                  className="stat-card"
                  variants={statCardVariants}
                  initial="hidden"
                  animate="visible"
                  custom={0}
                  whileHover="hover"
                >
                  <motion.div
                    className="stat-icon"
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  >
                    📦
                  </motion.div>
                  <div className="stat-info">
                    <h3>કુલ ઓર્ડર</h3>
                    <motion.p
                      className="stat-number"
                      key={totalOrders}
                      initial={{ scale: 1.3, color: '#FFD700' }}
                      animate={{ scale: 1, color: 'var(--cream-beige)' }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                      }}
                    >
                      {totalOrders}
                    </motion.p>
                  </div>
                </motion.div>
                <motion.div
                  className="stat-card"
                  variants={statCardVariants}
                  initial="hidden"
                  animate="visible"
                  custom={1}
                  whileHover="hover"
                >
                  <motion.div
                    className="stat-icon"
                    animate={{
                      rotate: [0, -10, 10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  >
                    ⏳
                  </motion.div>
                  <div className="stat-info">
                    <h3>પેન્ડિંગ</h3>
                    <motion.p
                      className="stat-number"
                      key={pendingOrders}
                      initial={{ scale: 1.3, color: '#FFD700' }}
                      animate={{ scale: 1, color: 'var(--cream-beige)' }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                      }}
                    >
                      {pendingOrders}
                    </motion.p>
                  </div>
                </motion.div>
                <motion.div
                  className="stat-card"
                  variants={statCardVariants}
                  initial="hidden"
                  animate="visible"
                  custom={2}
                  whileHover="hover"
                >
                  <motion.div
                    className="stat-icon"
                    animate={{
                      rotate: [0, 15, -15, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  >
                    ✅
                  </motion.div>
                  <div className="stat-info">
                    <h3>પૂર્ણ થયેલ</h3>
                    <motion.p
                      className="stat-number"
                      key={completedOrders}
                      initial={{ scale: 1.3, color: '#FFD700' }}
                      animate={{ scale: 1, color: 'var(--cream-beige)' }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                      }}
                    >
                      {completedOrders}
                    </motion.p>
                  </div>
                </motion.div>
                <motion.div
                  className="stat-card"
                  variants={statCardVariants}
                  initial="hidden"
                  animate="visible"
                  custom={3}
                  whileHover="hover"
                >
                  <motion.div
                    className="stat-icon"
                    animate={{
                      rotate: [0, -15, 15, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  >
                    💰
                  </motion.div>
                  <div className="stat-info">
                    <h3>કુલ આવક</h3>
                    <motion.p
                      className="stat-number"
                      key={totalRevenue}
                      initial={{ scale: 1.3, color: '#FFD700' }}
                      animate={{ scale: 1, color: 'var(--cream-beige)' }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                      }}
                    >
                      ₹{totalRevenue.toLocaleString('en-IN')}
                    </motion.p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="admin-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="container" style={{ position: 'relative' }}>
              <motion.div
                className="admin-controls"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                {/* ... Controls code same ... */}
                <motion.h2
                  className="section-title"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  બધા ઓર્ડર
                </motion.h2>
                <motion.div
                  className="filter-buttons"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <motion.button
                    className={filterStatus === 'all' ? 'filter-btn active' : 'filter-btn'}
                    onClick={() => setFilterStatus('all')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    બધા
                  </motion.button>
                  <motion.button
                    className={filterStatus === 'pending' ? 'filter-btn active' : 'filter-btn'}
                    onClick={() => setFilterStatus('pending')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    પેન્ડિંગ
                  </motion.button>
                  <motion.button
                    className={filterStatus === 'completed' ? 'filter-btn active' : 'filter-btn'}
                    onClick={() => setFilterStatus('completed')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    પૂર્ણ થયેલ
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Search Bar */}
              <motion.div
                style={{
                  marginTop: '1.5rem',
                  marginBottom: '1.5rem'
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1 }}
              >
                <motion.input
                  type="text"
                  placeholder="🔍 શોધો... (નામ, ઇમેઇલ, ફોન, સરનામું...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    border: '2px solid var(--deep-green)',
                    borderRadius: '5px',
                    fontSize: '1rem',
                    fontFamily: "'Baloo Bhai 2', sans-serif",
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                  whileFocus={{
                    scale: 1.01,
                    borderColor: "var(--light-green)",
                    boxShadow: "0 0 0 3px rgba(0, 100, 0, 0.1)"
                  }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>

              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
              ) : error ? (
                <div style={{ textAlign: 'center', color: 'red' }}>{error}</div>
              ) : filteredOrders.length === 0 ? (
                <div style={{ textAlign: 'center' }}>No orders found</div>
              ) : (
                <>
                  <motion.div
                    className="orders-table-container"
                    ref={setTableContainer}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 }}
                  >
                    <table className="orders-table">
                      <thead>
                        <tr>
                          <th>ક્રમ</th>
                          <th>નામ</th>
                          <th>ઇમેઇલ</th>
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
                          <motion.tr
                            key={order._id || index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: index * 0.05
                            }}
                            whileHover={{
                              backgroundColor: "var(--cream-beige)",
                              scale: 1.01,
                              transition: { duration: 0.2 }
                            }}
                          >
                            <td>{index + 1}</td>
                            <td>{order.name || 'N/A'}</td>
                            <td>{order.email || 'N/A'}</td>
                            <td>{order.phone || 'N/A'}</td>
                            <td className="address-cell">{order.address || 'N/A'}</td>
                            <td>{order.bottleSize || 'N/A'}</td>
                            <td>{order.quantity || 0}</td>
                            <td>₹{order.price || 0}</td>
                            <td className="total-cell">₹{order.total || 0}</td>
                            <td>{formatDate(order.date)}</td>
                            <td>
                              <motion.label
                                className="toggle-switch"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <input
                                  type="checkbox"
                                  checked={order.status || false}
                                  onChange={() => handleStatusChange(order._id, order.status)}
                                />
                                <motion.span
                                  className="toggle-slider"
                                  animate={order.status ? { backgroundColor: "var(--deep-green)" } : { backgroundColor: "#ffa500" }}
                                  transition={{ duration: 0.3 }}
                                />
                              </motion.label>
                              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <button className="btn-edit" onClick={() => handleEditClick(order)} style={{ background: '#f0ad4e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>✏️</button>
                                <button className="btn-delete" onClick={() => handleDeleteClick(order._id)} style={{ background: '#d9534f', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>🗑️</button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>

                  {/* Fixed Horizontal Scroll Bar */}
                  <div
                    ref={setDummyScroll}
                    className="fixed-bottom-scroll"
                    style={{
                      position: 'fixed',
                      bottom: '10px', /* Raised up slightly */
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '95%', /* Slight gap on sides */
                      height: '24px',
                      overflowX: 'auto',
                      overflowY: 'hidden',
                      zIndex: 9999,
                      backgroundColor: '#f0fff4',
                      border: '2px solid var(--deep-green)', /* Full border */
                      borderRadius: '12px', /* Rounded ends */
                      boxShadow: '0 4px 15px rgba(0,0,0,0.3)' /* heavier shadow for floating effect */
                    }}
                  >
                    <div style={{ width: tableWidth + 'px', height: '1px' }}></div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  )

}

export default AdminDashboard

