import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'
import SectionHeading from '../components/SectionHeading'
import { countries } from '../assets/countries'

const PURPOSES = ['Reselling', 'Events', 'Personal', 'Corporate', 'Others']

const empty = {
  name: '', quantity: '', location: '', contact: '', email: '',
  category: '', productLink: '', country: '', purpose: '', message: '',
}

const BulkOrder = () => {
  const { backendUrl } = useContext(ShopContext)
  const [form, setForm] = useState(empty)
  const [categories, setCategories] = useState([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(backendUrl + '/api/category/list')
        if (res.data.success) setCategories(res.data.categories)
      } catch (error) {
        console.log(error)
      }
    }
    fetchCategories()
  }, [backendUrl])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await axios.post(backendUrl + '/api/inquiry/add', form)
      if (res.data.success) {
        toast.success(res.data.message)
        setForm(empty)
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = 'w-full px-3 py-2.5 border border-beige rounded-sm bg-white outline-none focus:border-maroon'
  const label = 'mb-1.5 text-sm text-ink/70'

  return (
    <div className='mb-24'>
      <SectionHeading title='Bulk Order Inquiry' />
      <p className='text-center text-ink/60 max-w-2xl mx-auto -mt-2 mb-8'>
        Looking to order in bulk? Fill in the details below and our team will get back to you with a custom quote.
      </p>

      <form onSubmit={onSubmit} className='max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5'>
        <div className='flex flex-col'>
          <label className={label}>Name *</label>
          <input className={inputClass} value={form.name} onChange={set('name')} required placeholder='Your full name' />
        </div>

        <div className='flex flex-col'>
          <label className={label}>Quantity *</label>
          <input className={inputClass} value={form.quantity} onChange={set('quantity')} required placeholder='e.g. 500 units' />
        </div>

        <div className='flex flex-col'>
          <label className={label}>Contact number *</label>
          <input className={inputClass} value={form.contact} onChange={set('contact')} required placeholder='Phone / WhatsApp' />
        </div>

        <div className='flex flex-col'>
          <label className={label}>Email *</label>
          <input type='email' className={inputClass} value={form.email} onChange={set('email')} required placeholder='you@example.com' />
        </div>

        <div className='flex flex-col'>
          <label className={label}>Location / City</label>
          <input className={inputClass} value={form.location} onChange={set('location')} placeholder='City / State' />
        </div>

        <div className='flex flex-col'>
          <label className={label}>Country</label>
          <select className={inputClass} value={form.country} onChange={set('country')}>
            <option value=''>Select country</option>
            {countries.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className='flex flex-col'>
          <label className={label}>Product Category</label>
          <select className={inputClass} value={form.category} onChange={set('category')}>
            <option value=''>Select category</option>
            {categories.map((c) => <option key={c._id || c.name} value={c.name}>{c.name}</option>)}
          </select>
        </div>

        <div className='flex flex-col'>
          <label className={label}>Purpose</label>
          <select className={inputClass} value={form.purpose} onChange={set('purpose')}>
            <option value=''>Select purpose</option>
            {PURPOSES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className='flex flex-col sm:col-span-2'>
          <label className={label}>Product Link / Code <span className='text-ink/40'>(optional)</span></label>
          <input className={inputClass} value={form.productLink} onChange={set('productLink')} placeholder='Paste a product link or SKU code' />
        </div>

        <div className='flex flex-col sm:col-span-2'>
          <label className={label}>Message</label>
          <textarea rows={4} className={inputClass} value={form.message} onChange={set('message')} placeholder='Tell us more about your requirement…' />
        </div>

        <div className='sm:col-span-2'>
          <button type='submit' disabled={submitting} className='bg-maroon text-white text-sm tracking-widest uppercase px-8 py-3 hover:bg-maroon-dark transition disabled:opacity-50'>
            {submitting ? 'Submitting…' : 'Submit Inquiry'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default BulkOrder
