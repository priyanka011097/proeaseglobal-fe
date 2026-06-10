import React from 'react'
import { useNavigate } from 'react-router-dom'

// Full-width promotional banner with a headline + CTA over an image.
// `align` controls whether the text sits on the left or right.
const PromoBanner = ({ image, title, subtitle, align = 'right', to = '/collection' }) => {
  const navigate = useNavigate()
  const textSide = align === 'right' ? 'justify-end text-right' : 'justify-start text-left'
  const gradient = align === 'right'
    ? 'bg-gradient-to-l from-cream/90 via-cream/30 to-transparent'
    : 'bg-gradient-to-r from-cream/90 via-cream/30 to-transparent'

  return (
    <section className='relative overflow-hidden rounded-sm my-8'>
      <div className='relative h-[220px] sm:h-[300px]'>
        <img src={image} alt='' className='absolute inset-0 w-full h-full object-cover' />
        <div className={`absolute inset-0 ${gradient}`} />
        <div className={`relative h-full flex items-center ${textSide}`}>
          <div className='px-6 sm:px-12 max-w-sm'>
            <h2 className='font-serif text-3xl sm:text-5xl text-maroon leading-tight'>{title}</h2>
            {subtitle && <p className='mt-2 text-sm sm:text-base text-ink/70'>{subtitle}</p>}
            <button
              onClick={() => navigate(to)}
              className='mt-4 inline-block bg-maroon text-white text-xs tracking-widest uppercase px-6 py-2.5 hover:bg-maroon-dark transition'
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PromoBanner
