import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const delivery_fee = 0;
    const FALLBACK_USD_RATE = 88   // INR per 1 USD, used until the live rate loads

    // Region: 'IN' (India, ₹) or 'INTL' (abroad, $). Detected by IP, overridable.
    const [region, setRegion] = useState(() => localStorage.getItem('region') || 'IN')
    const [usdRate, setUsdRate] = useState(() => Number(localStorage.getItem('usdRate')) || FALLBACK_USD_RATE)

    const currency = region === 'IN' ? '₹ ' : '$ '
    const isIN = region === 'IN'

    const toUSD = (inr) => Math.round((Number(inr || 0) / usdRate) * 100) / 100

    // Final unit price in the ACTIVE currency (used for cart + checkout amounts).
    const unitPrice = (product) => {
        if (!product) return 0
        if (isIN) return Number(product.price || 0)
        return toUSD(Number(product.abroadPrice || product.price || 0))
    }

    // Display pricing for product cards / product page: { symbol, final, original }.
    // `original` is the struck-through price (null when there's no discount to show).
    const getPricing = (product) => {
        if (!product) return { symbol: '₹', final: 0, original: null }
        if (isIN) {
            const final = Number(product.price || 0)
            const orig = Number(product.originalPrice || 0)
            return { symbol: '₹', final, original: orig > final ? orig : null }
        }
        const finalInr = Number(product.abroadPrice || product.price || 0)
        // No discount shown in USD — international prices display flat, with no struck-through MRP.
        return { symbol: '$', final: toUSD(finalInr), original: null }
    }

    // Format a number in the active currency (₹ = integer, $ = 2 decimals).
    const fmt = (amount) => isIN ? `₹ ${Math.round(amount)}` : `$ ${Number(amount).toFixed(2)}`

    // Currency code sent to the payment gateway with the order.
    const payCurrency = isIN ? 'INR' : 'USD'

    const chooseRegion = (r) => {
        setRegion(r)
        localStorage.setItem('region', r)
        localStorage.setItem('regionManual', '1')   // stop IP auto-detect from overriding
    }
    // Strip any trailing slash so `${backendUrl}/api/...` never produces a
    // double slash (which Vercel 308-redirects and breaks CORS).
    const backendUrl = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/+$/, '')
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [promo, setPromo] = useState(null);   // { code, type, value } once applied
    const [shipping, setShipping] = useState(0); // shipping charge in the ACTIVE currency
    const [wishlist, setWishlist] = useState(() => {
        try { return JSON.parse(localStorage.getItem('wishlist')) || [] } catch { return [] }
    });
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('')
    const [seo, setSeo] = useState({ seoTitle: '', seoDescription: '', seoKeywords: '', seoImage: '', brandName: 'ProEase Global' });
    const navigate = useNavigate();


    const addToCart = async (itemId, size) => {

        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);

        if (token) {
            try {

                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })

            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }

    }

    const toggleWishlist = (itemId) => {
        setWishlist((prev) => {
            const next = prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
            localStorage.setItem('wishlist', JSON.stringify(next))
            if (!prev.includes(itemId)) toast.success('Added to wishlist')
            return next
        })
    }

    const isInWishlist = (itemId) => wishlist.includes(itemId)

    const getWishlistCount = () => wishlist.length

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {

        let cartData = structuredClone(cartItems);

        cartData[itemId][size] = quantity;

        setCartItems(cartData)

        if (token) {
            try {

                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })

            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }

    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += unitPrice(itemInfo) * cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        // Round to a clean value in the active currency.
        return isIN ? Math.round(totalAmount) : Math.round(totalAmount * 100) / 100;
    }

    // Cart subtotal expressed in INR (used to validate promo min-order in INR).
    const getCartAmountInr = () => {
        let total = 0
        for (const id in cartItems) {
            const p = products.find((x) => x._id === id)
            if (!p) continue
            const unitInr = Number(p.abroadPrice && !isIN ? p.abroadPrice : p.price) || 0
            for (const size in cartItems[id]) total += unitInr * (cartItems[id][size] || 0)
        }
        return Math.round(total)
    }

    // Discount in the ACTIVE currency, recomputed from the current subtotal.
    const getDiscount = () => {
        if (!promo) return 0
        const sub = getCartAmount()
        let d = 0
        if (promo.type === 'percent') d = sub * (Number(promo.value) || 0) / 100
        else d = isIN ? Number(promo.value) || 0 : toUSD(Number(promo.value) || 0)   // flat value stored in INR
        d = Math.min(d, sub)
        return isIN ? Math.round(d) : Math.round(d * 100) / 100
    }

    // Total the customer pays, after discount.
    const getFinalAmount = () => {
        const t = getCartAmount() - getDiscount()
        const v = t < 0 ? 0 : t
        return isIN ? Math.round(v) : Math.round(v * 100) / 100
    }

    const applyPromo = async (code) => {
        const clean = (code || '').trim()
        if (!clean) { toast.error('Enter a promo code'); return }
        try {
            const res = await axios.post(backendUrl + '/api/promo/validate', { code: clean, subtotalInr: getCartAmountInr() })
            if (res.data.success) {
                setPromo({ code: res.data.code, type: res.data.type, value: res.data.value })
                toast.success(`Code ${res.data.code} applied`)
            } else {
                setPromo(null)
                toast.error(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error('Could not apply code')
        }
    }

    const removePromo = () => setPromo(null)

    const getProductsData = async () => {
        try {

            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.success) {
                setProducts(response.data.products.reverse())
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getUserCart = async ( token ) => {
        try {

            const response = await axios.post(backendUrl + '/api/cart/get',{},{headers:{token}})
            if (response.data.success) {
                const serverCart = response.data.cartData || {}

                // Merge any items the user added while logged out (guest cart held
                // in `cartItems`) into their server cart, so logging in never wipes it.
                const guestCart = cartItems
                const merged = structuredClone(serverCart)
                const toSync = []
                for (const itemId in guestCart) {
                    for (const size in guestCart[itemId]) {
                        const qty = guestCart[itemId][size]
                        if (qty > 0) {
                            if (!merged[itemId]) merged[itemId] = {}
                            merged[itemId][size] = (merged[itemId][size] || 0) + qty
                            toSync.push({ itemId, size, quantity: merged[itemId][size] })
                        }
                    }
                }

                setCartItems(merged)

                // Persist the merged guest items to the backend.
                for (const u of toSync) {
                    await axios.post(backendUrl + '/api/cart/update', u, { headers: { token } })
                }
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getSeoData = async () => {
        try {
            const res = await axios.get(backendUrl + '/api/settings/get')
            if (res.data.success && res.data.settings) {
                const s = res.data.settings
                setSeo({
                    seoTitle: s.seoTitle || '',
                    seoDescription: s.seoDescription || '',
                    seoKeywords: s.seoKeywords || '',
                    seoImage: s.seoImage || '',
                    brandName: s.brandName || 'ProEase Global',
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Detect the visitor's region by IP (unless they've manually chosen a currency).
    const detectRegion = async () => {
        if (localStorage.getItem('regionManual')) return
        try {
            const res = await fetch('https://ipapi.co/country/')
            const code = (await res.text()).trim().toUpperCase()
            const r = code === 'IN' ? 'IN' : 'INTL'
            setRegion(r)
            localStorage.setItem('region', r)
        } catch (error) {
            console.log('region detect failed', error)
        }
    }

    // Live INR→USD rate, cached for a day; falls back to the constant above.
    const loadRate = async () => {
        try {
            const cached = JSON.parse(localStorage.getItem('usdRateCache') || 'null')
            if (cached && (Date.now() - cached.t) < 24 * 60 * 60 * 1000) {
                setUsdRate(cached.rate)
                return
            }
            const res = await fetch('https://open.er-api.com/v6/latest/USD')
            const data = await res.json()
            const rate = data?.rates?.INR
            if (rate) {
                setUsdRate(rate)
                localStorage.setItem('usdRate', String(rate))
                localStorage.setItem('usdRateCache', JSON.stringify({ rate, t: Date.now() }))
            }
        } catch (error) {
            console.log('rate load failed', error)
        }
    }

    useEffect(() => {
        getProductsData()
        getSeoData()
        detectRegion()
        loadRate()
    }, [])

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
        }
        if (token) {
            getUserCart(token)
        }
    }, [token])

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart,setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token, seo,
        wishlist, toggleWishlist, isInWishlist, getWishlistCount,
        region, isIN, chooseRegion, usdRate, unitPrice, getPricing, fmt, payCurrency, toUSD,
        promo, applyPromo, removePromo, getDiscount, getFinalAmount,
        shipping, setShipping
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )

}

export default ShopContextProvider;