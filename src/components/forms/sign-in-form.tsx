'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import InputField from '../input'
import { authClient } from '@/lib/auth-client'
import Button from '../button'

interface Credentials {
  email: string
  password: string
}

function SignInForm ({ onError }: { onError: (error: string) => void }): React.ReactNode {
  const router = useRouter()
  const [credentials, setCredentials] = useState<Credentials>({
    email: 'titi@titi.titi',
    password: 'zizoulezinzin'
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    setIsLoading(true)
    onError('') // Clear previous errors

    void authClient.signIn.email({
      email: credentials.email,
      password: credentials.password,
      callbackURL: '/app'
    }, {
      onSuccess: () => {
        setIsLoading(false)
        // Redirection explicite vers l'application
        router.push('/app')
        router.refresh() // Rafraîchir pour charger la session
      },
      onError: (ctx) => {
        setIsLoading(false)
        onError(ctx.error.message)
      }
    })
  }

  return (
    <div className='space-y-4'>
      <div className='text-center'>
        <h2 className='text-xl font-bold text-gray-800 mb-1'>
          🔐 Connexion
        </h2>
        <p className='text-gray-600 text-xs'>
          Retrouvez vos petits compagnons ! 👾
        </p>
      </div>

      <form className='flex flex-col justify-center space-y-3' onSubmit={handleSubmit}>
        <InputField
          label='Email'
          type='email'
          name='email'
          value={credentials.email}
          onChangeText={(text: string) => setCredentials({ ...credentials, email: text })}
        />
        <InputField
          label='Mot de passe'
          type='password'
          name='password'
          value={credentials.password}
          onChangeText={(text: string) => setCredentials({ ...credentials, password: text })}
        />
        <Button
          type='submit'
          size='md'
          disabled={isLoading}
          variant='primary'
        >
          {isLoading ? '🔄 Connexion...' : '🎮 Se connecter'}
        </Button>
      </form>
    </div>
  )
}

export default SignInForm
