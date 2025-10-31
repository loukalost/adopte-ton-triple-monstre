import { useState } from 'react'
import InputField from '../input'
import { authClient } from '@/lib/auth-client'
import Button from '../Button'

interface Credentials {
  email: string
  password: string
}

function SignInForm (): React.ReactNode {
  const [credentials, setCredentials] = useState<Credentials>({
    email: 'cacahouette72@gmail.com',
    password: 'password123'
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    void authClient.signIn.email({
      email: credentials.email,
      password: credentials.password,
      callbackURL: '/' // Redirection vers la page d'accueil après connexion
    }, {
      onRequest: (ctx) => {
        // afficher le loading
        console.log('Signing in...', ctx)
      },
      onSuccess: (ctx) => {
        // rediriger vers le dashboard ou la page d'accueil
        console.log('User signed in:', ctx)
      },
      onError: (ctx) => {
        console.error('Sign in error:', ctx)
        // afficher le message d'erreur
        alert(ctx.error.message)
      }
    })
  }

  return (
    <div>
      <h1>Sign In</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <InputField
          label='Email:'
          type='email'
          name='email'
          value={credentials.email}
          onChangeText={(text) => setCredentials({ ...credentials, email: text })}
        />
        <InputField
          label='Password:'
          type='password'
          name='password'
          value={credentials.password}
          onChangeText={(text) => setCredentials({ ...credentials, password: text })}
        />
        <Button type='submit'>Sign In</Button>
      </form>
    </div>
  )
}

export default SignInForm
