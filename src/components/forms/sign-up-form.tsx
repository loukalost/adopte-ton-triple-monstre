import { useState } from 'react'
import InputField from '../input'
import Button from '../Button'

interface Credentials {
  email: string
  password: string
}

function SignUpForm (): React.ReactNode {
  const [credentials, setCredentials] = useState<Credentials>({ email: '', password: '' })
  return (
    <div>
      <h1>Sign Up</h1>
      <form className='flex flex-col gap-4'>
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
        <Button type='submit'>Sign Up</Button>
      </form>
    </div>
  )
}

export default SignUpForm
