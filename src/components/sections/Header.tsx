import Button from '@/components/Button'

export default function Header (): React.ReactNode {
  return (
    <header className='sticky top-0 z-40 bg-[color:var(--background)]/80 backdrop-blur-sm border-b border-[color:var(--color-black-100)]'>
      <div className='max-w-6xl mx-auto px-6 py-4 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-lg bg-[color:var(--color-perfume-500)] flex items-center justify-center text-white font-bold'>TM</div>
          <span className='font-semibold'>Adopte ton Triple Monstre</span>
        </div>

        <nav className='hidden md:flex items-center gap-6 text-sm'>
          <a href='#hero' className='hover:underline'>Accueil</a>
          <a href='#benefits' className='hover:underline'>Bénéfices</a>
          <a href='#monsters' className='hover:underline'>Monstres</a>
          <a href='#actions' className='hover:underline'>Actions</a>
          <a href='#newsletter' className='hover:underline'>Newsletter</a>
        </nav>

        <div className='hidden sm:flex items-center gap-3'>
          <a href='/signup' aria-label='Créer un compte'>
            <Button size='md' variant='primary'>Créer un monstre</Button>
          </a>
        </div>

        <div className='md:hidden'>
          <a href='/signup'>
            <Button size='sm' variant='primary'>Créer</Button>
          </a>
        </div>
      </div>
    </header>
  )
}
