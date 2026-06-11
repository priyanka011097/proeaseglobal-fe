import { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'

// Applies the admin-configured background/text colors to the whole storefront,
// and sets the browser tab favicon to the uploaded logo. Renders nothing.
const ThemeLoader = () => {
  const { backendUrl } = useContext(ShopContext)

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const res = await axios.get(backendUrl + '/api/settings/get')
        if (res.data.success && res.data.settings) {
          const { themeBg, themeText, logo } = res.data.settings
          const root = document.documentElement
          if (themeBg) root.style.setProperty('--page-bg', themeBg)
          if (themeText) root.style.setProperty('--page-text', themeText)

          // Use the uploaded logo as the favicon (kept in sync with admin).
          if (logo) {
            let link = document.querySelector("link[rel~='icon']")
            if (!link) {
              link = document.createElement('link')
              link.rel = 'icon'
              document.head.appendChild(link)
            }
            link.href = logo
          }
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
