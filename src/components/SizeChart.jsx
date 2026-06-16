import React from 'react'

const KURTIS = [
  ['XS', 34, 30, 37, 13.5],
  ['S', 36, 32, 39, 14],
  ['M', 38, 34, 41, 14.5],
  ['L', 40, 36, 43, 15],
  ['XL', 42, 38, 45, 15.5],
  ['2XL', 44, 40, 47, 16],
  ['3XL', 46, 42, 49, 16.5],
]

const BOTTOM = [
  ['XS', 26], ['S', 28], ['M', 30], ['L', 32], ['XL', 34], ['2XL', 36], ['3XL', 38],
]

const SizeChart = ({ open, onClose }) => {
  if (!open) return null

  return (
    <div
      className='fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-md max-w-2xl w-full max-h-[90vh] overflow-y-auto'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex items-center justify-between px-5 py-3 border-b border-cream sticky top-0 bg-white'>
          <h3 className='font-serif text-xl text-maroon'>Size Chart</h3>
          <button onClick={onClose} aria-label='Close' className='text-2xl leading-none text-ink/60 hover:text-ink'>×</button>
        </div>

        <div className='p-5 space-y-6'>
          {/* Kurtis */}
          <div>
            <div className='bg-maroon text-white text-center font-medium py-2 rounded-t-sm'>Kurtis Size Chart (Inch)</div>
            <table className='w-full border border-cream text-sm text-center'>
              <thead>
                <tr className='bg-blush text-ink'>
                  <th className='border border-cream py-2'>Sizes</th>
                  <th className='border border-cream py-2'>Bust (In)</th>
                  <th className='border border-cream py-2'>Waist (In)</th>
                  <th className='border border-cream py-2'>Hip (In)</th>
                  <th className='border border-cream py-2'>Shoulder (In)</th>
                </tr>
              </thead>
              <tbody>
                {KURTIS.map((r) => (
                  <tr key={r[0]} className='text-ink/80'>
                    <td className='border border-cream py-2 font-medium'>{r[0]}</td>
                    <td className='border border-cream py-2'>{r[1]}</td>
                    <td className='border border-cream py-2'>{r[2]}</td>
                    <td className='border border-cream py-2'>{r[3]}</td>
                    <td className='border border-cream py-2'>{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom */}
          <div>
            <div className='bg-maroon text-white text-center font-medium py-2 rounded-t-sm'>Bottom Size Chart (Inch)</div>
            <table className='w-full border border-cream text-sm text-center'>
              <thead>
                <tr className='bg-blush text-ink'>
                  <th className='border border-cream py-2'>Sizes</th>
                  <th className='border border-cream py-2'>Waist (In)</th>
                </tr>
              </thead>
              <tbody>
                {BOTTOM.map((r) => (
                  <tr key={r[0]} className='text-ink/80'>
                    <td className='border border-cream py-2 font-medium'>{r[0]}</td>
                    <td className='border border-cream py-2'>{r[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Notes */}
          <ul className='text-sm text-ink/70 list-disc pl-5 space-y-1'>
            <li>All measurements shown are of the garment.</li>
            <li>Please choose a garment size that is two inches more than your body measurement.</li>
            <li>Example 1: For bust size 36, select garment size <b>“M”</b>.</li>
            <li>Example 2: For bust size 40, select garment size <b>“XL”</b>.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SizeChart
