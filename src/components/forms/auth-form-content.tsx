'use client'

import { useState } from 'react'
import SignInForm from './sign-in-form'
import SignUpForm from './sign-up-form'
import Button from '../Button'

function AuthFormContent (): React.ReactNode {
  const [isSignIn, setIsSignIn] = useState<boolean>(true)
  return (
    <div>
      {isSignIn ? <SignInForm /> : <SignUpForm />}
      <Button
        type='button'
        variant='ghost'
        onClick={() => setIsSignIn(!isSignIn)}
      >
        {isSignIn ? 'Create an account' : 'Already have an account?'}
      </Button>
    </div>
  )
}

export default AuthFormContent
