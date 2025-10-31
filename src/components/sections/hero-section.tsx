import Button from '@/components/Button'

export default function HeroSection (): React.ReactNode {
  return (
    <section id='hero' className='max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8 items-center'>
      <div>
        <h1 className='text-4xl sm:text-5xl font-extrabold leading-tight text-[color:var(--color-royal-blue-950)]'>
          Adopte ton petit monstre mignon
        </h1>
        <p className='mt-4 text-lg text-[color:var(--color-black-600)]'>Prends soin d'un compagnon virtuel, joue, fais-le évoluer et partage ton monstre unique avec la communauté.</p>

        <div className='mt-6 flex flex-wrap gap-3 items-center'>
          <a href='/signup'>
            <Button size='lg' variant='primary'>S'inscrire — c'est gratuit</Button>
          </a>
          <a href='#monsters' className='text-sm text-[color:var(--color-black-600)] hover:underline'>Découvrir des monstres</a>
        </div>

        <ul className='mt-8 grid grid-cols-2 gap-2 text-sm text-[color:var(--color-black-600)]'>
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
              <div className='font-semibold text-lg'>Triplou</div>
              <div className='text-sm text-[color:var(--color-black-500)]'>Un petit monstre joueur et affectueux</div>
            </div>
          </div>

          <div className='mt-6 grid grid-cols-3 gap-3 text-center'>
            <div>
              <div className='text-sm text-[color:var(--color-black-600)]'>Niveau</div>
              <div className='font-bold'>4</div>
            </div>
            <div>
              <div className='text-sm text-[color:var(--color-black-600)]'>Amour</div>
              <div className='font-bold'>92%</div>
            </div>
            <div>
              <div className='text-sm text-[color:var(--color-black-600)]'>Énergie</div>
              <div className='font-bold'>75%</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
