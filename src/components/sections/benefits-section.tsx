export default function BenefitsSection (): React.ReactNode {
  return (
    <section id='benefits' className='bg-[color:var(--background)] max-w-4xl mx-auto px-6 py-8'>
      <h2 className='text-xl font-bold mb-4 text-[color:var(--color-electric-600)]'>Pourquoi jouer ?</h2>
      <div className='grid sm:grid-cols-3 gap-4'>
        <div className='p-4 rounded-lg bg-[color:var(--color-electric-50)] border border-[color:var(--color-electric-200)]'>
          <div className='text-2xl'>💖</div>
          <h3 className='mt-2 font-semibold text-sm text-[color:var(--foreground)]'>Attachement</h3>
          <p className='mt-1 text-xs text-[color:var(--foreground)]'>Crée un lien unique avec ton monstre, fais-le évoluer et personnalise-le.</p>
        </div>
        <div className='p-4 rounded-lg bg-[color:var(--color-neon-purple-50)] border border-[color:var(--color-neon-purple-200)]'>
          <div className='text-2xl'>🎮</div>
          <h3 className='mt-2 font-semibold text-sm text-[color:var(--foreground)]'>Mini-jeux</h3>
          <p className='mt-1 text-xs text-[color:var(--foreground)]'>Des défis amusants pour gagner des récompenses et objets exclusifs.</p>
        </div>
        <div className='p-4 rounded-lg bg-[color:var(--color-neutral-50)] border border-[color:var(--color-neutral-200)]'>
          <div className='text-2xl'>🌐</div>
          <h3 className='mt-2 font-semibold text-sm text-[color:var(--foreground)]'>Communauté</h3>
          <p className='mt-1 text-xs text-[color:var(--foreground)]'>Partage, visite et échange avec d'autres dresseurs de monstres.</p>
        </div>
      </div>
    </section>
  )
}
