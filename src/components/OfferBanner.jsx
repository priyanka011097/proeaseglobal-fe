import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'

// Content is editable from the admin panel (Offer Banner). These act as a
// fallback if the API is unavailable.
const fallback = {
  prefix: 'GET UPTO',
  highlight: '15%',
  suffix: 'CASH BACK',
  subText: 'ON SELECT PAYMENT METHODS',
  rightTitle: 'Wallet Offers',
  rightText: 'On Orders Above ₹2999',
  active: true,
}

const OfferBanner = () => {
  const { backendUrl } = useContext(ShopContext)
  const [offer, setOffer] = useState(fallback)

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const res = await axios.get(backendUrl + '/api/offer/get')
        if (res.data.success && res.data.offer) setOffer(res.data.offer)
      } catch (error) {
        console.log(error)
      }
    }
    fetchOffer()
  }, [backendUrl])

  // Hidden when the admin turns it off.
  if (offer.active === false) return null

  return (
    <section className='relative bg-beige overflow-hidden w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]'>
      <div className='max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 py-5 px-12 text-center'>
        {(offer.prefix || offer.highlight || offer.suffix || offer.subText) && (
          <p className='text-ink'>
            {offer.prefix && <span className='align-middle'>{offer.prefix} </span>}
            {offer.highlight && <span className='font-serif text-3xl sm:text-4xl text-maroon font-semibold align-middle'>{offer.highlight}</span>}
            {offer.suffix && <span className='align-middle font-semibold'> {offer.suffix}</span>}
            {offer.subText && <span className='block text-xs tracking-widest text-ink/60'>{offer.subText}</span>}
          </p>
        )}
        {(offer.rightTitle || offer.rightText) && (
          <>
            <span className='hidden sm:block h-10 w-px bg-maroon/30' />
            <p className='text-maroon font-semibold'>
              {offer.rightTitle} <span className='text-ink font-normal'>{offer.rightText}</span>
            </p>
          </>
        )}
      </div>
    </section>
  )
}

export default OfferBanner
