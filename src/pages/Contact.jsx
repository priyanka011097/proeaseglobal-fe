import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import SectionHeading from '../components/SectionHeading'

const fallback = {
  image: '',
  storeTitle: 'Our Store',
  address: 'Near Bombay Plaza, Suite 350, Rajkot, Gujarat, India',
  phone: '+91 91369 61528',
  email: 'info@proeaseglobal.com',
  careersTitle: 'Careers at ProEase Global',
  careersText: 'Learn more about our teams and job openings.',
}

const Contact = () => {
  const { backendUrl } = useContext(ShopContext)
  const [contact, setContact] = useState(fallback)

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await axios.get(backendUrl + '/api/pages/get')
        if (res.data.success && res.data.pages?.contact) setContact({ ...fallback, ...res.data.pages.contact })
      } catch (error) {
        console.log(error)
      }
    }
    fetchPages()
  }, [backendUrl])

  return (
    <div>
      <SectionHeading title='Contact Us' />

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px] rounded-sm object-cover' src={contact.image || assets.contact_img} alt='' />
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
