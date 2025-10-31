export default function ActionsSection (): React.ReactNode {
  return (
    <section id='actions' className='max-w-6xl mx-auto px-6 py-12'>
      <h2 className='text-2xl font-bold mb-6'>Actions possibles</h2>
      <div className='grid sm:grid-cols-3 gap-6'>
        <div className='p-4 rounded-lg bg-[color:var(--color-royal-blue-50)]'>
          <div className='font-semibold'>Nourrir</div>
          <div className='text-sm text-[color:var(--color-black-600)] mt-2'>Donne de la nourriture pour restaurer l'énergie et débloquer des animations.</div>
        </div>
        <div className='p-4 rounded-lg bg-[color:var(--color-perfume-50)]'>
          <div className='font-semibold'>Jouer</div>
          <div className='text-sm text-[color:var(--color-black-600)] mt-2'>Mini-jeux pour gagner pièces et items.</div>
        </div>
        <div className='p-4 rounded-lg bg-[color:var(--color-black-50)]'>
          <div className='font-semibold'>Soigner</div>
          <div className='text-sm text-[color:var(--color-black-600)] mt-2'>Remets ton monstre en forme après les aventures.</div>
        </div>
      </div>
    </section>
  )
}
