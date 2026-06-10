import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { ShopContext } from '../context/ShopContext'
import SectionHeading from '../components/SectionHeading'

const Faq = () => {
  const { backendUrl } = useContext(ShopContext)
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(0)

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const res = await axios.get(backendUrl + '/api/faq/get')
        if (res.data.success && res.data.faq?.items) setItems(res.data.faq.items)
      } catch (error) {
        console.log(error)
      }
    }
    fetchFaq()
  }, [backendUrl])

  return (
    <div className='mb-24'>
      <SectionHeading title='Frequently Asked Questions' />

      <div className='max-w-3xl mx-auto mt-6 flex flex-col gap-3'>
        {items.length === 0 && <p className='text-center text-ink/50'>No questions yet.</p>}
        {items.map((it, i) => {
          const isOpen = open === i
          return (
            <div key={i} className='border border-beige rounded-sm overflow-hidden'>
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                className='w-full flex items-center justify-between gap-4 text-left px-5 py-4 bg-white hover:bg-cream/40 transition'
              >
                <span className='font-medium text-ink'>{it.question}</span>
                <span className={`text-maroon text-xl leading-none transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
              </button>
              {isOpen && it.answer && (
                <div className='px-5 py-4 text-ink/70 text-sm border-t border-beige bg-blush/40 whitespace-pre-line'>{it.answer}</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Faq
