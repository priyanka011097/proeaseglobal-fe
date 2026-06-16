import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'

const ProductItem = ({ product }) => {
  const { isInWishlist, toggleWishlist, getPricing } = useContext(ShopContext)
  if (!product) return null

  const id = product._id
  const { symbol, final, original } = getPricing(product)
  const discount = original ? Math.round(((original - final) / original) * 100) : 0
  const wished = isInWishlist(id)

  const onWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(id)
  }

  const show = (n) => symbol === '$' ? n.toFixed(2) : Math.round(n)

  return (
    <Link onClick={() => scrollTo(0, 0)} className='block text-ink/80 group' to={`/product/${id}`}>
      <div className='relative overflow-hidden rounded-sm bg-cream'>
        <img className='w-full aspect-[3/4] object-cover group-hover:scale-105 transition duration-500' src={product.image[0]} alt={product.name} />
        <button
          type='button'
          onClick={onWishlist}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          className='absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white transition'
        >
          <svg width='18' height='18' viewBox='0 0 24 24' fill={wished ? '#7B1530' : 'none'} stroke={wished ? '#7B1530' : '#555'} strokeWidth='1.8'>
            <path d='M12 21s-7.5-4.6-10-9.3C.6 8.5 2 5 5.3 5 7.3 5 8.9 6.2 12 9c3.1-2.8 4.7-4 6.7-4C22 5 23.4 8.5 22 11.7 19.5 16.4 12 21 12 21Z' strokeLinejoin='round' />
          </svg>
        </button>
      </div>
      <p className='pt-3 pb-1 text-sm line-clamp-1'>{product.name}</p>
      <div className='flex items-center gap-2 flex-wrap'>
        <span className='text-sm font-semibold text-ink'>{symbol} {show(final)}</span>
        {original && (
          <span className='text-xs text-ink/40 line-through'>{symbol} {show(original)}</span>
        )}
        {discount > 0 ? (
          <span className='text-xs font-semibold text-sale'>({discount}% OFF)</span>
        ) : null}
      </div>
    </Link>
  )
}

export default ProductItem
