import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = () => {

    const {delivery_fee,getCartAmount,fmt} = useContext(ShopContext);

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
            {delivery_fee > 0 && (
              <>
                <hr />
                <div className='flex justify-between'>
                    <p>Shipping Fee</p>
                    <p>{fmt(delivery_fee)}</p>
                </div>
              </>
            )}
            <hr />
            <div className='flex justify-between'>
                <b>Total</b>
                <b>{fmt(getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee)}</b>
            </div>
      </div>
    </div>
  )
}

export default CartTotal
