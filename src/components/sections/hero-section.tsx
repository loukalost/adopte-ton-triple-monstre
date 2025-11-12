import Button from '@/components/button'

export default function HeroSection (): React.ReactNode {
  return (
    <section id='hero' className='bg-[color:var(--background)] max-w-4xl mx-auto px-6 py-8 grid md:grid-cols-2 gap-6 items-center'>
      <div>
        <h1 className='text-2xl sm:text-3xl font-extrabold leading-tight text-[color:var(--color-electric-600)]'>
          Adopte ton petit monstre mignon
        </h1>
        <p className='mt-2 text-xs text-[color:var(--color-neon-purple-600)] font-semibold'>
          ATTM signifie "Adopte Ton Triple Monstre" 🎮✨
        </p>
        <p className='mt-3 text-base text-[color:var(--foreground)]'>Prends soin d'un compagnon virtuel, joue, fais-le évoluer et partage ton monstre unique avec la communauté.</p>

        <div className='mt-4 flex flex-wrap gap-2 items-center'>
          <a href='/sign-in'>
            <Button size='md' variant='primary'>S'inscrire — c'est gratuit</Button>
          </a>
          <a href='#monsters' className='text-xs text-[color:var(--foreground)] hover:underline'>Découvrir des monstres</a>
        </div>

        <ul className='mt-6 grid grid-cols-2 gap-2 text-xs text-[color:var(--foreground)]'>
          <li>🎁 Récompenses quotidiennes</li>
          <li>🧪 Évolutions uniques</li>
          <li>🤝 Mini-jeux multijoueur</li>
          <li>🛍️ Boutique in-app</li>
        </ul>
      </div>

      <div className='flex items-center justify-center'>
        <div className='w-full max-w-md p-4 rounded-lg bg-[color:var(--color-neon-purple-50)] border border-[color:var(--color-neon-purple-200)] shadow-sm'>
          <div className='flex items-center gap-3'>
            <div className='text-4xl'>👾</div>
            <div>
              <div className='font-semibold text-base text-[color:var(--foreground)]'>Triplou</div>
              <div className='text-xs text-[color:var(--foreground)]'>Un petit monstre joueur et affectueux</div>
            </div>
          </div>

          <div className='mt-4 grid grid-cols-3 gap-2 text-center'>
            <div>
              <div className='text-xs text-[color:var(--foreground)]'>Niveau</div>
              <div className='font-bold text-sm text-[color:var(--foreground)]'>4</div>
            </div>
            <div>
              <div className='text-xs text-[color:var(--foreground)]'>Amour</div>
              <div className='font-bold text-sm text-[color:var(--foreground)]'>92%</div>
            </div>
            <div>
              <div className='text-xs text-[color:var(--foreground)]'>Énergie</div>
              <div className='font-bold text-[color:var(--foreground)]'>75%</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
