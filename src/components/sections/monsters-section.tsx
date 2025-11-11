import Button from '@/components/button'

export default function MonstersSection (): React.ReactNode {
  const list = [
    { name: 'Triplou', emoji: '👾', desc: 'Joueur et câlin' },
    { name: 'Furly', emoji: '🐉', desc: 'Curieux et espiègle' },
    { name: 'Puffin', emoji: '🦑', desc: 'Calme et malin' }
  ]

  return (
    <section id='monsters' className='bg-[color:var(--background)] max-w-4xl mx-auto px-6 py-8'>
      <h2 className='text-xl font-bold mb-4 text-[color:var(--color-electric-600)]'>Quelques monstres mignons</h2>
      <div className='grid sm:grid-cols-3 gap-4'>
        {list.map((m) => (
          <div key={m.name} className='p-4 rounded-lg border border-[color:var(--color-neutral-200)] bg-white'>
            <div className='text-4xl'>{m.emoji}</div>
            <div className='mt-2 font-semibold text-sm text-[color:var(--foreground)]'>{m.name}</div>
            <div className='text-xs mt-1 text-[color:var(--foreground)]'>{m.desc}</div>
            <div className='mt-3 flex gap-2'>
              <Button size='sm' variant='ghost'>Voir</Button>
              <Button size='sm' variant='outline'>Adopter</Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
