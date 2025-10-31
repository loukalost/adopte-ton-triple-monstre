'use client'
import Button from '@/components/Button'

export default function NewsletterSection (): React.ReactNode {
  return (
    <section id='newsletter' className='max-w-6xl mx-auto px-6 py-12'>
      <div className='rounded-lg p-6 bg-[color:var(--color-perfume-50)] border border-[color:var(--color-perfume-200)] grid sm:grid-cols-2 items-center gap-6'>
        <div>
          <h3 className='text-xl font-bold'>Abonne-toi et reçois 10% sur ton premier achat</h3>
          <p className='text-sm mt-2 text-[color:var(--color-black-600)]'>Inscris ton email pour recevoir des offres exclusives et des astuces pour choyer ton monstre.</p>
        </div>

        <form className='flex gap-3' onSubmit={(e) => { e.preventDefault(); alert('Merci ! (form non connecté)') }}>
          <input aria-label='Email' type='email' required placeholder='ton@email.com' className='flex-1 rounded-md px-4 py-2 border border-[color:var(--color-black-100)]' />
          <Button size='md' variant='primary'>S'abonner</Button>
        </form>
      </div>
    </section>
  )
}
