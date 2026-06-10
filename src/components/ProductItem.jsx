import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'

const ProductItem = ({ id, image, name, price, oldPrice, discount }) => {
  const { currency } = useContext(ShopContext)

  return (
    <Link onClick={() => scrollTo(0, 0)} className='block text-ink/80 group' to={`/product/${id}`}>
      <div className='overflow-hidden rounded-sm bg-cream'>
        <img className='w-full aspect-[3/4] object-cover group-hover:scale-105 transition duration-500' src={image[0]} alt={name} />
      </div>
      <p className='pt-3 pb-1 text-sm line-clamp-1'>{name}</p>
      <div className='flex items-center gap-2 flex-wrap'>
        <span className='text-sm font-semibold text-ink'>{currency}{price}</span>
        {oldPrice && (
          <span className='text-xs text-ink/40 line-through'>{currency}{oldPrice}</span>
        )}
        {discount ? (
          <span className='text-xs font-semibold text-sale'>({discount}% OFF)</span>
        ) : null}
      </div>
    </Link>
  )
}

export default ProductItem
