// Demo content used to populate the storefront's look & feel when the backend
// has no products/categories yet. Reuses the bundled product imagery so the
// homepage renders fully even against an empty database.
import { products as bundledProducts } from './assets'

// A spread of bundled images to use for category tiles / banners.
const imgs = bundledProducts.flatMap((p) => p.image)
const pick = (i) => imgs[i % imgs.length]

export const demoCategories = [
  { name: 'Lehengas', image: pick(2) },
  { name: 'Sarees', image: pick(5) },
  { name: 'Salwar', image: pick(9) },
  { name: 'Kurtis', image: pick(13) },
  { name: 'Accessories', image: pick(17) },
  { name: 'Men', image: pick(1) },
  { name: 'Jewellery', image: pick(21) },
  { name: 'Kids', image: pick(24) },
]

// Turn the bundled products into "deal" cards with an MRP + discount so the
// carousels match the strikethrough-price styling of the reference design.
const discounts = [50, 5, 60, 30, 20, 55, 40, 70, 25]
const toDeal = (p, i) => {
  const off = discounts[i % discounts.length]
  const price = 1200 + ((i * 437) % 6000) // pseudo-realistic ethnic-wear prices
  const mrp = Math.round(price / (1 - off / 100))
  return {
    _id: p._id,
    name: p.name,
    image: p.image,
    price,
    oldPrice: mrp,
    discount: off,
  }
}

const rowFrom = (start, count) =>
  bundledProducts.slice(start, start + count).map(toDeal)

export const demoRows = [
  { title: 'Sarees', kicker: 'Shudh Desi Look', items: rowFrom(0, 8) },
  { title: 'Kurtis', kicker: 'Versatile Ensemble', items: rowFrom(8, 8) },
  { title: 'Salwar Kameez', kicker: 'Channel The Desi Swag', items: rowFrom(16, 8) },
  { title: 'Lehenga', kicker: 'Feel The Royalty', items: rowFrom(24, 8) },
]

export const demoRecommended = rowFrom(4, 8)
