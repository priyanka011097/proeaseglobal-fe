import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import ProductItem from '../components/ProductItem'
import Seo from '../components/Seo'

const Wishlist = () => {
  const { products, wishlist } = useContext(ShopContext)

  const items = products.filter((p) => wishlist.includes(p._id))

  return (
    <div className='border-t pt-10'>
      <Seo title='My Wishlist' />
      <h1 className='font-serif text-2xl text-maroon mb-6'>My Wishlist</h1>

      {items.length === 0 ? (
        <div className='py-20 text-center text-ink/60'>
          <p className='mb-4'>Your wishlist is empty.</p>
          <Link to='/collection' className='inline-block bg-maroon text-white px-6 py-3 text-sm rounded-sm'>
            Browse Products
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8'>
          {items.map((item) => (
            <ProductItem key={item._id} product={item} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Wishlist
