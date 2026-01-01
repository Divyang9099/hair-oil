import { useState, useEffect, lazy, Suspense } from 'react'
import './App.css'
// Lazy Load Admin Components for separate bundle (Faster Load Times)
const AdminLogin = lazy(() => import('./AdminLogin'));
const AdminDashboard = lazy(() => import('./AdminDashboard'));
import LandingPage from './pages/LandingPage'
import CursorFollower from './components/CursorFollower'
import API_BASE_URL from './config'

// simple Loading spinner for Admin
const LoadingFallback = () => (
  <div style={{
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#F5F5DC',
    color: '#006400',
    fontSize: '1.5rem',
    fontWeight: 'bold'
  }}>
    Loading Admin Panel...
  </div>
);

function App() {
  // --- THEME TOGGLE LOGIC ---
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);

  // --- ADMIN LOGIC ---
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

  // --- SERVER WAKE-UP & KEEP ALIVE ---
  const [serverStatus, setServerStatus] = useState('sleeping') // sleeping, waking, ready

  useEffect(() => {
    const wakeUpServer = async () => {
      if (serverStatus === 'ready') return;

      setServerStatus('waking')
      try {
        await fetch(`${API_BASE_URL}/api/orders`, { method: 'GET' })
        setServerStatus('ready')
        console.log('Server is ready!')
      } catch (err) {
        console.log('Server ping sent')
        // Even if it fails (e.g. 404), the server is likely awake
        setServerStatus('ready')
      }
    }

    wakeUpServer()

    // Ping every 4 minutes to keep Render server awake while user is on the site
    const keepAliveInterval = setInterval(wakeUpServer, 4 * 60 * 1000)

    return () => clearInterval(keepAliveInterval)
  }, []) // Empty dependency array ensuring it runs once on mount

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

  // --- RENDER ---
  if (isAdminPage) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        {isAdminLoggedIn ? (
          <AdminDashboard onLogout={handleAdminLogout} />
        ) : (
          <AdminLogin onLogin={handleAdminLogin} />
        )}
      </Suspense>
    );
  }

  return (
    <>
      <CursorFollower />
      <LandingPage
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        serverStatus={serverStatus}
      />
    </>
  )
}

export default App