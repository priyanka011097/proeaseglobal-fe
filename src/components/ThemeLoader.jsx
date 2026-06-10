import { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'

// Applies the admin-configured background/text colors to the whole storefront
// by setting CSS variables on <html>. Renders nothing.
const ThemeLoader = () => {
  const { backendUrl } = useContext(ShopContext)

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const res = await axios.get(backendUrl + '/api/settings/get')
        if (res.data.success && res.data.settings) {
          const { themeBg, themeText } = res.data.settings
          const root = document.documentElement
          if (themeBg) root.style.setProperty('--page-bg', themeBg)
          if (themeText) root.style.setProperty('--page-text', themeText)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchTheme()
  }, [backendUrl])

  return null
}

export default ThemeLoader
