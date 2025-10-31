import Button from '@/components/button'

export default function MonstersSection (): React.ReactNode {
  const list = [
    { name: 'Triplou', emoji: '👾', desc: 'Joueur et câlin' },
    { name: 'Furly', emoji: '🐉', desc: 'Curieux et espiègle' },
    { name: 'Puffin', emoji: '🦑', desc: 'Calme et malin' }
  ]

  return (
    <section id='monsters' className='bg-[color:var(--background)] max-w-6xl mx-auto px-6 py-12'>
      <h2 className='text-2xl font-bold mb-6 text-blue-600'>Quelques monstres mignons</h2>
      <div className='grid sm:grid-cols-3 gap-6'>
        {list.map((m) => (
          <div key={m.name} className='p-5 rounded-xl border border-[color:var(--color-black-100)] bg-white'>
            <div className='text-6xl'>{m.emoji}</div>
            <div className='mt-3 font-semibold text-black'>{m.name}</div>
            <div className='text-sm mt-1 text-black'>{m.desc}</div>
            <div className='mt-4 flex gap-2'>
              <Button size='sm' variant='ghost'>Voir</Button>
              <Button size='sm' variant='outline'>Adopter</Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
