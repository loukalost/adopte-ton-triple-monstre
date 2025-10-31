'use client'

import { useState } from 'react'
import Button from '../button'
import InputField from '../input'
import {
  createInitialFormState,
  validateCreateMonsterForm,
  type CreateMonsterFormDraft,
  type CreateMonsterFormErrors
} from './create-monster-form.validation'
import type { CreateMonsterFormProps } from '@/types/forms/create-monster-form'

function CreateMonsterForm ({ onSubmit, onCancel }: CreateMonsterFormProps): React.ReactNode {
  const [formState, setFormState] = useState<CreateMonsterFormDraft>(() => createInitialFormState())
  const [errors, setErrors] = useState<CreateMonsterFormErrors>({})

  const hasActiveErrors = Object.values(errors).some((value) => Boolean(value))

  const handleGenerateMonster = (): void => {
    // Logic to generate monster based on current form state can be added here
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    const validationResult = validateCreateMonsterForm(formState)

    if (Object.keys(validationResult.errors).length > 0 || validationResult.values === undefined) {
      setErrors(validationResult.errors)
      return
    }

    onSubmit(validationResult.values)
    setFormState(createInitialFormState())

    setErrors({})
  }

  const handleCancel = (): void => {
    setFormState(createInitialFormState())
    setErrors({})
    onCancel()
  }

  return (
    <form className='space-y-6' onSubmit={handleSubmit}>
      <InputField
        label='Nom'
        name='name'
        value={formState.name}
        onChangeText={(value: string) => {
          setFormState((previous) => ({ ...previous, name: value }))
          if (errors.name !== undefined) {
            setErrors((previous) => ({ ...previous, name: undefined }))
          }
        }}
        error={errors.name}
      />
      <InputField
        label='Dessin'
        name='draw'
        value={formState.draw}
        onChangeText={(value: string) => {
          setFormState((previous) => ({ ...previous, draw: value }))
          if (errors.draw !== undefined) {
            setErrors((previous) => ({ ...previous, draw: undefined }))
          }
        }}
        error={errors.draw}
      />

      <Button onClick={handleGenerateMonster} type='button'>
        Générer mon monstre
      </Button>

      <div className='flex justify-end gap-3'>
        <Button onClick={handleCancel} type='button' variant='ghost'>
          Annuler
        </Button>
        <Button disabled={hasActiveErrors} type='submit'>
          Créer
        </Button>
      </div>
    </form>
  )
}

export default CreateMonsterForm
