/**
 * Point d'entrée pour les composants liés au wallet
 * Architecture modulaire avec composants atomiques et réutilisables
 */

// Composant principal
export { default as WalletClient } from './wallet-client'

// Modal et ses sous-composants
export { default as PaymentModal } from './payment-modal'
export { SuccessModalContent } from './modal/success-modal-content'
export { ErrorModalContent } from './modal/error-modal-content'
