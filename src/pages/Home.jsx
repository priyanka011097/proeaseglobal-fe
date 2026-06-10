import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { ShopContext } from '../context/ShopContext'
import Hero from '../components/Hero'
import TrustBadges from '../components/TrustBadges'
import OfferBanner from '../components/OfferBanner'
import CategoryCircles from '../components/CategoryCircles'
import SectionHeading from '../components/SectionHeading'
import PromoBanner from '../components/PromoBanner'
import ProductCarousel from '../components/ProductCarousel'
import { demoRows, demoRecommended } from '../assets/demo'

// Promo copy paired with each demo section (used only when the catalog is empty).
const promos = {
  Sarees: { title: 'Classic Allure', subtitle: 'Reinventing Tradition One Saree at a Time', align: 'right' },
  Kurtis: { title: 'Comfort Meets Style', subtitle: 'Your go-to Kurti for every Occasion', align: 'left' },
  'Salwar Kameez': { title: 'Grace Redefined', subtitle: 'A Salwar made for Timeless Appeal', align: 'right' },
  Lehenga: { title: 'Royal Radiance', subtitle: 'Luxurious Lehengas that capture Tradition & Beauty', align: 'left' },
}

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

  const hasCatalog = products.length > 0

  // Product sections: one per category the admin toggled "show on home",
  // that actually has products. (The circles above show every category.)
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

      {hasCatalog ? (
        sections.map((g) => (
          <section key={g.name}>
            <SectionHeading title={g.name} />
            <ProductCarousel items={g.items} />
          </section>
        ))
      ) : (
        // Empty catalog → show the demo showcase so the page still looks complete.
        <>
          {demoRows.map((row) => {
            const promo = promos[row.title]
            return (
              <section key={row.title}>
                <SectionHeading title={row.title} />
                {promo && (
                  <PromoBanner image={row.items[0].image[0]} title={promo.title} subtitle={promo.subtitle} align={promo.align} />
                )}
                <ProductCarousel kicker={row.kicker} items={row.items} />
              </section>
            )
          })}
          <SectionHeading title='Recommended For You' />
          <ProductCarousel items={demoRecommended} />
        </>
      )}
    </div>
  )
}

export default Home
