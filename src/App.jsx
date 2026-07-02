import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Faq from './pages/Faq'
import BulkOrder from './pages/BulkOrder'
import LegalPage from './components/LegalPage'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Invoice from './pages/Invoice'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import AnnouncementBar from './components/AnnouncementBar'
import ThemeLoader from './components/ThemeLoader'
import Seo from './components/Seo'
import Footer from './components/Footer'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import LoginNudge from './components/LoginNudge'
import SearchBar from './components/SearchBar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify'

const App = () => {
  return (
    <div className='overflow-x-hidden'>
      <ToastContainer />
      <Seo />
      <ThemeLoader />
      <AnnouncementBar />
      <Navbar />
      <main className='max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10'>
        <SearchBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/catalog/:slug' element={<Home />} />
          <Route path='/collection' element={<Collection />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
        <Route path='/faq' element={<Faq />} />
        <Route path='/bulk-order' element={<BulkOrder />} />
        <Route path='/privacy' element={<LegalPage section='privacy' fallbackTitle='Privacy Policy' />} />
        <Route path='/terms' element={<LegalPage section='terms' fallbackTitle='Terms & Conditions' />} />
          <Route path='/product/:productId' element={<Product />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/wishlist' element={<Wishlist />} />
          <Route path='/login' element={<Login />} />
          <Route path='/place-order' element={<PlaceOrder />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/invoice/:orderId' element={<Invoice />} />
          <Route path='/verify' element={<Verify />} />
        </Routes>
      </main>
      <Footer />
      <FloatingWhatsApp />
      <LoginNudge />
    </div>
  )
}

export default App
