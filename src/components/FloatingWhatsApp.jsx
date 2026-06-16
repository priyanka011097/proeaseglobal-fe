import React from 'react'

// Fixed WhatsApp chat button shown on every page.
const WHATSAPP_NUMBER = '919136961528' // +91 91369 61528

const FloatingWhatsApp = () => (
  <a
    href={`https://wa.me/${WHATSAPP_NUMBER}`}
    target='_blank'
    rel='noopener noreferrer'
    aria-label='Chat on WhatsApp'
    className='fixed bottom-4 right-4 z-50 w-11 h-11 flex items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105 active:scale-95 transition'
  >
    <svg width='22' height='22' viewBox='0 0 24 24' fill='currentColor'>
      <path d='M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1a7.7 7.7 0 0 1-2.3-1.4 8.6 8.6 0 0 1-1.6-2c-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.1c-.2-.5-.4-.5-.6-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.1 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.4ZM12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2Zm0 18.3a8.3 8.3 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.3 8.3 0 1 1 12 20.3Z' />
    </svg>
  </a>
)

export default FloatingWhatsApp
