import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { ShopContext } from '../context/ShopContext'

const SELLER = {
  name: 'ProEase Global',
  line1: 'Rajkot, Gujarat, India',
  email: 'info@proeaseglobal.com',
  phone: '+91 91369 61528',
}

const sym = (c) => (c === 'USD' ? '$' : '₹')
const money = (c, n) => `${sym(c)} ${c === 'USD' ? Number(n || 0).toFixed(2) : Math.round(n || 0)}`

const Invoice = () => {
  const { orderId } = useParams()
  const { backendUrl, token } = useContext(ShopContext)
  const [order, setOrder] = useState(null)
  const [brand, setBrand] = useState({ name: SELLER.name, logo: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } })
        if (res.data.success) {
          setOrder(res.data.orders.find((o) => o._id === orderId) || null)
        }
        const s = await axios.get(backendUrl + '/api/settings/get')
        if (s.data.success && s.data.settings) {
          setBrand({ name: s.data.settings.brandName || SELLER.name, logo: s.data.settings.logo || '' })
        }
      } catch (e) {
        console.log(e)
      } finally {
        setLoading(false)
      }
    }
    if (token) load(); else setLoading(false)
  }, [orderId, token, backendUrl])

  if (loading) return <div className='py-20 text-center text-ink/50'>Loading invoice…</div>
  if (!order) return <div className='py-20 text-center text-ink/60'>Invoice not found. Please make sure you are logged in.</div>

  const cur = order.currency || 'INR'
  const a = order.address || {}
  const invoiceNo = 'INV-' + String(order._id).slice(-8).toUpperCase()
  const date = new Date(order.date).toLocaleDateString('en-GB')
  const subtotal = order.items.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0)

  return (
    <div className='border-t pt-8'>
      <style>{`@media print {
        body * { visibility: hidden !important; }
        #invoice, #invoice * { visibility: visible !important; }
        #invoice { position: absolute; left: 0; top: 0; width: 100%; }
        .no-print { display: none !important; }
      }`}</style>

      <div className='no-print flex justify-end gap-3 mb-4 max-w-3xl mx-auto'>
        <button onClick={() => window.print()} className='bg-maroon text-white px-5 py-2 text-sm rounded-sm'>Download / Print PDF</button>
      </div>

      <div id='invoice' className='max-w-3xl mx-auto bg-white border border-gray-200 p-8 text-sm text-ink'>
        {/* Header */}
        <div className='flex items-start justify-between border-b pb-4 mb-4'>
          <div className='flex items-center gap-3'>
            {brand.logo && <img src={brand.logo} alt='' className='h-12 w-auto object-contain' />}
            <div>
              <h1 className='text-xl font-semibold text-maroon'>{brand.name}</h1>
              <p className='text-xs text-ink/60'>{SELLER.line1}</p>
            </div>
          </div>
          <div className='text-right'>
            <p className='font-semibold text-lg'>TAX INVOICE</p>
            <p className='text-xs text-ink/60'>Original for Recipient</p>
          </div>
        </div>

        {/* Meta + addresses */}
        <div className='grid grid-cols-2 gap-6 mb-6'>
          <div>
            <p className='font-medium mb-1'>Bill To / Ship To:</p>
            <p>{a.firstName} {a.lastName}</p>
            <p className='text-ink/70'>{a.street}</p>
            <p className='text-ink/70'>{a.city}, {a.state}, {a.country} - {a.zipcode}</p>
            <p className='text-ink/70'>Phone: {a.phone}</p>
            {a.email && <p className='text-ink/70'>{a.email}</p>}
          </div>
          <div className='text-right'>
            <p><span className='text-ink/60'>Invoice No:</span> <b>{invoiceNo}</b></p>
            <p><span className='text-ink/60'>Invoice Date:</span> {date}</p>
            <p><span className='text-ink/60'>Order ID:</span> {order._id}</p>
            <p><span className='text-ink/60'>Payment:</span> {order.paymentMethod} ({order.payment ? 'Paid' : 'Pending'})</p>
            <p><span className='text-ink/60'>Status:</span> {order.status}</p>
          </div>
        </div>

        {/* Sold By */}
        <div className='mb-6'>
          <p className='font-medium mb-1'>Sold By:</p>
          <p>{brand.name}</p>
          <p className='text-ink/70'>{SELLER.line1}</p>
          <p className='text-ink/70'>{SELLER.email} · {SELLER.phone}</p>
        </div>

        {/* Items */}
        <table className='w-full border border-gray-300 text-xs mb-4'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='border border-gray-300 p-2 text-left w-8'>#</th>
              <th className='border border-gray-300 p-2 text-left'>Description</th>
              <th className='border border-gray-300 p-2'>Size</th>
              <th className='border border-gray-300 p-2 text-right'>Unit Price</th>
              <th className='border border-gray-300 p-2 text-center'>Qty</th>
              <th className='border border-gray-300 p-2 text-right'>Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((it, i) => (
              <tr key={i}>
                <td className='border border-gray-300 p-2'>{i + 1}</td>
                <td className='border border-gray-300 p-2'>
                  {it.name}
                  {it.sku && <span className='block text-ink/50'>SKU: {it.sku}</span>}
                </td>
                <td className='border border-gray-300 p-2 text-center'>{it.size || '-'}</td>
                <td className='border border-gray-300 p-2 text-right'>{money(cur, it.price)}</td>
                <td className='border border-gray-300 p-2 text-center'>{it.quantity}</td>
                <td className='border border-gray-300 p-2 text-right'>{money(cur, (Number(it.price) || 0) * (Number(it.quantity) || 0))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className='flex justify-end'>
          <table className='text-sm'>
            <tbody>
              <tr><td className='py-1 pr-8 text-ink/60'>Subtotal</td><td className='py-1 text-right'>{money(cur, subtotal)}</td></tr>
              <tr><td className='py-1 pr-8 text-ink/60'>Shipping</td><td className='py-1 text-right'>{money(cur, 0)}</td></tr>
              <tr className='border-t'><td className='py-2 pr-8 font-semibold'>Total</td><td className='py-2 text-right font-semibold'>{money(cur, order.amount)}</td></tr>
            </tbody>
          </table>
        </div>

        <p className='text-xs text-ink/50 mt-8 border-t pt-4'>
          Prices are inclusive of all applicable taxes. This is a computer-generated invoice and does not require a signature.
          Thank you for shopping with {brand.name}.
        </p>
      </div>
    </div>
  )
}

export default Invoice
