import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { ShopContext } from '../context/ShopContext'
import SectionHeading from '../components/SectionHeading'
import Seo from '../components/Seo'

const fallback = {
  image: '',
  logo: '',
  text1: 'ProEase Global was born out of a passion for quality and craftsmanship — bringing premium, thoughtfully made products to homes and businesses everywhere.',
  text2: "Since our beginning, we've curated a diverse selection of high-quality products, sourced from trusted makers, that cater to every taste and need.",
  missionTitle: 'Our Mission',
  missionText: 'Our mission is to empower customers with choice, convenience, and confidence.',
  visionTitle: 'Our Vision',
  visionText: '',
  points: [],
}

const About = () => {
  const { backendUrl } = useContext(ShopContext)
  // Seed from cached About content so a reload shows the real image/text
  // immediately instead of flashing the bundled demo image.
  const [about, setAbout] = useState(() => {
    try {
      const cached = JSON.parse(localStorage.getItem('aboutPage'))
      return cached ? { ...fallback, ...cached } : fallback
    } catch { return fallback }
  })

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await axios.get(backendUrl + '/api/pages/get')
        if (res.data.success && res.data.pages?.about) {
          setAbout({ ...fallback, ...res.data.pages.about })
          localStorage.setItem('aboutPage', JSON.stringify(res.data.pages.about))
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchPages()
  }, [backendUrl])

  return (
    <div>
      <Seo title='About Us' />
      <SectionHeading title='About Us' />

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        {about.image ? (
          <img className='w-full md:max-w-[450px] rounded-sm object-cover' src={about.image} alt='' />
        ) : (
          <div className='w-full md:max-w-[450px] aspect-[3/4] rounded-sm bg-cream animate-pulse' />
        )}
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-ink/70'>
          {about.logo && <img src={about.logo} alt='' className='h-28 w-auto object-contain self-start mb-2' />}
          {about.text1 && <p>{about.text1}</p>}
          {about.text2 && <p>{about.text2}</p>}
          {about.missionTitle && <b className='text-ink'>{about.missionTitle}</b>}
          {about.missionText && <p>{about.missionText}</p>}
          {about.visionTitle && about.visionText && <b className='text-ink'>{about.visionTitle}</b>}
          {about.visionText && <p>{about.visionText}</p>}
        </div>
      </div>

      {about.points && about.points.length > 0 && (
        <>
          <SectionHeading title='Why Choose Us' />
          <div className='flex flex-col md:flex-row text-sm mb-20'>
            {about.points.map((p, i) => (
              <div key={i} className='border border-beige px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-4'>
                <b className='text-ink'>{p.title}</b>
                <p className='text-ink/60'>{p.text}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default About
