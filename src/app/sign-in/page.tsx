import AuthFormContent from '@/components/forms/auth-form-content'
import { connectToDatabase } from '@/db'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { SessionAlert } from '@/components/auth/session-alert'
import { Suspense } from 'react'

/**
 * Page de connexion
 *
 * Si l'utilisateur est déjà connecté, il est redirigé vers /app
 * Affiche des alertes si l'utilisateur a été redirigé (session expirée, etc.)
 *
 * @returns {Promise<React.ReactNode>} Page de connexion ou redirection
 */
async function SignInPage (): Promise<React.ReactNode> {
  await connectToDatabase()

  // Vérifier si l'utilisateur est déjà connecté
  const session = await auth.api.getSession({
    headers: await headers()
  })

  // Si connecté, rediriger vers l'application
  if (session !== null && session !== undefined) {
    redirect('/app')
  }

  return (
    <div className='min-h-screen bg-[color:var(--color-neutral-50)] flex items-center justify-center p-4 relative overflow-hidden'>
      {/* Animated floating monsters */}
      <div className='absolute inset-0 pointer-events-none overflow-hidden'>
        <div className='absolute top-20 left-10 text-3xl animate-bounce'>🥺</div>
        <div className='absolute top-32 right-20 text-2xl animate-pulse'>👾</div>
        <div className='absolute bottom-40 left-20 text-2xl animate-bounce' style={{ animationDelay: '1s' }}>🧸</div>
        <div className='absolute bottom-20 right-10 text-2xl animate-pulse' style={{ animationDelay: '2s' }}>🦄</div>
        <div className='absolute top-1/2 left-5 text-xl animate-bounce' style={{ animationDelay: '0.5s' }}>🎀</div>
        <div className='absolute top-1/3 right-5 text-2xl animate-pulse' style={{ animationDelay: '1.5s' }}>🌟</div>
      </div>

      {/* Main card container */}
      <div className='w-full max-w-md relative z-10'>
        <div className='bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-[color:var(--color-neutral-200)] p-6 relative overflow-hidden'>
          {/* Decorative top bar */}
          <div className='absolute top-0 left-0 right-0 h-1 bg-[color:var(--color-electric-500)]' />

          {/* Welcome message */}
          <div className='text-center mb-6'>
            <div className='text-3xl mb-3'>🎮</div>
            <h1 className='text-xl font-bold text-[color:var(--color-electric-600)]'>
              Bienvenue chez ATTM !
            </h1>
            <p className='text-[color:var(--color-neutral-600)] mt-2 text-xs'>
              Vos petits monstres vous attendent 👹✨
            </p>
          </div>

          {/* Session alerts (session expirée, redirection, etc.) */}
          <Suspense fallback={null}>
            <SessionAlert />
          </Suspense>

          <AuthFormContent />
        </div>

        {/* Fun quote below the card */}
        <div className='text-center mt-4 text-[color:var(--color-neutral-600)] text-xs'>
          <span className='italic'>"Un monstre par jour éloigne l'ennui pour toujours !"</span> 🎭
        </div>
      </div>
    </div>
  )
}

export default SignInPage
