import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { demoCategories } from '../assets/demo'
import SectionHeading from './SectionHeading'

const CategoryCircles = () => {
  const { backendUrl, products } = useContext(ShopContext)
  const [categories, setCategories] = useState([])

  const fetchCategories = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/category/list')
      if (response.data.success) {
        // "Shop By Category" shows every category that exists.
        setCategories(response.data.categories)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => { fetchCategories() }, [])

  // With real categories, show each one with an image from one of its products.
  // Only fall back to the demo showcase when there are no categories at all.
  const usingReal = categories.length > 0
  const items = usingReal ? categories : demoCategories

  // Branded placeholder for a category that has no product image yet.
  const placeholder = (name) =>
    `https://placehold.co/400x400/F3E3D8/7B1530?text=${encodeURIComponent(name)}`

  const imageFor = (item, i) => {
    if (!usingReal) return item.image
    if (item.image) return item.image // admin-set category image, if ever added
    const product = products.find((p) => p.category === item.name && p.image && p.image[0])
    return product ? product.image[0] : placeholder(item.name)
  }

  return (
    <section className='py-10'>
      <SectionHeading title='Shop By Category' />
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6'>
        {items.map((item, i) => (
          <Link
            key={item._id || item.name}
            onClick={() => scrollTo(0, 0)}
            to={`/collection?category=${encodeURIComponent(item.name)}`}
            className='group flex flex-col items-center gap-3'
          >
            <div className='relative w-full aspect-[3/4] rounded-lg overflow-hidden ring-1 ring-beige shadow-sm bg-cream'>
              <img
                src={imageFor(item, i)}
                alt={item.name}
                className='w-full h-full object-cover group-hover:scale-105 transition duration-500'
              />
            </div>
            <span className='text-sm sm:text-base text-ink font-medium text-center'>{item.name}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default CategoryCircles
