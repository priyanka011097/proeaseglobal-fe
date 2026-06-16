import React, { useRef } from 'react'
import ProductItem from './ProductItem'

// A horizontally scrolling row of product cards, optionally preceded by a
// small "kicker" label (e.g. "Shudh Desi Look").
const ProductCarousel = ({ kicker, items }) => {
  const scroller = useRef(null)

  const scrollBy = (dir) => {
    if (scroller.current) {
      scroller.current.scrollBy({ left: dir * 320, behavior: 'smooth' })
    }
  }

  if (!items || items.length === 0) return null

  return (
    <div className='relative my-6'>
      {kicker && <h3 className='font-semibold text-ink mb-4'>{kicker}</h3>}

      <button
        onClick={() => scrollBy(-1)}
        aria-label='Scroll left'
        className='hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow items-center justify-center text-maroon hover:bg-maroon hover:text-white transition'
      >‹</button>

      <div ref={scroller} className='no-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-2'>
        {items.map((item, index) => (
          <div key={item._id || index} className='shrink-0 w-40 sm:w-48'>
            <ProductItem product={item} />
          </div>
        ))}
      </div>

      <button
        onClick={() => scrollBy(1)}
        aria-label='Scroll right'
        className='hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow items-center justify-center text-maroon hover:bg-maroon hover:text-white transition'
      >›</button>
    </div>
  )
}

export default ProductCarousel
