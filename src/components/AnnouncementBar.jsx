import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ShopContext } from '../context/ShopContext'

const AnnouncementBar = () => {
  const { backendUrl } = useContext(ShopContext)
  const navigate = useNavigate()
  const [data, setData] = useState({ text: '', active: false, link: '' })
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(backendUrl + '/api/settings/get')
        if (res.data.success && res.data.settings) {
          const s = res.data.settings
          const text = s.announcementText || ''
          setData({ text, active: s.announcementActive === true, link: s.announcementLink || '' })
          // Re-show when the message changes (dismissal is keyed to the text).
          if (sessionStorage.getItem('annDismissed') === text && text) setDismissed(true)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchSettings()
  }, [backendUrl])

  if (!data.active || !data.text || dismissed) return null

  const close = (e) => {
    e.stopPropagation()
    sessionStorage.setItem('annDismissed', data.text)
    setDismissed(true)
  }

  return (
    <div
      className={`relative bg-maroon-dark text-white text-center text-sm font-medium py-2 px-10 ${data.link ? 'cursor-pointer' : ''}`}
      onClick={() => data.link && navigate(data.link)}
    >
      <span>{data.text}</span>
      <button onClick={close} aria-label='Dismiss' className='absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-lg leading-none'>×</button>
    </div>
  )
}

export default AnnouncementBar
