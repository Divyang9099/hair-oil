import { useState, useEffect } from 'react'
import './App.css'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'
// framer-motion library import કરો
import { motion } from 'framer-motion'

// એનિમેશન માટે Variants વ્યાખ્યાયિત કરો
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.6,
      type: "spring",
      stiffness: 100,
      damping: 12
    } 
  },
};

const cardVariants = {
  initial: { opacity: 0, scale: 0.8, y: 30 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 120, 
      damping: 15,
      duration: 0.6 
    } 
  },
  hover: {
    scale: 1.03,
    y: -5,
    transition: {
      duration: 0.3,
      type: "spring",
      stiffness: 400
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 200,
      damping: 15,
      duration: 0.5
    }
  }
};


function App() {
  const checkAdminPath = () => {
    const path = window.location.pathname
    const hash = window.location.hash
    return path.includes('/admin') || hash.includes('/admin') || hash === '#admin' || hash === '#/admin'
  }

  const [isAdminPage, setIsAdminPage] = useState(checkAdminPath())
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    if (checkAdminPath()) {
      return localStorage.getItem('adminLoggedIn') === 'true'
    }
    return false
  })

  useEffect(() => {
    const handleLocationChange = () => {
      const isAdmin = checkAdminPath()
      setIsAdminPage(isAdmin)
      if (isAdmin) {
        const loggedIn = localStorage.getItem('adminLoggedIn') === 'true'
        setIsAdminLoggedIn(loggedIn)
      } else {
        setIsAdminLoggedIn(false)
      }
    }

    handleLocationChange()
    
    const interval = setInterval(handleLocationChange, 100)
    window.addEventListener('popstate', handleLocationChange)
    window.addEventListener('hashchange', handleLocationChange)

    return () => {
      clearInterval(interval)
      window.removeEventListener('popstate', handleLocationChange)
      window.removeEventListener('hashchange', handleLocationChange)
    }
  }, [])

  const handleAdminLogin = (success) => {
    setIsAdminLoggedIn(success)
  }

  const handleAdminLogout = () => {
    localStorage.removeItem('adminLoggedIn')
    setIsAdminLoggedIn(false)
    window.location.hash = '#/admin'
  }

  const [videoEmbedUrl, setVideoEmbedUrl] = useState('')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    bottleSize: '250ml',
    quantity: 1
  })
  
  const BOTTLE_PRICES = {
    '250ml': 299,
    '500ml': 549,
    '750ml': 799,
    '1L': 999
  }

  if (isAdminPage) {
    if (isAdminLoggedIn) {
      return <AdminDashboard onLogout={handleAdminLogout} />
    } else {
      return <AdminLogin onLogin={handleAdminLogin} />
    }
  }

  const handleVideoClick = () => {
    const videoUrl = prompt('કૃપા કરીને વિડિઓ URL દાખલ કરો (YouTube/Vimeo):')
    if (videoUrl) {
      let embedUrl = ''
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        const videoId = videoUrl.includes('youtu.be') 
          ? videoUrl.split('youtu.be/')[1].split('?')[0]
          : videoUrl.split('v=')[1].split('&')[0]
        embedUrl = `https://www.youtube.com/embed/${videoId}`
      } else if (videoUrl.includes('vimeo.com')) {
        const videoId = videoUrl.split('vimeo.com/')[1].split('?')[0]
        embedUrl = `https://player.vimeo.com/video/${videoId}`
      } else {
        alert('કૃપા કરીને માન્ય YouTube અથવા Vimeo URL દાખલ કરો.')
        return
      }
      setVideoEmbedUrl(embedUrl)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 1 : value
    }))
  }
  
  const getPricePerUnit = () => {
    return BOTTLE_PRICES[formData.bottleSize] || 299
  }
  
  const calculateTotal = () => {
    return formData.quantity * getPricePerUnit()
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const orderData = {
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      bottleSize: formData.bottleSize,
      quantity: formData.quantity,
      price: getPricePerUnit(),
      total: calculateTotal()
    }
    
    try {
      const response = await fetch('https://hair-oil.onrender.com/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('Order created successfully:', result)
        setShowSuccessMessage(true)
        setFormData({ name: '', phone: '', address: '', bottleSize: '250ml', quantity: 1 })
        setTimeout(() => {
          setShowSuccessMessage(false)
        }, 5000)
      } else {
        const error = await response.json()
        alert(`ભૂલ: ${error.error || 'ઓર્ડર બનાવવામાં સમસ્યા આવી'}`)
      }
    } catch (error) {
      console.error('Error submitting order:', error)
      alert('ભૂલ: સર્વર સાથે કનેક્શન નથી. કૃપા કરીને પછી પ્રયાસ કરો.')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const handleSmoothScroll = (e) => {
      const anchor = e.target.closest('a[href^="#"]')
      if (anchor) {
        e.preventDefault()
        const target = document.querySelector(anchor.getAttribute('href'))
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      }
    }

    document.addEventListener('click', handleSmoothScroll)
    return () => {
      document.removeEventListener('click', handleSmoothScroll)
    }
  }, [])

  return (
    <>
      {/* Header Animation: Fade in from top with bounce */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          duration: 0.6,
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
      >
        <nav className="container">
          <motion.a 
            href="#" 
            className="logo"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            AA Hair Oil (અંબાલા)
          </motion.a>
          <ul className="nav-links">
            {/* Nav Links Staggered Fade In with slide */}
            {['#home', '#benefits', '#about', '#order'].map((href, index) => (
              <motion.li 
                key={href} 
                initial={{ opacity: 0, x: 30, y: -20 }} 
                animate={{ opacity: 1, x: 0, y: 0 }} 
                transition={{ 
                  duration: 0.4, 
                  delay: 0.3 + index * 0.1,
                  type: "spring",
                  stiffness: 150
                }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <a href={href}>{href === '#home' ? 'મુખ્ય પેજ' : href === '#benefits' ? 'ફાયદાઓ' : href === '#about' ? 'અમારા વિશે' : 'ઓર્ડર કરો'}</a>
              </motion.li>
            ))}
          </ul>
        </nav>
      </motion.header>

      {/* Hero Section Animation: Staggered Fade Up with enhanced effects */}
      <motion.section
        id="home"
        className="hero"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container">
          <motion.h1 
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            whileInView="visible"
            viewport={{ once: true }}
          >
            AAAAA હેર ઓઇલ: ૨૦ વર્ષનો અનુભવ, અંબાલાની ઔષધીઓનો વારસો
          </motion.h1>
          <motion.p 
            className="sub-headline" 
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            whileInView="visible"
            viewport={{ once: true }}
          >
            ખરતા વાળ, ખોડો, અને ઉંદરી જેવી સમસ્યાઓ માટે આયુર્વેદિક ઉપચાર.
          </motion.p>
          <motion.a 
            href="#order" 
            className="btn-primary" 
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ 
              scale: 1.08, 
              y: -3,
              boxShadow: "0 8px 20px rgba(0, 100, 0, 0.5)"
            }} 
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            હમણાં જ ઓર્ડર કરો
          </motion.a>
        </div>
      </motion.section>

      {/* Benefits Section Animation: Fade Up Cards on Scroll */}
      <section id="benefits" className="section">
        <div className="container">
          <motion.h2 className="section-title" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>ફાયદાઓ</motion.h2>
          <motion.div
            className="benefits-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div 
              className="benefit-card" 
              variants={itemVariants}
              whileHover={{ 
                translateY: -10, 
                scale: 1.03,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className="benefit-icon"
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
                💪
              </motion.div>
              <h3>ખરતા વાળ અટકે</h3>
              <p>આયુર્વેદિક ઘટકો વાળના મૂળને મજબૂત બનાવે છે અને ખરતા વાળને અટકાવે છે. નિયમિત ઉપયોગથી વાળ ઘન અને મજબૂત બને છે.</p>
            </motion.div>
            <motion.div 
              className="benefit-card" 
              variants={itemVariants}
              whileHover={{ 
                translateY: -10, 
                scale: 1.03,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className="benefit-icon"
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
                ✨
              </motion.div>
              <h3>ખોડો દૂર થાય</h3>
              <p>શુદ્ધ હર્બલ ઘટકો ખોડાની સમસ્યાને મૂળથી દૂર કરે છે. સ્કેલ્પ સ્વચ્છ અને સ્વસ્થ રહે છે, ખોડાની ખંજવાળ દૂર થાય છે.</p>
            </motion.div>
            <motion.div 
              className="benefit-card" 
              variants={itemVariants}
              whileHover={{ 
                translateY: -10, 
                scale: 1.03,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className="benefit-icon"
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
                🌱
              </motion.div>
              <h3>ઉંદરીમાં રાહત</h3>
              <p>પરંપરાગત આયુર્વેદિક ફોર્મ્યુલા ઉંદરીની સમસ્યામાં રાહત આપે છે અને નવા વાળની વૃદ્ધિને પ્રોત્સાહન આપે છે.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section Animation: Simple Fade In */}
      <motion.section 
        id="about" 
        className="section about-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container">
          <h2 className="section-title">૨૦ વર્ષની શુદ્ધતા અને વિશ્વાસ</h2>
          <div className="about-content">
            <motion.p 
              className="about-text"
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6 }}
            >
              અમારું AA હેર ઓઇલ માત્ર એક પ્રોડક્ટ નથી, તે અમારા પરિવારની ૨૦ વર્ષની મહેનત અને પરંપરાનો વારસો છે. અંબાલાના અનુભવી વૈદ્ય દ્વારા તૈયાર કરવામાં આવેલું આ તેલ શુદ્ધ આયુર્વેદિક ઘટકો સાથે બનાવવામાં આવે છે. અમે દરેક બાટલીમાં ગુણવત્તા અને શુદ્ધતાની ખાતરી આપીએ છીએ.
            </motion.p>
            <motion.div 
              className="video-placeholder"
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="video-container" onClick={handleVideoClick}>
                {videoEmbedUrl ? (
                  <iframe 
                    src={videoEmbedUrl} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    style={{ width: '100%', height: '100%', borderRadius: '8px' }}
                    title="Video Player"
                  />
                ) : (
                  <motion.div 
                    className="video-placeholder-content"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="play-button">▶</div>
                    <div className="video-title">જુઓ! શુદ્ધ તેલ બનાવવાની પ્રક્રિયા</div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Order Section Animation: Card Pop-up */}
      <section id="order" className="section order-section">
        <div className="container">
          <motion.h2 className="section-title" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>ઓર્ડર કરો</motion.h2>
          <div className="order-container">
            <motion.div 
              className="product-card" 
              variants={cardVariants} 
              initial="initial" 
              whileInView="animate" 
              viewport={{ once: true }}
              whileHover="hover"
            >
              <motion.div 
                className="product-image"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              >
                🛢️
              </motion.div>
              <motion.h3 
                className="product-name"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                AA Hair Oil
              </motion.h3>
              <motion.p 
                className="product-size"
                key={formData.bottleSize}
                initial={{ scale: 1.2, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {formData.bottleSize}
              </motion.p>
              <motion.p 
                className="product-price"
                key={getPricePerUnit()}
                initial={{ scale: 1.3, color: '#FFD700' }}
                animate={{ scale: 1, color: 'var(--deep-green)' }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
              >
                ₹{getPricePerUnit()}/-
              </motion.p>
              <motion.p 
                style={{ color: 'var(--text-dark)', marginTop: '1rem' }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                શુદ્ધ આયુર્વેદિક હેર ઓઇલ
              </motion.p>
            </motion.div>
            <motion.div 
              className="order-form" 
              variants={cardVariants} 
              initial="initial" 
              whileInView="animate" 
              viewport={{ once: true }} 
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            >
              <h3 style={{ color: 'var(--deep-green)', marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.5rem' }}>ઓર્ડર ફોર્મ</h3>
              <form id="orderForm" onSubmit={handleFormSubmit}>
              <motion.div 
                className="form-group"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <label htmlFor="name">નામ *</label>
                <motion.input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  placeholder="તમારું પૂર્ણ નામ લખો"
                  value={formData.name}
                  onChange={handleInputChange}
                  whileFocus={{ scale: 1.02, borderColor: "var(--dark-gold)" }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
              <motion.div 
                className="form-group"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <label htmlFor="phone">ફોન નંબર *</label>
                <motion.input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  required 
                  placeholder="તમારો ફોન નંબર લખો"
                  value={formData.phone}
                  onChange={handleInputChange}
                  whileFocus={{ scale: 1.02, borderColor: "var(--dark-gold)" }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
              <motion.div 
                className="form-group"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <label htmlFor="address">સરનામું *</label>
                <motion.textarea 
                  id="address" 
                  name="address" 
                  required 
                  placeholder="તમારું સંપૂર્ણ સરનામું લખો"
                  value={formData.address}
                  onChange={handleInputChange}
                  whileFocus={{ scale: 1.02, borderColor: "var(--dark-gold)" }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
              <motion.div 
                className="form-group"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <label htmlFor="bottleSize">બાટલીનું કદ *</label>
                <motion.select
                  id="bottleSize"
                  name="bottleSize"
                  required
                  value={formData.bottleSize}
                  onChange={handleInputChange}
                  whileFocus={{ scale: 1.02, borderColor: "var(--dark-gold)" }}
                  transition={{ duration: 0.2 }}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '2px solid var(--deep-green)',
                    borderRadius: '5px',
                    fontFamily: "'Noto Sans Gujarati', sans-serif",
                    fontSize: '1rem',
                    transition: 'border-color 0.3s ease'
                  }}
                >
                  <option value="250ml">250ml - ₹299</option>
                  <option value="500ml">500ml - ₹549</option>
                  <option value="750ml">750ml - ₹799</option>
                  <option value="1L">1L - ₹999</option>
                </motion.select>
              </motion.div>
              <motion.div 
                className="form-group"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <label htmlFor="quantity">પ્રમાણ *</label>
                <motion.input 
                  type="number" 
                  id="quantity" 
                  name="quantity" 
                  required 
                  min="1"
                  placeholder="પ્રમાણ દાખલ કરો"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  whileFocus={{ scale: 1.02, borderColor: "var(--dark-gold)" }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
              <motion.div 
                className="form-group" 
                style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--cream-beige)', borderRadius: '5px', border: '2px solid var(--deep-green)' }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                <motion.div 
                  style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span style={{ fontWeight: 600, color: 'var(--deep-green)' }}>બાટલી કદ:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{formData.bottleSize}</span>
                </motion.div>
                <motion.div 
                  style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <span style={{ fontWeight: 600, color: 'var(--deep-green)' }}>એકમ ભાવ:</span>
                  <motion.span 
                    style={{ fontWeight: 600, color: 'var(--text-dark)' }}
                    key={getPricePerUnit()}
                    initial={{ scale: 1.2, color: 'var(--deep-green)' }}
                    animate={{ scale: 1, color: 'var(--text-dark)' }}
                    transition={{ duration: 0.3 }}
                  >
                    ₹{getPricePerUnit()}
                  </motion.span>
                </motion.div>
                <motion.div 
                  style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <span style={{ fontWeight: 600, color: 'var(--deep-green)' }}>પ્રમાણ:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{formData.quantity}</span>
                </motion.div>
                <motion.div 
                  style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '2px solid var(--deep-green)' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <span style={{ fontWeight: 700, color: 'var(--deep-green)', fontSize: '1.2rem' }}>કુલ રકમ:</span>
                  <motion.span 
                    style={{ fontWeight: 700, color: 'var(--deep-green)', fontSize: '1.2rem' }}
                    key={calculateTotal()}
                    initial={{ scale: 1.3, color: '#FFD700' }}
                    animate={{ scale: 1, color: 'var(--deep-green)' }}
                    transition={{ 
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                  >
                    ₹{calculateTotal()}
                  </motion.span>
                </motion.div>
      </motion.div>
                {/* Button Hover Effect */}
                <motion.button 
                  type="submit" 
                  className="btn-secondary" 
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? 'પ્રક્રિયા ચાલી રહી છે...' : 'ઓર્ડર કન્ફર્મ કરો'}
                </motion.button>
                {showSuccessMessage && (
                  <motion.div 
                    className="success-message"
                    initial={{ opacity: 0, y: -20, scale: 0.8 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                    }}
                    exit={{ opacity: 0, y: -20, scale: 0.8 }}
                    transition={{ 
                      duration: 0.4,
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      ✅ ધન્યવાદ! તમારો ઓર્ડર પ્રાપ્ત થયો છે. અમે ટૂંક સમયમાં તમારો સંપર્ક કરીશું.
                    </motion.span>
                  </motion.div>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer Animation: Fade Up on Scroll */}
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>સંપર્ક કરો</h3>
              <p>📧 Email:gujaaratidivyang212@gmail.com</p>
              <p>📞 ફોન: +91 9909654359</p>
              <p>🌐 વેબસાઈટ: www.aahairoil.com</p>
            </div>
            <div className="footer-section">
              <h3>ઝડપી લિંક્સ</h3>
              <a href="#home">મુખ્ય પેજ</a>
              <a href="#benefits">ફાયદાઓ</a>
              <a href="#about">અમારા વિશે</a>
              <a href="#order">ઓર્ડર કરો</a>
              <a href="#/admin" onClick={(e) => {
                e.preventDefault()
                window.location.hash = '#/admin'
                window.location.reload()
              }}>એડમિન</a>
            </div>
            <div className="footer-section">
              <h3>અમારા વિશે</h3>
              <p>૨૦ વર્ષથી શુદ્ધ આયુર્વેદિક હેર ઓઇલ બનાવતા અંબાલાના વારસાના વૈદ્ય.</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 AA Hair Oil (અંબાલા). બધા અધિકારો સુરક્ષિત.</p>
          </div>
      </div>
      </motion.footer>
    </>
  )
}

export default App