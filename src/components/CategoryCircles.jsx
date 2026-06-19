import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
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

  // Only show real categories — no demo fallback. Nothing configured → render nothing.
  if (categories.length === 0) return null
  const items = categories

  // Branded placeholder for a category that has no product image yet.
  const placeholder = (name) =>
    `https://placehold.co/400x400/F3E3D8/7B1530?text=${encodeURIComponent(name)}`

  const imageFor = (item) => {
    if (item.image) return item.image // admin-set category image, if ever added
    const product = products.find((p) => p.category === item.name && p.image && p.image[0])
    return product ? product.image[0] : placeholder(item.name)
  }

  // Always lay the categories out in 2 rows. The smaller half goes on top,
  // the larger half on the bottom (e.g. 7 categories → 3 then 4).
  const firstRowCount = Math.floor(items.length / 2)
  const rows = [items.slice(0, firstRowCount), items.slice(firstRowCount)]

  const renderCard = (item, i) => (
    <Link
      key={item._id || item.name}
      onClick={() => scrollTo(0, 0)}
      to={`/collection?category=${encodeURIComponent(item.name)}`}
      className='group flex flex-col items-center gap-3 w-[140px] sm:w-[170px] md:w-[200px]'
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
  )

  return (
    <section className='py-10'>
      <SectionHeading title='Shop By Category' />
      <div className='flex flex-col gap-4 sm:gap-6'>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className='flex flex-wrap justify-center gap-4 sm:gap-6'>
            {row.map((item, i) => renderCard(item, rowIndex * firstRowCount + i))}
          </div>
        ))}
      </div>
    </section>
  )
}

export default CategoryCircles
