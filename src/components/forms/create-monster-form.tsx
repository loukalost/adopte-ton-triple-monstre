'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/button'
import InputField from '@/components/input'
import {
  createInitialFormState,
  validateCreateMonsterForm,
  type CreateMonsterFormDraft,
  type CreateMonsterFormErrors
} from './create-monster-form.validation'
import { generateRandomTraits } from '../../services/monsters/monster-generator'
import {
  DEFAULT_MONSTER_STATE,
  MONSTER_STATES,
  type MonsterTraits,
  type MonsterState
} from '@/types/monster'
import type { CreateMonsterFormProps } from '@/types/forms/create-monster-form'
import { PixelMonster } from '../monsters'

const MONSTER_STATE_LABELS: Record<MonsterState, string> = {
  happy: 'Heureux 😊',
  sad: 'Triste 😢',
  angry: 'Fâché 😡',
  hungry: 'Affamé 😋',
  sleepy: 'Somnolent 😴'
}

function CreateMonsterForm ({ onSubmit, onCancel }: CreateMonsterFormProps): React.ReactNode {
  const [formState, setFormState] = useState<CreateMonsterFormDraft>(() => createInitialFormState())
  const [errors, setErrors] = useState<CreateMonsterFormErrors>({})
  const [traits, setTraits] = useState<MonsterTraits | null>(null)
  const [previewState, setPreviewState] = useState<MonsterState>(DEFAULT_MONSTER_STATE)

  useEffect(() => {
    if (traits === null) {
      setTraits(generateRandomTraits())
    }
  }, [traits])

  const hasActiveErrors = traits === null || Object.values(errors).some((value) => Boolean(value))

  const handleGenerateMonster = (): void => {
    const nextTraits = generateRandomTraits()
    setTraits(nextTraits)

    setPreviewState(DEFAULT_MONSTER_STATE)

    setErrors((previous) => ({ ...previous, design: undefined }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    const validationResult = validateCreateMonsterForm(formState, traits)

    if (Object.keys(validationResult.errors).length > 0 || validationResult.values === undefined) {
      setErrors(validationResult.errors)
      return
    }

    onSubmit(validationResult.values)
    setFormState(createInitialFormState())
    setTraits(null)
    setPreviewState(DEFAULT_MONSTER_STATE)

    setErrors({})
  }

  const handleCancel = (): void => {
    setFormState(createInitialFormState())
    setTraits(null)
    setPreviewState(DEFAULT_MONSTER_STATE)

    setErrors({})
    onCancel()
  }

  return (
    <form className='space-y-4' onSubmit={handleSubmit}>
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

      <section className='space-y-3 rounded-lg border border-[color:var(--color-electric-200)] bg-white/60 p-3 shadow-sm'>
        <div className='flex items-center justify-between gap-2'>
          <h3 className='text-base font-semibold text-gray-800'>Votre créature</h3>
          <Button onClick={handleGenerateMonster} type='button' variant='outline' size='sm'>
            Générer mon monstre
          </Button>
        </div>

        <div className='flex items-center justify-center rounded-lg bg-slate-50/70 p-3'>
          {traits !== null && (
            <PixelMonster traits={traits} state={previewState} level={1} />
          )}
        </div>
        <div className='flex flex-wrap items-center justify-center gap-2'>
          {MONSTER_STATES.map((state) => (
            <Button
              key={state}
              type='button'
              size='sm'
              variant={state === previewState ? 'primary' : 'ghost'}
              onClick={() => setPreviewState(state)}
            >
              {MONSTER_STATE_LABELS[state]}
            </Button>
          ))}
        </div>

        {errors.design !== undefined && (
          <span className='text-xs text-red-500'>
            {errors.design}
          </span>
        )}
      </section>

      <div className='flex justify-end gap-2'>
        <Button onClick={handleCancel} type='button' variant='ghost' size='sm'>
          Annuler
        </Button>
        <Button disabled={hasActiveErrors} type='submit' size='sm'>
          Créer
        </Button>
      </div>
    </form>
  )
}

export default CreateMonsterForm
