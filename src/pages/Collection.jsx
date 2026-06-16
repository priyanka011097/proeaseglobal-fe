import React, { useContext, useEffect, useMemo, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import Seo from '../components/Seo';
import axios from 'axios';

const Collection = () => {

  const { products, search, showSearch, backendUrl, currency, unitPrice, region } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [sizeSel, setSizeSel] = useState([]);
  const [colorSel, setColorSel] = useState([]);
  const [fabricSel, setFabricSel] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortType, setSortType] = useState('relavent')
  const [categoryOptions, setCategoryOptions] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/category/list')
      if (response.data.success) setCategoryOptions(response.data.categories)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => { fetchCategories() }, [])

  useEffect(() => {
    const initial = searchParams.get('category')
    if (initial) setCategory([initial])
  }, [searchParams])

  // Distinct filter options derived from the catalogue.
  const sizeOptions = useMemo(() => [...new Set(products.flatMap(p => p.sizes || []))].filter(Boolean).sort(), [products])
  const colorOptions = useMemo(() => [...new Set(products.map(p => p.color).filter(Boolean))].sort(), [products])
  const fabricOptions = useMemo(() => [...new Set(products.map(p => p.fabric).filter(Boolean))].sort(), [products])

  // Generic checkbox toggler.
  const toggle = (setter) => (e) => {
    const v = e.target.value
    setter(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])
  }

  const applyFilter = () => {
    let pc = products.slice();

    if (showSearch && search) {
      pc = pc.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }
    if (category.length > 0) {
      pc = pc.filter(item => category.includes(item.category));
    }
    if (sizeSel.length > 0) {
      pc = pc.filter(item => (item.sizes || []).some(s => sizeSel.includes(s)))
    }
    if (colorSel.length > 0) {
      pc = pc.filter(item => colorSel.includes(item.color))
    }
    if (fabricSel.length > 0) {
      pc = pc.filter(item => fabricSel.includes(item.fabric))
    }
    if (minPrice !== '' && !isNaN(Number(minPrice))) {
      pc = pc.filter(item => unitPrice(item) >= Number(minPrice))
    }
    if (maxPrice !== '' && !isNaN(Number(maxPrice))) {
      pc = pc.filter(item => unitPrice(item) <= Number(maxPrice))
    }

    setFilterProducts(pc)
  }

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();
    switch (sortType) {
      case 'low-high': setFilterProducts(fpCopy.sort((a, b) => (unitPrice(a) - unitPrice(b)))); break;
      case 'high-low': setFilterProducts(fpCopy.sort((a, b) => (unitPrice(b) - unitPrice(a)))); break;
      default: applyFilter(); break;
    }
  }

  useEffect(() => { applyFilter() }, [category, sizeSel, colorSel, fabricSel, minPrice, maxPrice, search, showSearch, products, region])
  useEffect(() => { sortProduct() }, [sortType])

  const clearAll = () => {
    setCategory([]); setSizeSel([]); setColorSel([]); setFabricSel([]); setMinPrice(''); setMaxPrice('')
  }

  const boxClass = `border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      <Seo title={category.length === 1 ? category[0] : 'Shop All Products'} />

      {/* Filter Options */}
      <div className='w-full sm:w-56 sm:shrink-0'>
        <div className='flex items-center justify-between'>
          <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS
            <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
          </p>
          <button onClick={clearAll} className='text-xs text-maroon underline hidden sm:block'>Clear all</button>
        </div>

        {/* Category */}
        <div className={boxClass}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700 max-h-56 overflow-auto no-scrollbar'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" checked={category.length === 0} onChange={() => setCategory([])} /> All
            </p>
            {categoryOptions.map((item) => (
              <p className='flex gap-2' key={item._id}>
                <input className='w-3' type="checkbox" value={item.name} checked={category.includes(item.name)} onChange={toggle(setCategory)} /> {item.name}
              </p>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className={boxClass}>
          <p className='mb-3 text-sm font-medium'>PRICE ({currency.trim()})</p>
          <div className='flex items-center gap-2 text-sm pr-4'>
            <input type='number' min='0' value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder='Min' className='w-full border px-2 py-1' />
            <span className='text-gray-400'>–</span>
            <input type='number' min='0' value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder='Max' className='w-full border px-2 py-1' />
          </div>
        </div>

        {/* Size */}
        {sizeOptions.length > 0 && (
          <div className={boxClass}>
            <p className='mb-3 text-sm font-medium'>SIZE</p>
            <div className='flex flex-wrap gap-2 pr-4'>
              {sizeOptions.map((s) => (
                <label key={s} className={`text-xs px-2 py-1 border cursor-pointer ${sizeSel.includes(s) ? 'bg-maroon text-white border-maroon' : 'bg-white text-gray-700'}`}>
                  <input type='checkbox' value={s} checked={sizeSel.includes(s)} onChange={toggle(setSizeSel)} className='hidden' />{s}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Color */}
        {colorOptions.length > 0 && (
          <div className={boxClass}>
            <p className='mb-3 text-sm font-medium'>COLOR</p>
            <div className='flex flex-col gap-2 text-sm font-light text-gray-700 max-h-56 overflow-auto no-scrollbar pr-4'>
              {colorOptions.map((c) => (
                <p className='flex gap-2' key={c}>
                  <input className='w-3' type="checkbox" value={c} checked={colorSel.includes(c)} onChange={toggle(setColorSel)} /> {c}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Fabric */}
        {fabricOptions.length > 0 && (
          <div className={boxClass}>
            <p className='mb-3 text-sm font-medium'>FABRIC</p>
            <div className='flex flex-col gap-2 text-sm font-light text-gray-700 max-h-56 overflow-auto no-scrollbar pr-4'>
              {fabricOptions.map((f) => (
                <p className='flex gap-2' key={f}>
                  <input className='w-3' type="checkbox" value={f} checked={fabricSel.includes(f)} onChange={toggle(setFabricSel)} /> {f}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Side */}
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title
            text1={category.length === 1 ? category[0].toUpperCase() : (category.length > 1 ? 'SELECTED' : 'ALL')}
            text2={category.length === 1 ? 'COLLECTION' : 'COLLECTIONS'}
          />
          <select onChange={(e) => setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
            <option value="relavent">Sort by: Relavent</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        <p className='text-sm text-gray-400 mb-3'>{filterProducts.length} product(s)</p>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {filterProducts.map((item, index) => (
            <ProductItem key={index} product={item} />
          ))}
        </div>
      </div>

    </div>
  )
}

export default Collection
