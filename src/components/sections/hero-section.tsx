import Button from '@/components/button'

export default function HeroSection (): React.ReactNode {
  return (
    <section id='hero' className='bg-[color:var(--background)] max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8 items-center'>
      <div>
        <h1 className='text-4xl sm:text-5xl font-extrabold leading-tight text-blue-600'>
          Adopte ton petit monstre mignon
        </h1>
        <p className='mt-4 text-lg text-black'>Prends soin d'un compagnon virtuel, joue, fais-le évoluer et partage ton monstre unique avec la communauté.</p>

        <div className='mt-6 flex flex-wrap gap-3 items-center'>
          <a href='/signup'>
            <Button size='lg' variant='primary'>S'inscrire — c'est gratuit</Button>
          </a>
          <a href='#monsters' className='text-sm text-black hover:underline'>Découvrir des monstres</a>
        </div>

        <ul className='mt-8 grid grid-cols-2 gap-2 text-sm text-black'>
          <li>🎁 Récompenses quotidiennes</li>
          <li>🧪 Évolutions uniques</li>
          <li>🤝 Mini-jeux multijoueur</li>
          <li>🛍️ Boutique in-app</li>
        </ul>
      </div>

      <div className='flex items-center justify-center'>
        <div className='w-full max-w-md p-6 rounded-2xl bg-[color:var(--color-perfume-50)] border border-[color:var(--color-perfume-200)] shadow-sm'>
          <div className='flex items-center gap-4'>
            <div className='text-6xl'>👾</div>
            <div>
              <div className='font-semibold text-lg text-black'>Triplou</div>
              <div className='text-sm text-black'>Un petit monstre joueur et affectueux</div>
            </div>
          </div>

          <div className='mt-6 grid grid-cols-3 gap-3 text-center'>
            <div>
              <div className='text-sm text-black'>Niveau</div>
              <div className='font-bold text-black'>4</div>
            </div>
            <div>
              <div className='text-sm text-black'>Amour</div>
              <div className='font-bold text-black'>92%</div>
            </div>
            <div>
              <div className='text-sm text-black'>Énergie</div>
              <div className='font-bold text-black'>75%</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
