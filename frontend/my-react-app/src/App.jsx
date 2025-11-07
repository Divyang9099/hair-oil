import { useState, useEffect } from 'react'
import './App.css'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'

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
      const response = await fetch('http://localhost:3000/api/orders', {
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
      <header>
        <nav className="container">
          <a href="#" className="logo">AA Hair Oil (અંબાલા)</a>
          <ul className="nav-links">
            <li><a href="#home">મુખ્ય પેજ</a></li>
            <li><a href="#benefits">ફાયદાઓ</a></li>
            <li><a href="#about">અમારા વિશે</a></li>
            <li><a href="#order">ઓર્ડર કરો</a></li>
          </ul>
        </nav>
      </header>

      <section id="home" className="hero">
        <div className="container">
          <h1>AA હેર ઓઇલ: ૨૦ વર્ષનો અનુભવ, અંબાલાની ઔષધીઓનો વારસો</h1>
          <p className="sub-headline">ખરતા વાળ, ખોડો, અને ઉંદરી જેવી સમસ્યાઓ માટે આયુર્વેદિક ઉપચાર.</p>
          <a href="#order" className="btn-primary">હમણાં જ ઓર્ડર કરો</a>
        </div>
      </section>

      <section id="benefits" className="section">
        <div className="container">
          <h2 className="section-title">ફાયદાઓ</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">💪</div>
              <h3>ખરતા વાળ અટકે</h3>
              <p>આયુર્વેદિક ઘટકો વાળના મૂળને મજબૂત બનાવે છે અને ખરતા વાળને અટકાવે છે. નિયમિત ઉપયોગથી વાળ ઘન અને મજબૂત બને છે.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">✨</div>
              <h3>ખોડો દૂર થાય</h3>
              <p>શુદ્ધ હર્બલ ઘટકો ખોડાની સમસ્યાને મૂળથી દૂર કરે છે. સ્કેલ્પ સ્વચ્છ અને સ્વસ્થ રહે છે, ખોડાની ખંજવાળ દૂર થાય છે.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🌱</div>
              <h3>ઉંદરીમાં રાહત</h3>
              <p>પરંપરાગત આયુર્વેદિક ફોર્મ્યુલા ઉંદરીની સમસ્યામાં રાહત આપે છે અને નવા વાળની વૃદ્ધિને પ્રોત્સાહન આપે છે.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="section about-section">
        <div className="container">
          <h2 className="section-title">૨૦ વર્ષની શુદ્ધતા અને વિશ્વાસ</h2>
          <div className="about-content">
            <p className="about-text">
              અમારું AA હેર ઓઇલ માત્ર એક પ્રોડક્ટ નથી, તે અમારા પરિવારની ૨૦ વર્ષની મહેનત અને પરંપરાનો વારસો છે. અંબાલાના અનુભવી વૈદ્ય દ્વારા તૈયાર કરવામાં આવેલું આ તેલ શુદ્ધ આયુર્વેદિક ઘટકો સાથે બનાવવામાં આવે છે. અમે દરેક બાટલીમાં ગુણવત્તા અને શુદ્ધતાની ખાતરી આપીએ છીએ.
            </p>
            <div className="video-placeholder">
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
                  <div className="video-placeholder-content">
                    <div className="play-button">▶</div>
                    <div className="video-title">જુઓ! શુદ્ધ તેલ બનાવવાની પ્રક્રિયા</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="order" className="section order-section">
        <div className="container">
          <h2 className="section-title">ઓર્ડર કરો</h2>
          <div className="order-container">
            <div className="product-card">
              <div className="product-image">🛢️</div>
              <h3 className="product-name">AA Hair Oil</h3>
              <p className="product-size">{formData.bottleSize}</p>
              <p className="product-price">₹{getPricePerUnit()}/-</p>
              <p style={{ color: 'var(--text-dark)', marginTop: '1rem' }}>શુદ્ધ આયુર્વેદિક હેર ઓઇલ</p>
            </div>
            <div className="order-form">
              <h3 style={{ color: 'var(--deep-green)', marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.5rem' }}>ઓર્ડર ફોર્મ</h3>
              <form id="orderForm" onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label htmlFor="name">નામ *</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required 
                    placeholder="તમારું પૂર્ણ નામ લખો"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">ફોન નંબર *</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    required 
                    placeholder="તમારો ફોન નંબર લખો"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address">સરનામું *</label>
                  <textarea 
                    id="address" 
                    name="address" 
                    required 
                    placeholder="તમારું સંપૂર્ણ સરનામું લખો"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bottleSize">બાટલીનું કદ *</label>
                  <select
                    id="bottleSize"
                    name="bottleSize"
                    required
                    value={formData.bottleSize}
                    onChange={handleInputChange}
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
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="quantity">પ્રમાણ *</label>
                  <input 
                    type="number" 
                    id="quantity" 
                    name="quantity" 
                    required 
                    min="1"
                    placeholder="પ્રમાણ દાખલ કરો"
                    value={formData.quantity}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--cream-beige)', borderRadius: '5px', border: '2px solid var(--deep-green)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--deep-green)' }}>બાટલી કદ:</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{formData.bottleSize}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--deep-green)' }}>એકમ ભાવ:</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>₹{getPricePerUnit()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--deep-green)' }}>પ્રમાણ:</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{formData.quantity}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '2px solid var(--deep-green)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--deep-green)', fontSize: '1.2rem' }}>કુલ રકમ:</span>
                    <span style={{ fontWeight: 700, color: 'var(--deep-green)', fontSize: '1.2rem' }}>₹{calculateTotal()}</span>
                  </div>
      </div>
                <button type="submit" className="btn-secondary" disabled={isSubmitting}>
                  {isSubmitting ? 'પ્રક્રિયા ચાલી રહી છે...' : 'ઓર્ડર કન્ફર્મ કરો'}
        </button>
                {showSuccessMessage && (
                  <div className="success-message">
                    ધન્યવાદ! તમારો ઓર્ડર પ્રાપ્ત થયો છે. અમે ટૂંક સમયમાં તમારો સંપર્ક કરીશું.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>સંપર્ક કરો</h3>
              <p>📧 Email: info@aahairoil.com</p>
              <p>📞 ફોન: +91 XXXXX XXXXX</p>
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
      </footer>
    </>
  )
}

export default App
