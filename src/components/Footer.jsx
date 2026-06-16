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

// Filled brand glyphs for the social icons (24x24, fill=currentColor).
const SOCIAL_ICONS = {
  facebook: <path d='M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z' />,
  instagram: <path d='M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4a3.7 3.7 0 0 1-1.4-.9 3.7 3.7 0 0 1-.9-1.4c-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.9-.1Zm0 1.8c-3.1 0-3.5 0-4.7.1-1.1 0-1.7.2-2.1.4-.5.2-.9.4-1.3.8-.4.4-.6.8-.8 1.3-.2.4-.3 1-.4 2.1-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c0 1.1.2 1.7.4 2.1.2.5.4.9.8 1.3.4.4.8.6 1.3.8.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1 0 1.7-.2 2.1-.4.5-.2.9-.4 1.3-.8.4-.4.6-.8.8-1.3.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c0-1.1-.2-1.7-.4-2.1a3.5 3.5 0 0 0-.8-1.3 3.5 3.5 0 0 0-1.3-.8c-.4-.2-1-.3-2.1-.4-1.2-.1-1.6-.1-4.7-.1Zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8Zm0 8.1a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Zm6.2-8.3a1.1 1.1 0 1 1-2.3 0 1.1 1.1 0 0 1 2.3 0Z' />,
  linkedin: <path d='M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2ZM8 19H5V9h3v10ZM6.5 7.7a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6ZM19 19h-3v-5.3c0-1.3-.5-2.1-1.6-2.1-.9 0-1.4.6-1.6 1.2-.1.2-.1.5-.1.8V19h-3V9h3v1.3c.4-.7 1.2-1.6 2.9-1.6 2.1 0 3.7 1.4 3.7 4.3V19Z' />,
  whatsapp: <path d='M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1a7.7 7.7 0 0 1-2.3-1.4 8.6 8.6 0 0 1-1.6-2c-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.1c-.2-.5-.4-.5-.6-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.1 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.4ZM12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2Zm0 18.3a8.3 8.3 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.3 8.3 0 1 1 12 20.3Z' />,
}

const normalizeWhatsapp = (v) => {
  if (!v) return ''
  if (/^https?:/i.test(v)) return v
  return `https://wa.me/${v.replace(/[^\d]/g, '')}`
}

const SocialIcons = ({ social }) => {
  if (!social) return null
  const items = [
    { key: 'facebook', url: social.facebook },
    { key: 'instagram', url: social.instagram },
    { key: 'linkedin', url: social.linkedin },
    { key: 'whatsapp', url: normalizeWhatsapp(social.whatsapp) },
  ].filter((s) => s.url)
  if (items.length === 0) return null
  return (
    <div className='flex items-center gap-3 mt-5'>
      {items.map((s) => (
        <a
          key={s.key}
          href={s.url}
          target='_blank'
          rel='noopener noreferrer'
          aria-label={s.key}
          className='w-9 h-9 flex items-center justify-center rounded-full bg-[#7B1530] text-white hover:bg-[#4CAF2E] transition'
        >
          <svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor'>{SOCIAL_ICONS[s.key]}</svg>
        </a>
      ))}
    </div>
  )
}

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
    { label: 'Privacy', url: '/privacy' },
    { label: 'FAQ', url: '/faq' },
    { label: 'About Us', url: '/about' },
    { label: 'Terms', url: '/terms' },
  ],
  contactTitle: 'Get in Touch',
  email: 'info@proeaseglobal.com',
  phone: '+91 91369 61528',
  hours: 'Mon – Sat, 10am – 7pm',
  social: { facebook: '', instagram: '', linkedin: '', whatsapp: '' },
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
  // Start with an empty feature strip so it never flashes defaults before load
  // and respects an admin who has removed all items.
  const [footer, setFooter] = useState({ ...fallback, features: [] })

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

  // Use exactly what the admin configured — no default fallback, so removing
  // all items hides the strip entirely.
  const features = Array.isArray(footer.features) ? footer.features : []

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
            <SocialIcons social={footer.social} />
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
