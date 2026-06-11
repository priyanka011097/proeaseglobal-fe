import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Hero = () => {
  const { backendUrl } = useContext(ShopContext)
  const navigate = useNavigate()
  const [banners, setBanners] = useState([])
  const [current, setCurrent] = useState(0)

  const fetchBanners = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/banner/list')
      if (response.data.success) setBanners(response.data.banners)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => { fetchBanners() }, [])

  // Only show banners the admin has actually added — no demo fallback.
  const slides = banners

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 4500)
    return () => clearInterval(timer)
  }, [slides.length])

  useEffect(() => { if (current >= slides.length) setCurrent(0) }, [slides.length, current])

  // Nothing configured → render nothing.
  if (slides.length === 0) return null

  const slide = slides[current]
  const next = () => setCurrent((p) => (p + 1) % slides.length)
  const prev = () => setCurrent((p) => (p - 1 + slides.length) % slides.length)

  const desktopSrc = slide.desktopImage || slide.image
  const mobileSrc = slide.mobileImage || slide.desktopImage || slide.image
  const hasText = slide.heading || slide.subText || slide.offer
  const goToLink = () => { if (slide.link) navigate(slide.link) }

  return (
    <section className='relative overflow-hidden w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]'>
      <div className={`relative ${slide.link ? 'cursor-pointer' : ''}`} onClick={goToLink}>
        {/* Full banner, uncropped, but capped to a shorter height. Mobile image
            on small screens, desktop image otherwise. */}
        <img src={mobileSrc} alt='' className='sm:hidden block w-full h-auto' />
        <img src={desktopSrc} alt='' className='hidden sm:block w-full h-auto' />

        {/* Overlay only when the admin provided text (designed banners can omit it) */}
        {hasText && (
          <>
            <div className='absolute inset-0 bg-gradient-to-r from-cream/95 via-cream/40 to-transparent' />
            <div className='absolute inset-0 flex items-center'>
              <div className='max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-10'>
                <div className='max-w-md text-maroon'>
                  {slide.heading && <h1 className='font-serif text-3xl sm:text-5xl lg:text-6xl leading-tight'>{slide.heading}</h1>}
                  {slide.subText && <p className='mt-3 text-sm sm:text-base text-ink/70 max-w-sm'>{slide.subText}</p>}
                  {slide.offer && <p className='mt-4 font-serif text-2xl sm:text-4xl text-maroon'>{slide.offer}</p>}
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(slide.link || '/collection') }}
                    className='mt-5 inline-block bg-maroon text-white text-sm tracking-widest uppercase px-7 py-3 hover:bg-maroon-dark transition'
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {slides.length > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); prev() }} aria-label='Previous slide' className='absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white w-9 h-9 rounded-full flex items-center justify-center shadow text-maroon z-10'>‹</button>
            <button onClick={(e) => { e.stopPropagation(); next() }} aria-label='Next slide' className='absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white w-9 h-9 rounded-full flex items-center justify-center shadow text-maroon z-10'>›</button>
            <div className='absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10'>
              {slides.map((s, i) => (
                <button key={s._id} onClick={(e) => { e.stopPropagation(); setCurrent(i) }} aria-label={`Go to slide ${i + 1}`}
                  className={`w-2.5 h-2.5 rounded-full transition ${i === current ? 'bg-maroon' : 'bg-white/70'}`} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default Hero
