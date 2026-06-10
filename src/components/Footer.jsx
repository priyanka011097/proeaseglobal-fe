import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'

// Preset icons the admin can choose from for the footer feature strip.
// Keys must match the options offered in the admin Footer page.
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

const FeatureIcon = ({ name }) => (
  <svg width='34' height='34' viewBox='0 0 24 24' fill='none' stroke='#7B1530' strokeWidth='1.3'>
    {ICONS[name] || ICONS.truck}
  </svg>
)

// Content is editable from the admin panel (Footer). These act as a fallback
// if the API is unavailable.
const fallback = {
  brandName: 'PROEASE GLOBAL',
  features: [
    { icon: 'truck', heading: 'Hassle-Free Delivery' },
    { icon: 'globe', heading: 'Ships Worldwide' },
    { icon: 'shield', heading: '100% Money Back Guarantee' },
  ],
  description: 'Quality products, handcrafted with care. Bringing premium materials to your home and business.',
  quickLinksTitle: 'Quick Links',
  quickLinks: [
    { label: 'Track Order', url: '/orders' },
    { label: 'Help Desk', url: '/contact' },
    { label: 'Contact Us', url: '/contact' },
    { label: 'Privacy', url: '/' },
    { label: 'FAQ', url: '/contact' },
    { label: 'About Us', url: '/about' },
    { label: 'Terms', url: '/' },
  ],
  contactTitle: 'Get in Touch',
  email: 'info@proeaseglobal.com',
  phone: '+91 91369 61528',
  hours: 'Mon – Sat, 10am – 7pm',
  copyright: '© 2026 Proease Global. All rights reserved.',
  tagline: 'Made with care.',
}

// Render an internal route via <Link>, anything starting with http / mailto /
// tel as a plain <a>.
const FooterLink = ({ url, children }) => {
  const external = /^(https?:|mailto:|tel:)/.test(url || '')
  if (external) return <a href={url} className='hover:text-ink transition'>{children}</a>
  return <Link to={url || '/'} className='hover:text-ink transition'>{children}</Link>
}

const Footer = () => {
  const { backendUrl } = useContext(ShopContext)
  const [footer, setFooter] = useState(fallback)

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await axios.get(backendUrl + '/api/footer/get')
        if (res.data.success && res.data.footer) setFooter(res.data.footer)
      } catch (error) {
        console.log(error)
      }
    }
    fetchFooter()
  }, [backendUrl])

  const links = footer.quickLinks && footer.quickLinks.length > 0 ? footer.quickLinks : fallback.quickLinks
  const half = Math.ceil(links.length / 2)
  const col1 = links.slice(0, half)
  const col2 = links.slice(half)

  const features = footer.features && footer.features.length > 0 ? footer.features : fallback.features

  return (
    <footer className='bg-white mt-16'>
      <div className='max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-12'>
        {/* Feature / trust strip */}
        {features.length > 0 && (
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 pb-10 mb-10 border-b border-[#e8dcc0]'>
            {features.map((f, i) => (
              <div key={i} className='flex flex-col items-center gap-2 text-center'>
                <FeatureIcon name={f.icon} />
                <p className='text-ink font-medium text-sm'>{f.heading}</p>
              </div>
            ))}
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
          {/* Brand + description */}
          <div>
            <h3 className='text-xl tracking-[0.18em] text-ink'>{footer.brandName}</h3>
            <p className='mt-4 text-ink/70 text-sm leading-relaxed max-w-xs'>{footer.description}</p>
          </div>

          {/* Quick links (two sub-columns) */}
          <div>
            <p className='text-lg text-ink mb-5'>{footer.quickLinksTitle}</p>
            <div className='grid grid-cols-2 gap-x-8 gap-y-3 text-sm text-ink/70'>
              <ul className='flex flex-col gap-3'>
                {col1.map((l, i) => <li key={i}><FooterLink url={l.url}>{l.label}</FooterLink></li>)}
              </ul>
              <ul className='flex flex-col gap-3'>
                {col2.map((l, i) => <li key={i}><FooterLink url={l.url}>{l.label}</FooterLink></li>)}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className='text-lg text-ink mb-5'>{footer.contactTitle}</p>
            <ul className='flex flex-col gap-3 text-sm text-ink/70'>
              {footer.email && <li><a href={`mailto:${footer.email}`} className='hover:text-ink transition'>{footer.email}</a></li>}
              {footer.phone && <li><a href={`tel:${footer.phone.replace(/\s/g, '')}`} className='hover:text-ink transition'>{footer.phone}</a></li>}
              {footer.hours && <li>{footer.hours}</li>}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className='border-t border-[#e8dcc0] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm'>
          <p className='text-ink/70'>{footer.copyright}</p>
          {footer.tagline && <p className='text-[#9b7d2e]'>{footer.tagline}</p>}
        </div>
      </div>
    </footer>
  )
}

export default Footer
