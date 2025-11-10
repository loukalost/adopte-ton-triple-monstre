/**
 * Point d'entrée pour les composants liés au wallet
 * Architecture modulaire avec composants atomiques et réutilisables
 */

// Composant principal
export { default as WalletClient } from './wallet-client'

// Modal et ses sous-composants
export { default as PaymentModal } from './payment-modal'
export { default as ModalBackdrop } from './modal-backdrop'
export { default as SuccessModalContent } from './success-modal-content'
export { default as ErrorModalContent } from './error-modal-content'

// Composants atomiques du wallet
export { default as BalanceCard } from './balance-card'
export { default as PackageCard } from './package-card'
export { default as InfoCard } from './info-card'
export { default as WalletHeader } from './wallet-header'
export { default as ErrorMessage } from './error-message'
export { DecorativeBubbles, DecorativeStars } from './decorative-elements'
