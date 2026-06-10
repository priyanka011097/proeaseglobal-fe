import React from 'react'

// A serif title inside a thin bordered box with a diamond flourish on each
// side — the boxed section titles ("SAREES", "KURTIS"...) of the reference.
const Flourish = () => (
  <span className='flex items-center gap-1 text-maroon/60'>
    <span className='w-8 h-px bg-maroon/40' />
    <svg width='14' height='10' viewBox='0 0 14 10' fill='currentColor'><path d='M7 0l3 5-3 5-3-5z' /></svg>
    <span className='w-8 h-px bg-maroon/40' />
  </span>
)

const SectionHeading = ({ title }) => {
  return (
    <div className='border border-beige rounded-sm py-5 px-4 my-8'>
      <div className='flex items-center justify-center gap-4'>
        <Flourish />
        <h2 className='ornament-heading text-3xl sm:text-4xl text-maroon uppercase'>{title}</h2>
        <Flourish />
      </div>
    </div>
  )
}

export default SectionHeading
