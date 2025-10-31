export default function BenefitsSection (): React.ReactNode {
  return (
    <section id='benefits' className='max-w-6xl mx-auto px-6 py-12'>
      <h2 className='text-2xl font-bold mb-6'>Pourquoi jouer ?</h2>
      <div className='grid sm:grid-cols-3 gap-6'>
        <div className='p-5 rounded-lg bg-[color:var(--color-royal-blue-50)] border border-[color:var(--color-royal-blue-100)]'>
          <div className='text-3xl'>💖</div>
          <h3 className='mt-3 font-semibold'>Attachement</h3>
          <p className='mt-2 text-sm text-[color:var(--color-black-600)]'>Crée un lien unique avec ton monstre, fais-le évoluer et personnalise-le.</p>
        </div>
        <div className='p-5 rounded-lg bg-[color:var(--color-perfume-50)] border border-[color:var(--color-perfume-200)]'>
          <div className='text-3xl'>🎮</div>
          <h3 className='mt-3 font-semibold'>Mini-jeux</h3>
          <p className='mt-2 text-sm text-[color:var(--color-black-600)]'>Des défis amusants pour gagner des récompenses et objets exclusifs.</p>
        </div>
        <div className='p-5 rounded-lg bg-[color:var(--color-black-50)] border border-[color:var(--color-black-100)]'>
          <div className='text-3xl'>🌐</div>
          <h3 className='mt-3 font-semibold'>Communauté</h3>
          <p className='mt-2 text-sm text-[color:var(--color-black-600)]'>Partage, visite et échange avec d'autres dresseurs de monstres.</p>
        </div>
      </div>
    </section>
  )
}
