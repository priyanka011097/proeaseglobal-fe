import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'

// Preset icons the admin can choose from (keys match the admin Trust page).
const ICONS = {
  truck: <path d='M1 7h11v9H1zM12 10h5l3 3v3h-8z M5 17a1.6 1.6 0 1 0 0 .01 M17 17a1.6 1.6 0 1 0 0 .01' strokeLinejoin='round' />,
  globe: <><circle cx='12' cy='12' r='9' /><path d='M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18' /></>,
  shield: <path d='M12 3l8 3v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-3Z M9 12l2 2 4-4' strokeLinejoin='round' strokeLinecap='round' />,
  leaf: <path d='M20 4C8 4 4 12 4 20c8 0 16-4 16-16Z M9 15c3-3 6-5 9-7' strokeLinejoin='round' strokeLinecap='round' />,
  headset: <path d='M4 13v-1a8 8 0 0 1 16 0v1 M4 13a2 2 0 0 1 2 2v2a2 2 0 0 1-4 0v-2a2 2 0 0 1 2-2Z M20 13a2 2 0 0 0-2 2v2a2 2 0 0 0 4 0v-2a2 2 0 0 0-2-2Z M18 17v1a3 3 0 0 1-3 3h-3' strokeLinejoin='round' />,
  refresh: <path d='M21 12a9 9 0 1 1-3-6.7L21 7 M21 4v3h-3' strokeLinecap='round' strokeLinejoin='round' />,
  gift: <path d='M3 9h18v3H3zM4 12h16v9H4zM12 9v12 M12 9S11 3 8 3 5 7 12 9Zm0 0s1-6 4-6 1 4-4 6Z' strokeLinejoin='round' />,
  lock: <path d='M6 11h12v9H6zM9 11V8a3 3 0 0 1 6 0v3' strokeLinejoin='round' strokeLinecap='round' />,
  star: <path d='M12 2l2.9 6.3 6.9.6-5.2 4.5 1.6 6.7L12 17.8 5.8 20.6l1.6-6.7L2.2 8.9l6.9-.6L12 2Z' strokeLinejoin='round' />,
  heart: <path d='M12 21s-7-4.6-9.3-9C1 8.5 2.7 5 6 5c2 0 3.2 1.2 4 2.4C10.8 6.2 12 5 14 5c3.3 0 5 3.5 3.3 7-2.3 4.4-9.3 9-9.3 9Z' strokeLinejoin='round' />,
}

const BadgeIcon = ({ name }) => (
  <svg width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='#7B1530' strokeWidth='1.3'>
    {ICONS[name] || ICONS.truck}
  </svg>
)

// Content is editable from the admin panel (Trust Badges). Fallback if the
// API is unavailable.
const fallback = {
  items: [
    { icon: 'truck', text: 'Worldwide Shipping' },
    { icon: 'shield', text: 'Quality Product' },
    { icon: 'star', text: '6000+ Reviews' },
  ],
  active: true,
}

const TrustBadges = () => {
  const { backendUrl } = useContext(ShopContext)
  // Start empty so nothing renders until the real data is fetched (no flash).
  const [trust, setTrust] = useState(null)

  useEffect(() => {
    const fetchTrust = async () => {
      try {
        const res = await axios.get(backendUrl + '/api/trust/get')
        if (res.data.success && res.data.trust) setTrust(res.data.trust)
      } catch (error) {
        console.log(error)
      }
    }
    fetchTrust()
  }, [backendUrl])

  if (!trust || trust.active === false) return null

  const items = trust.items && trust.items.length > 0 ? trust.items : []
  if (items.length === 0) return null

  return (
    <section className='bg-white border-y border-cream w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] relative'>
      <div className='max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-cream'>
        {items.map((it, i) => (
          <div key={i} className='flex flex-col items-center gap-2 py-7 px-4 text-center'>
            <BadgeIcon name={it.icon} />
            <p className='font-medium text-ink'>{it.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TrustBadges
