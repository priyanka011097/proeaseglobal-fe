import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { GoogleLogin } from '@react-oauth/google'
import { ShopContext } from '../context/ShopContext'

const googleEnabled = !!import.meta.env.VITE_GOOGLE_CLIENT_ID && !import.meta.env.VITE_GOOGLE_CLIENT_ID.startsWith('---')

// Gently nudges logged-out visitors to sign in. Appears once per session a few
// seconds after landing; the visitor can dismiss it.
const LoginNudge = () => {
  const { token, navigate, backendUrl, setToken } = useContext(ShopContext)
  const [open, setOpen] = useState(false)

  const handleGoogle = async (credentialResponse) => {
    try {
      const res = await axios.post(backendUrl + '/api/user/google', { credential: credentialResponse.credential })
      if (res.data.success) {
        setToken(res.data.token)
        localStorage.setItem('token', res.data.token)
        setOpen(false)
        sessionStorage.setItem('loginNudgeDismissed', '1')
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) return                                   // already logged in
    if (sessionStorage.getItem('loginNudgeDismissed')) return
    const t = setTimeout(() => setOpen(true), 4000)     // show after 4s
    return () => clearTimeout(t)
  }, [token])

  // Hide immediately if the user logs in while it's open.
  useEffect(() => { if (token) setOpen(false) }, [token])

  const dismiss = () => {
    setOpen(false)
    sessionStorage.setItem('loginNudgeDismissed', '1')
  }

  const goLogin = () => {
    dismiss()
    navigate('/login')
  }

  if (!open || token) return null

  return (
    <div className='fixed inset-0 z-[70] bg-black/40 flex items-center justify-center p-4' onClick={dismiss}>
      <div
        className='bg-white rounded-lg max-w-sm w-full p-6 text-center relative shadow-xl'
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={dismiss} aria-label='Close' className='absolute top-3 right-4 text-2xl leading-none text-ink/40 hover:text-ink'>×</button>

        <div className='w-14 h-14 mx-auto mb-4 rounded-full bg-[#4CAF2E]/10 flex items-center justify-center'>
          <svg width='28' height='28' viewBox='0 0 24 24' fill='none' stroke='#4CAF2E' strokeWidth='1.8'>
            <circle cx='12' cy='8' r='4' /><path d='M4 21c0-4 4-6 8-6s8 2 8 6' strokeLinecap='round' />
          </svg>
        </div>

        <h3 className='font-serif text-xl text-maroon mb-2'>Welcome to ProEase Global</h3>
        <p className='text-sm text-ink/70 mb-5'>
          Sign in to save your wishlist, track orders and check out faster. It only takes a moment.
        </p>

        <button onClick={goLogin} className='w-full py-3 bg-maroon text-white rounded-sm text-sm font-medium hover:opacity-90 transition'>
          Login / Sign Up
        </button>

        {googleEnabled && (
          <>
            <div className='flex items-center gap-3 w-full my-3 text-ink/40 text-xs'>
              <span className='flex-1 h-px bg-cream' /> or <span className='flex-1 h-px bg-cream' />
            </div>
            <div className='flex justify-center'>
              <GoogleLogin
                onSuccess={handleGoogle}
                onError={() => toast.error('Google sign-in failed')}
                text='continue_with'
                shape='rectangular'
              />
            </div>
          </>
        )}

        <button onClick={dismiss} className='mt-3 text-sm text-ink/50 hover:text-ink'>
          Maybe later
        </button>
      </div>
    </div>
  )
}

export default LoginNudge
