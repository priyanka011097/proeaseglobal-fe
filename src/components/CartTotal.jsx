import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = () => {

    const { getCartAmount, fmt, promo, applyPromo, removePromo, getDiscount, getFinalAmount, shipping } = useContext(ShopContext);
    const [code, setCode] = useState('')

    const discount = getDiscount()

  return (
    <div className='w-full'>
      <div className='text-2xl'>
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>

      <div className='flex flex-col gap-2 mt-2 text-sm'>
            <div className='flex justify-between'>
                <p>Subtotal</p>
                <p>{fmt(getCartAmount())}</p>
            </div>
            {discount > 0 && (
              <>
                <hr />
                <div className='flex justify-between text-green-700'>
                    <p>Discount {promo?.code ? `(${promo.code})` : ''}</p>
                    <p>− {fmt(discount)}</p>
                </div>
              </>
            )}
            <hr />
            <div className='flex justify-between'>
                <p>Shipping</p>
                <p>{shipping > 0 ? fmt(shipping) : <span className='text-ink/50'>Enter pincode at checkout</span>}</p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <b>Total</b>
                <b>{fmt(getCartAmount() === 0 ? 0 : getFinalAmount() + shipping)}</b>
            </div>
      </div>

      {/* Promo code */}
      <div className='mt-5'>
        {promo ? (
          <div className='flex items-center justify-between border border-green-300 bg-green-50 rounded px-3 py-2 text-sm'>
            <span className='text-green-700'>Code <b>{promo.code}</b> applied</span>
            <button type='button' onClick={removePromo} className='text-red-500 hover:underline'>Remove</button>
          </div>
        ) : (
          <div className='flex gap-2'>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder='Promo code'
              className='flex-1 border px-3 py-2 text-sm uppercase'
            />
            <button
              type='button'
              onClick={() => applyPromo(code)}
              className='px-4 py-2 bg-maroon text-white text-sm rounded-sm'
            >Apply</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTotal
