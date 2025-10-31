export default function Footer (): React.ReactNode {
  return (
    <footer className='mt-12 border-t border-[color:var(--color-black-100)] bg-[color:var(--background)]'>
      <div className='max-w-6xl mx-auto px-6 py-8 grid sm:grid-cols-3 gap-6 text-sm text-[color:var(--color-black-600)]'>
        <div>
          <div className='font-semibold'>Adopte ton Triple Monstre</div>
          <div className='mt-2'>© {new Date().getFullYear()} — Tout droits réservés</div>
        </div>
        <div className='flex gap-4'>
          <a href='#' className='hover:underline'>Mentions légales</a>
          <a href='#' className='hover:underline'>Politique de confidentialité</a>
          <a href='#' className='hover:underline'>Support</a>
        </div>
        <div className='text-right'>
          <div>Suivez-nous</div>
          <div className='mt-2 flex justify-end gap-3'>
            <a href='#' className='hover:underline'>Twitter</a>
            <a href='#' className='hover:underline'>Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
