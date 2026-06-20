import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { ShopContext } from '../context/ShopContext'
import SectionHeading from '../components/SectionHeading'
import Seo from '../components/Seo'

// Minimal defaults only — no stale hardcoded image/address, so a first load
// never flashes outdated content before the real values arrive.
const fallback = {
  image: '',
  storeTitle: '',
  address: '',
  phone: '',
  email: '',
  careersTitle: '',
  careersText: '',
}

const Contact = () => {
  const { backendUrl } = useContext(ShopContext)
  // Seed from cached contact content so a reload shows the real image/text
  // immediately instead of flashing the old defaults.
  const [contact, setContact] = useState(() => {
    try {
      const cached = JSON.parse(localStorage.getItem('contactPage'))
      return cached ? { ...fallback, ...cached } : fallback
    } catch { return fallback }
  })

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await axios.get(backendUrl + '/api/pages/get')
        if (res.data.success && res.data.pages?.contact) {
          setContact({ ...fallback, ...res.data.pages.contact })
          localStorage.setItem('contactPage', JSON.stringify(res.data.pages.contact))
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchPages()
  }, [backendUrl])

  return (
    <div>
      <Seo title='Contact Us' />
      <SectionHeading title='Contact Us' />

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        {contact.image ? (
          <img className='w-full md:max-w-[480px] rounded-sm object-cover' src={contact.image} alt='' />
        ) : (
          <div className='w-full md:max-w-[480px] aspect-[4/3] rounded-sm bg-cream animate-pulse' />
        )}
        <div className='flex flex-col justify-center items-start gap-6'>
          {contact.storeTitle && <p className='font-semibold text-xl text-ink'>{contact.storeTitle}</p>}
          {contact.address && <p className='text-ink/60 whitespace-pre-line'>{contact.address}</p>}
          {(contact.phone || contact.email) && (
            <p className='text-ink/60'>
              {contact.phone && <>Tel: {contact.phone}<br /></>}
              {contact.email && <>Email: {contact.email}</>}
            </p>
          )}
          {contact.careersTitle && <p className='font-semibold text-xl text-ink'>{contact.careersTitle}</p>}
          {contact.careersText && <p className='text-ink/60'>{contact.careersText}</p>}
        </div>
      </div>
    </div>
  )
}

export default Contact
