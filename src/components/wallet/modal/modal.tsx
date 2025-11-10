import type React from 'react'
import { useKeyboardShortcut } from '@/hooks/wallet/useKeyboardShortcut'

interface ModalProps {
  onClose: () => void
  children: React.ReactNode
}

/**
 * Composant modal générique
 * Principe SRP: Responsabilité unique de gestion de la structure du modal
 * Principe OCP: Ouvert à l'extension via children
 */
export function Modal ({ onClose, children }: ModalProps): React.ReactElement {
  useKeyboardShortcut('Escape', onClose)

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className='fixed inset-0 z-50 bg-black/60 backdrop-blur-md animate-fade-in'
      onClick={handleBackdropClick}
    >
      <div className='fixed inset-0 z-[70] flex items-center justify-center p-4'>
        <div className='relative max-w-2xl w-full animate-scale-in'>
          {children}
        </div>
      </div>
    </div>
  )
}
