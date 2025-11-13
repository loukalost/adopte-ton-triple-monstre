'use client'
import { Button } from '@/components'

export default function NewsletterSection (): React.ReactNode {
  return (
    <section id='newsletter' className='bg-[color:var(--background)] max-w-4xl mx-auto px-6 py-8'>
      <div className='rounded-lg p-4 bg-[color:var(--color-neon-purple-50)] border border-[color:var(--color-neon-purple-200)] grid sm:grid-cols-2 items-center gap-4'>
        <div>
          <h3 className='text-base font-bold text-[color:var(--color-electric-600)]'>Abonne-toi et reçois 10% sur ton premier achat</h3>
          <p className='text-xs mt-1 text-[color:var(--foreground)]'>Inscris ton email pour recevoir des offres exclusives et des astuces pour choyer ton monstre.</p>
        </div>

        <form className='flex gap-2' onSubmit={(e) => { e.preventDefault(); alert('Merci ! (form non connecté)') }}>
          <input aria-label='Email' type='email' required placeholder='ton@email.com' className='flex-1 rounded-md px-3 py-2 text-sm border border-[color:var(--color-neutral-200)]' />
          <Button size='sm' variant='primary'>S'abonner</Button>
        </form>
      </div>
    </section>
  )
}
