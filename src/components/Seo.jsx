import React, { useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import { ShopContext } from '../context/ShopContext'

// Sets the page <title> and meta tags (description, keywords, Open Graph,
// Twitter card). Page-level props override the site-wide SEO defaults set in
// admin → SEO / Metadata. Render anywhere in a page.
const Seo = ({ title, description, image, type = 'website' }) => {
  const { seo } = useContext(ShopContext)

  const siteName = seo?.brandName || 'ProEase Global'
  const baseTitle = seo?.seoTitle || siteName
  // Page title becomes "Product Name | Site Title"; otherwise the site title.
  const fullTitle = title ? `${title} | ${siteName}` : baseTitle
  const desc = description || seo?.seoDescription || ''
  const ogImage = image || seo?.seoImage || ''

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {desc && <meta name='description' content={desc} />}
      {seo?.seoKeywords && <meta name='keywords' content={seo.seoKeywords} />}

      {/* Open Graph (Facebook, WhatsApp, LinkedIn…) */}
      <meta property='og:title' content={fullTitle} />
      {desc && <meta property='og:description' content={desc} />}
      <meta property='og:type' content={type} />
      <meta property='og:site_name' content={siteName} />
      {ogImage && <meta property='og:image' content={ogImage} />}

      {/* Twitter */}
      <meta name='twitter:card' content={ogImage ? 'summary_large_image' : 'summary'} />
      <meta name='twitter:title' content={fullTitle} />
      {desc && <meta name='twitter:description' content={desc} />}
      {ogImage && <meta name='twitter:image' content={ogImage} />}
    </Helmet>
  )
}

export default Seo
