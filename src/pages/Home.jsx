import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import Hero from '../components/Hero'
import TrustBadges from '../components/TrustBadges'
import OfferBanner from '../components/OfferBanner'
import CategoryCircles from '../components/CategoryCircles'
import SectionHeading from '../components/SectionHeading'
import ProductCarousel from '../components/ProductCarousel'

const Home = () => {
  const { products, backendUrl, catalogs } = useContext(ShopContext)
  const { slug } = useParams()
  const [categories, setCategories] = useState([])

  // Resolve which catalog this home page is for: the :slug in the URL, else the
  // first catalog (default landing). Falls back to "Apparels" before catalogs load.
  const activeCatalog = slug
    ? (catalogs.find((c) => c.slug === slug)?.name || slug)
    : (catalogs[0]?.name || 'Apparels')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(backendUrl + '/api/category/list', { params: { catalog: activeCatalog } })
        if (res.data.success) setCategories(res.data.categories)
      } catch (error) {
        console.log(error)
      }
    }
    fetchCategories()
  }, [backendUrl, activeCatalog])

  // Products in this catalog only.
  const catalogProducts = products.filter((p) => (p.catalog || 'Apparels') === activeCatalog)

  // Product sections: one per category the admin toggled "show on home",
  // that actually has products in this catalog.
  const sections = categories
    .filter((c) => c.showOnHome === true)
    .map((c) => ({ name: c.name, items: catalogProducts.filter((p) => p.category === c.name) }))
    .filter((g) => g.items.length > 0)

  // A catalog with no products yet (e.g. a freshly added Jewellery/Spices).
  const isEmpty = catalogProducts.length === 0

  return (
    <div>
      <Hero catalog={activeCatalog} />
      <TrustBadges catalog={activeCatalog} />
      <OfferBanner catalog={activeCatalog} />

      {isEmpty ? (
        <section className='py-20 flex flex-col items-center text-center'>
          <div className='w-16 h-16 rounded-full bg-cream ring-1 ring-beige flex items-center justify-center mb-5'>
            <svg width='30' height='30' viewBox='0 0 24 24' fill='none' stroke='#7B1530' strokeWidth='1.6'>
              <path d='M6 9h12l3 5-9 8-9-8 3-5Z' strokeLinejoin='round' />
              <path d='M6 9l2-4h8l2 4M9.5 9 12 22M14.5 9 12 22M3 14h18' strokeLinejoin='round' />
            </svg>
          </div>
          <h2 className='prata-regular text-2xl sm:text-3xl text-maroon'>{activeCatalog} — Coming Soon</h2>
          <p className='mt-3 max-w-md text-ink/60'>
            We're curating our {activeCatalog.toLowerCase()} collection. Check back shortly — beautiful pieces are on their way.
          </p>
          <a href='/' className='mt-6 inline-block bg-maroon text-white px-6 py-2.5 rounded-sm text-sm'>Browse other collections</a>
        </section>
      ) : (
        <>
          <CategoryCircles catalog={activeCatalog} />
          {sections.map((g) => (
            <section key={g.name}>
              <SectionHeading title={g.name} />
              <ProductCarousel items={g.items} />
            </section>
          ))}
        </>
      )}
    </div>
  )
}

export default Home
