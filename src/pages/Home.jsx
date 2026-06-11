import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { ShopContext } from '../context/ShopContext'
import Hero from '../components/Hero'
import TrustBadges from '../components/TrustBadges'
import OfferBanner from '../components/OfferBanner'
import CategoryCircles from '../components/CategoryCircles'
import SectionHeading from '../components/SectionHeading'
import ProductCarousel from '../components/ProductCarousel'

const Home = () => {
  const { products, backendUrl } = useContext(ShopContext)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(backendUrl + '/api/category/list')
        if (res.data.success) setCategories(res.data.categories)
      } catch (error) {
        console.log(error)
      }
    }
    fetchCategories()
  }, [backendUrl])

  // Product sections: one per category the admin toggled "show on home",
  // that actually has products. No demo fallback when the store is empty.
  const sections = categories
    .filter((c) => c.showOnHome === true)
    .map((c) => ({ name: c.name, items: products.filter((p) => p.category === c.name) }))
    .filter((g) => g.items.length > 0)

  return (
    <div>
      <Hero />
      <TrustBadges />
      <OfferBanner />
      <CategoryCircles />

      {sections.map((g) => (
        <section key={g.name}>
          <SectionHeading title={g.name} />
          <ProductCarousel items={g.items} />
        </section>
      ))}
    </div>
  )
}

export default Home
