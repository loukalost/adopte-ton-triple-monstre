'use client'

import type { ReactElement } from 'react'
import { useConfetti } from '@/hooks/wallet/useConfetti'
import { Modal } from './modal/modal'
import { SuccessModalContent } from './modal/success-modal-content'
import { ErrorModalContent } from './modal/error-modal-content'

interface PaymentModalProps {
  type: 'success' | 'error'
  onClose: () => void
}

/**
 * Modal fun et engageante pour afficher les résultats de paiement
 * Refactorisé selon les principes SOLID
 *
 * Principe SRP: Responsabilité unique de coordination du modal
 * Principe OCP: Ouvert à l'extension avec de nouveaux types de modaux
 * Principe DIP: Dépend d'abstractions (hooks et composants)
 */
export default function PaymentModal ({ type, onClose }: PaymentModalProps): ReactElement {
  const canvasRef = useConfetti(type === 'success')

  return (
    <>
      {/* Canvas pour les confettis (seulement pour le succès) */}
      {type === 'success' && (
        <canvas
          ref={canvasRef}
          className='fixed inset-0 pointer-events-none z-[60]'
          style={{ width: '100%', height: '100%' }}
        />
      )}

      {/* Modal */}
      <Modal onClose={onClose}>
        {type === 'success'
          ? <SuccessModalContent onClose={onClose} />
          : <ErrorModalContent onClose={onClose} />}
      </Modal>
    </>
  )
}
