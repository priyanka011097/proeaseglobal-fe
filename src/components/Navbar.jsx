import React, { useContext, useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ShopContext } from '../context/ShopContext'

// Primary navigation.
const navLinks = [
  { label: 'HOME', to: '/' },
  { label: 'ABOUT US', to: '/about' },
  { label: 'PRODUCTS', to: '/collection' },
  { label: 'CONTACT US', to: '/contact' },
  { label: 'FAQ', to: '/faq' },
  { label: 'BULK ORDER INQUIRY', to: '/bulk-order' },
]

// Built-in mark, used when no logo image has been uploaded in the admin.
const DefaultMark = ({ brandName }) => (
  <>
    <svg width='52' height='44' viewBox='0 0 64 56' fill='none'>
      {/* leaf */}
      <path d='M52 4 C 30 6, 24 26, 34 40 C 52 36, 58 18, 52 4 Z' fill='#4CAF2E' />
      <path d='M50 8 C 42 16, 37 28, 35 39' stroke='#2E7D1E' strokeWidth='1.5' strokeLinecap='round' />
      {/* checkmark */}
      <path d='M6 30 L24 48 L40 18' stroke='#111' strokeWidth='6' strokeLinecap='round' strokeLinejoin='round' fill='none' />
    </svg>
    <span className='mt-1 text-[15px] font-bold tracking-[0.12em] text-ink'>{brandName || 'PROEASEGLOBAL'}</span>
  </>
)

const Logo = ({ branding }) => {
  const {
    logo, brandName, logoPosition = 'left', logoHeight = 56,
    logoWidth = 0, logoFit = 'contain', logoPosX = 50, logoPosY = 50,
  } = branding || {}

  const margin = logoPosition === 'center' ? 'mx-auto' : logoPosition === 'right' ? 'ml-auto' : ''
  const imgStyle = {
    height: `${logoHeight}px`,
    width: logoWidth > 0 ? `${logoWidth}px` : 'auto',
    objectFit: logoFit,
    objectPosition: `${logoPosX}% ${logoPosY}%`,
  }

  return (
    <Link to='/' className={`flex flex-col items-center leading-none select-none ${margin}`}>
      {logo
        ? <img src={logo} alt={brandName || 'Logo'} style={imgStyle} />
        : <DefaultMark brandName={brandName} />}
    </Link>
  )
}

const Navbar = () => {
  const [visible, setVisible] = useState(false)
  const [branding, setBranding] = useState({ logo: '', brandName: 'PROEASEGLOBAL' })
  const navigate = useNavigate()
  const { getCartCount, token, setToken, setCartItems, backendUrl } = useContext(ShopContext)

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const res = await axios.get(backendUrl + '/api/settings/get')
        if (res.data.success && res.data.settings) setBranding(res.data.settings)
      } catch (error) {
        console.log(error)
      }
    }
    fetchBranding()
  }, [backendUrl])

  const logout = () => {
    navigate('/login')
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
  }

  const linkClass = ({ isActive }) =>
    `px-3 py-1.5 rounded-lg text-[13px] tracking-wide whitespace-nowrap transition ${
      isActive ? 'bg-[#F3DCBA] text-ink' : 'text-ink hover:text-[#4CAF2E]'
    }`

  return (
    <header className='bg-white sticky top-0 z-40'>
      {/* Top contact bar */}
      <div className='border-b border-[#efe4d3]'>
        <div className='max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-end gap-8 py-1.5 text-xs text-ink'>
          <a href='mailto:info@proeaseglobal.com' className='flex items-center gap-2 hover:text-[#4CAF2E] transition'>
            <svg width='16' height='16' viewBox='0 0 24 24' fill='currentColor'><path d='M2 5.5A1.5 1.5 0 0 1 3.5 4h17A1.5 1.5 0 0 1 22 5.5v13A1.5 1.5 0 0 1 20.5 20h-17A1.5 1.5 0 0 1 2 18.5v-13Zm2.2.5 7.8 5.6L19.8 6H4.2ZM20 7.7l-7.4 5.3a1 1 0 0 1-1.2 0L4 7.7V18h16V7.7Z' /></svg>
            <span>info@proeaseglobal.com</span>
          </a>
          <a href='tel:+919136961528' className='flex items-center gap-2 hover:text-[#4CAF2E] transition'>
            <svg width='16' height='16' viewBox='0 0 24 24' fill='currentColor'><path d='M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.3.2 2.5.57 3.6a1 1 0 0 1-.25 1l-2.2 2.2Z' /></svg>
            <span>+91 91369 61528</span>
          </a>
        </div>
      </div>

      {/* Main bar: logo + menu */}
      <div className='max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between py-2 border-b border-[#efe4d3]'>
        <Logo branding={branding} />

        <nav className='hidden lg:flex items-center gap-2 xl:gap-4'>
          {navLinks.map((l) => (
            <NavLink key={l.label} to={l.to} end={l.to === '/'} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
          {/* Account / login + cart */}
          <div className='flex items-center gap-4 ml-2'>
            <button onClick={() => navigate(token ? '/orders' : '/login')} className='text-ink hover:text-[#4CAF2E] transition' aria-label={token ? 'My account' : 'Login'}>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'><circle cx='12' cy='8' r='4' /><path d='M4 21c0-4 4-6 8-6s8 2 8 6' strokeLinecap='round' /></svg>
            </button>
            <Link to='/cart' className='relative text-ink hover:text-[#4CAF2E] transition' aria-label='Cart'>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'><circle cx='9' cy='20' r='1.6' /><circle cx='18' cy='20' r='1.6' /><path d='M2 3h3l2.2 12h11l2-8H6' strokeLinecap='round' strokeLinejoin='round' /></svg>
              {getCartCount() > 0 && (
                <span className='absolute -right-2 -top-2 min-w-4 h-4 px-1 flex items-center justify-center bg-[#4CAF2E] text-white rounded-full text-[10px] leading-none'>{getCartCount()}</span>
              )}
            </Link>
          </div>
        </nav>

        {/* Mobile menu button */}
        <button onClick={() => setVisible(true)} className='lg:hidden text-ink' aria-label='Open menu'>
          <svg width='28' height='28' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'><path d='M3 6h18M3 12h18M3 18h18' strokeLinecap='round' /></svg>
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-50 bg-white transition-transform lg:hidden ${visible ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className='flex items-center justify-between p-4 border-b border-[#efe4d3]'>
          <Logo branding={branding} />
          <button onClick={() => setVisible(false)} className='text-3xl text-ink' aria-label='Close menu'>×</button>
        </div>
        <div className='flex flex-col text-ink'>
          {navLinks.map((l) => (
            <NavLink key={l.label} onClick={() => setVisible(false)} end={l.to === '/'}
              className={({ isActive }) => `py-3 px-6 border-b border-[#efe4d3] ${isActive ? 'bg-[#F3DCBA]' : ''}`} to={l.to}>
              {l.label}
            </NavLink>
          ))}
          <NavLink onClick={() => setVisible(false)} className='py-3 px-6 border-b border-[#efe4d3]' to='/cart'>CART ({getCartCount()})</NavLink>
          {token && <button onClick={() => { setVisible(false); logout() }} className='py-3 px-6 text-left text-[#4CAF2E]'>Logout</button>}
        </div>
      </div>
    </header>
  )
}

export default Navbar
