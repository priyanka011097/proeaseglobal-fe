import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import RelatedProducts from '../components/RelatedProducts';
import Seo from '../components/Seo';

const Product = () => {

  const { productId } = useParams();
  const { products, currency, addToCart, navigate } = useContext(ShopContext);

  const handleAddToCart = () => {
    if (!size) { addToCart(productData._id, size); return } // addToCart shows the "select size" toast
    addToCart(productData._id, size)
    navigate('/cart')
  }
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('')
  const [size,setSize] = useState('')

  const fetchProductData = async () => {

    products.map((item) => {
      if (item._id === productId) {
        setProductData(item)
        setImage(item.image[0])
        return null;
      }
    })

  }

  useEffect(() => {
    fetchProductData();
  }, [productId,products])

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      <Seo title={productData.name} description={productData.description} image={productData.image?.[0]} type='product' />
      {/*----------- Product Data-------------- */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

        {/*---------- Product Images------------- */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
              {
                productData.image.map((item,index)=>(
                  <img onClick={()=>setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
                ))
              }
          </div>
          <div className='w-full sm:w-[80%]'>
              <img className='w-full h-auto' src={image} alt="" />
          </div>
        </div>

        {/* -------- Product Info ---------- */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          {productData.description && <p className='mt-3 text-ink/70 leading-relaxed sm:w-4/5'>{productData.description}</p>}
          <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
          <div className='flex flex-col gap-4 my-8'>
              <p>Select Size</p>
              <div className='flex gap-2 flex-wrap'>
                {productData.sizes.map((item,index)=>{
                  const s = (productData.stock || []).find((x) => x.size === item)
                  const hasStockInfo = !!s
                  const outOfStock = hasStockInfo && s.stock <= 0
                  return (
                    <button
                      onClick={()=> !outOfStock && setSize(item)}
                      disabled={outOfStock}
                      className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''} ${outOfStock ? 'opacity-40 line-through cursor-not-allowed' : ''}`}
                      key={index}
                    >{item}</button>
                  )
                })}
              </div>
              {size && (() => {
                const s = (productData.stock || []).find((x) => x.size === size)
                return s ? <p className='text-sm text-ink/60'>{s.stock > 0 ? `${s.stock} in stock` : 'Out of stock'}</p> : null
              })()}
          </div>
          <button onClick={handleAddToCart} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>ADD TO CART</button>
          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-ink/70 mt-5 sm:w-4/5'>
              <p className='font-medium text-ink mb-2'>Product Details</p>
              {productData.details && productData.details.length > 0 ? (
                <table className='w-full border border-cream'>
                  <tbody>
                    {productData.details.map((d, i) => (
                      <tr key={i} className='border-b border-cream last:border-0'>
                        <td className='py-2 px-3 bg-blush/50 font-medium text-ink w-1/2 align-top'>{d.label}</td>
                        <td className='py-2 px-3'>{d.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className='leading-relaxed whitespace-pre-line'>{productData.description}</p>
              )}
              {productData.sku && <p className='mt-3 text-ink/50'>SKU: {productData.sku}</p>}
          </div>
        </div>
      </div>

      {/* --------- display related products ---------- */}

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />

    </div>
  ) : <div className=' opacity-0'></div>
}

export default Product
