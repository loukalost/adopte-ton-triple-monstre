'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import InputField from '../input'
import Button from '../button'
import { authClient } from '@/lib/auth-client'

interface Credentials {
  email: string
  password: string
  name: string
}

function SignUpForm ({ onError }: { onError: (error: string) => void }): React.ReactNode {
  const router = useRouter()
  const [credentials, setCredentials] = useState<Credentials>({
    email: 'titi@titi.titi',
    password: 'zizoulezinzin',
    name: 'Titi'
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    setIsLoading(true)
    onError('') // Clear previous errors

    void authClient.signUp.email({
      email: credentials.email,
      password: credentials.password,
      name: credentials.name,
      callbackURL: '/app'
    }, {
      onRequest: (ctx) => {
        console.log('Signing up...', ctx)
      },
      onSuccess: (ctx) => {
        console.log('User signed up:', ctx)
        setIsLoading(false)
        onError('') // Clear error on success
        // Redirection explicite vers l'application
        router.push('/app')
        router.refresh() // Rafraîchir pour charger la session
      },
      onError: (ctx) => {
        console.error('Sign up error:', ctx)
        setIsLoading(false)
        onError(ctx.error.message)
      }
    })
  }

  return (
    <div className='space-y-4'>
      <div className='text-center'>
        <h2 className='text-xl font-bold text-gray-800 mb-1'>
          🆕 Créer un compte
        </h2>
        <p className='text-gray-600 text-xs'>
          Rejoignez l'aventure Adopte ton triple monstre ! 🎆
        </p>
      </div>

      <form className='flex flex-col justify-center space-y-3' onSubmit={handleSubmit}>
        <InputField
          label="Nom d'utilisateur"
          type='text'
          name='name'
          value={credentials.name}
          onChangeText={(text: string) => setCredentials({ ...credentials, name: text })}
        />
        <InputField
          label='Email'
          type='email'
          name='email'
          value={credentials.email}
          onChangeText={(text) => setCredentials({ ...credentials, email: text })}
        />
        <InputField
          label='Mot de passe'
          type='password'
          name='password'
          value={credentials.password}
          onChangeText={(text) => setCredentials({ ...credentials, password: text })}
        />
        <Button
          type='submit'
          size='md'
          disabled={isLoading}
          variant='primary'
        >
          {isLoading ? '🔄 Création...' : '🎆 Créer mon compte'}
        </Button>
      </form>
    </div>
  )
}

export default SignUpForm
