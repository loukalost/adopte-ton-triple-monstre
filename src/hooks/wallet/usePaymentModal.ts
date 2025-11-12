import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

type ModalType = 'success' | 'error'

interface UsePaymentModalReturn {
  showModal: boolean
  modalType: ModalType
  closeModal: () => void
}

/**
 * Hook personnalisé pour gérer l'état et le comportement du modal de paiement
 * Principe SRP: Responsabilité unique de gestion du modal
 *
 * @returns {UsePaymentModalReturn} État et fonctions du modal
 */
export function usePaymentModal (): UsePaymentModalReturn {
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<ModalType>('success')

  const searchParams = useSearchParams()
  const router = useRouter()
  const success = searchParams.get('success')

  // Détection des paramètres de succès/erreur
  useEffect(() => {
    if (success === 'true') {
      setModalType('success')
      setShowModal(true)
      // Force le rechargement des données depuis le serveur après un paiement réussi
      router.refresh()
    } else if (success === 'false') {
      setModalType('error')
      setShowModal(true)
    }
  }, [success, router])

  /**
   * Ferme le modal et nettoie l'URL
   */
  const closeModal = (): void => {
    setShowModal(false)
    router.replace('/app/wallet')
    router.refresh() // Force le rechargement des données depuis le serveur
  }

  return {
    showModal,
    modalType,
    closeModal
  }
}
