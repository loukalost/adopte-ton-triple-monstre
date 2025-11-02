'use client'

import { useState } from 'react'

type MonsterAction = 'feed' | 'comfort' | 'hug' | 'wake' | null

interface MonsterActionsProps {
  onAction: (action: MonsterAction) => void
}

interface ActionButtonProps {
  action: MonsterAction
  emoji: string
  label: string
  isActive: boolean
  isDisabled: boolean
  onClick: () => void
}

function ActionButton ({ action, emoji, label, isActive, isDisabled, onClick }: ActionButtonProps): React.ReactNode {
  const baseClass = 'px-4 py-2 text-md rounded-md font-medium flex items-center justify-center gap-2 transition-all duration-300'
  const activeClass = isActive
    ? 'bg-moccaccino-200 text-moccaccino-400 ring-4 ring-moccaccino-300 ring-offset-2 scale-95'
    : isDisabled
      ? 'bg-moccaccino-200 text-moccaccino-400 cursor-not-allowed'
      : 'bg-moccaccino-500 hover:bg-moccaccino-700 text-white cursor-pointer active:scale-95 hover:scale-105 hover:shadow-lg'

  return (
    <button
      className={`${baseClass} ${activeClass}`}
      onClick={onClick}
      disabled={isDisabled}
      type='button'
    >
      <span className='text-2xl'>{emoji}</span>
      <span>{label}</span>
    </button>
  )
}

export function MonsterActions ({ onAction }: MonsterActionsProps): React.ReactNode {
  const [activeAction, setActiveAction] = useState<MonsterAction>(null)

  const handleAction = (action: MonsterAction): void => {
    setActiveAction(action)
    onAction(action)

    // Réinitialiser l'action après l'animation
    setTimeout(() => {
      setActiveAction(null)
    }, 2500)
  }

  return (
    <div className='mt-6'>
      <h3 className='text-xl font-bold text-center text-lochinvar-700 mb-4'>
        Actions
      </h3>
      <div className='grid grid-cols-2 gap-3'>
        <ActionButton
          action='feed'
          emoji='🍎'
          label='Nourrir'
          isActive={activeAction === 'feed'}
          isDisabled={activeAction !== null}
          onClick={() => { handleAction('feed') }}
        />
        <ActionButton
          action='comfort'
          emoji='💙'
          label='Consoler'
          isActive={activeAction === 'comfort'}
          isDisabled={activeAction !== null}
          onClick={() => { handleAction('comfort') }}
        />
        <ActionButton
          action='hug'
          emoji='🤗'
          label='Câliner'
          isActive={activeAction === 'hug'}
          isDisabled={activeAction !== null}
          onClick={() => { handleAction('hug') }}
        />
        <ActionButton
          action='wake'
          emoji='⏰'
          label='Réveiller'
          isActive={activeAction === 'wake'}
          isDisabled={activeAction !== null}
          onClick={() => { handleAction('wake') }}
        />
      </div>

      {/* Indicateur d'action en cours */}
      {activeAction !== null && (
        <div className='mt-4 text-center'>
          <div className='inline-flex items-center gap-2 bg-fuchsia-blue-100 px-4 py-2 rounded-full animate-pulse'>
            <div className='w-2 h-2 bg-fuchsia-blue-500 rounded-full animate-ping' />
            <span className='text-sm font-medium text-fuchsia-blue-700'>
              Action en cours...
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
