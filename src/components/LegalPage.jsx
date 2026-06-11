import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { ShopContext } from '../context/ShopContext'
import SectionHeading from './SectionHeading'
import Seo from './Seo'

// Renders an admin-editable legal page (Privacy / Terms) from /api/pages/get.
const LegalPage = ({ section, fallbackTitle }) => {
  const { backendUrl } = useContext(ShopContext)
  const [data, setData] = useState({ title: fallbackTitle, body: '' })

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await axios.get(backendUrl + '/api/pages/get')
        if (res.data.success && res.data.pages?.[section]) {
          const s = res.data.pages[section]
          setData({ title: s.title || fallbackTitle, body: s.body || '' })
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchPages()
  }, [backendUrl, section, fallbackTitle])

  return (
    <div className='mb-24'>
      <Seo title={data.title || fallbackTitle} />
      <SectionHeading title={data.title || fallbackTitle} />
      <div className='max-w-3xl mx-auto mt-4 text-ink/75 leading-relaxed whitespace-pre-line'>
        {data.body || 'Content coming soon.'}
      </div>
    </div>
  )
}

export default LegalPage
