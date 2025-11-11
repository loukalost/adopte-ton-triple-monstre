export default function ActionsSection (): React.ReactNode {
  return (
    <section id='actions' className='bg-[color:var(--background)] max-w-4xl mx-auto px-6 py-8'>
      <h2 className='text-xl font-bold mb-4 text-[color:var(--color-electric-600)]'>Actions possibles</h2>
      <div className='grid sm:grid-cols-3 gap-4'>
        <div className='p-3 rounded-lg bg-[color:var(--color-electric-50)]'>
          <div className='font-semibold text-sm text-[color:var(--foreground)]'>Nourrir</div>
          <div className='text-xs text-[color:var(--foreground)] mt-1'>Donne de la nourriture pour restaurer l'énergie et débloquer des animations.</div>
        </div>
        <div className='p-3 rounded-lg bg-[color:var(--color-neon-purple-50)]'>
          <div className='font-semibold text-sm text-[color:var(--foreground)]'>Jouer</div>
          <div className='text-xs text-[color:var(--foreground)] mt-1'>Mini-jeux pour gagner pièces et items.</div>
        </div>
        <div className='p-3 rounded-lg bg-[color:var(--color-neutral-100)]'>
          <div className='font-semibold text-sm text-[color:var(--foreground)]'>Soigner</div>
          <div className='text-xs text-[color:var(--foreground)] mt-1'>Remets ton monstre en forme après les aventures.</div>
        </div>
      </div>
    </section>
  )
}
