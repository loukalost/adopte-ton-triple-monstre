/**
 * Toast Notification Configuration
 *
 * Configuration centralisée pour les notifications toast (react-toastify)
 *
 * Principe SRP : Responsabilité unique de configuration des toasts
 * Principe OCP : Facile d'ajouter de nouveaux styles de toast
 *
 * @module config/toast
 */

import type { ToastOptions, ToastPosition } from 'react-toastify'

/**
 * Positions prédéfinies pour les toasts
 */
export const TOAST_POSITIONS = {
  topLeft: 'top-left' as ToastPosition,
  topCenter: 'top-center' as ToastPosition,
  topRight: 'top-right' as ToastPosition,
  bottomLeft: 'bottom-left' as ToastPosition,
  bottomCenter: 'bottom-center' as ToastPosition,
  bottomRight: 'bottom-right' as ToastPosition
} as const

/**
 * Durées d'affichage des toasts (en millisecondes)
 */
export const TOAST_DURATIONS = {
  /** Notification rapide */
  short: 2000,
  /** Notification standard */
  normal: 3000,
  /** Notification longue */
  long: 5000,
  /** Notification très longue (erreurs) */
  veryLong: 8000
} as const

/**
 * Styles prédéfinis pour les toasts
 */
export const TOAST_STYLES = {
  /** Toast de récompense (gradient violet) */
  reward: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    borderRadius: '8px',
    fontWeight: 'bold',
    padding: '12px 20px'
  },
  /** Toast de succès */
  success: {
    background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
    color: '#ffffff',
    borderRadius: '8px',
    fontWeight: 'bold',
    padding: '12px 20px'
  },
  /** Toast d'erreur */
  error: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: '#ffffff',
    borderRadius: '8px',
    fontWeight: 'bold',
    padding: '12px 20px'
  },
  /** Toast d'information */
  info: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: '#ffffff',
    borderRadius: '8px',
    fontWeight: 'bold',
    padding: '12px 20px'
  },
  /** Toast d'avertissement */
  warning: {
    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    color: '#ffffff',
    borderRadius: '8px',
    fontWeight: 'bold',
    padding: '12px 20px'
  }
} as const

/**
 * Configuration par défaut pour les toasts de récompense
 */
export const REWARD_TOAST_CONFIG: ToastOptions = {
  position: TOAST_POSITIONS.topCenter,
  autoClose: TOAST_DURATIONS.normal,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  style: TOAST_STYLES.reward
}

/**
 * Configuration par défaut pour les toasts de succès
 */
export const SUCCESS_TOAST_CONFIG: ToastOptions = {
  position: TOAST_POSITIONS.topRight,
  autoClose: TOAST_DURATIONS.normal,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  style: TOAST_STYLES.success
}

/**
 * Configuration par défaut pour les toasts d'erreur
 */
export const ERROR_TOAST_CONFIG: ToastOptions = {
  position: TOAST_POSITIONS.topRight,
  autoClose: TOAST_DURATIONS.long,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  style: TOAST_STYLES.error
}

/**
 * Configuration par défaut pour les toasts d'information
 */
export const INFO_TOAST_CONFIG: ToastOptions = {
  position: TOAST_POSITIONS.topCenter,
  autoClose: TOAST_DURATIONS.normal,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  style: TOAST_STYLES.info
}

/**
 * Helper pour obtenir une configuration de toast par type
 */
export function getToastConfig (type: 'reward' | 'success' | 'error' | 'info'): ToastOptions {
  switch (type) {
    case 'reward':
      return REWARD_TOAST_CONFIG
    case 'success':
      return SUCCESS_TOAST_CONFIG
    case 'error':
      return ERROR_TOAST_CONFIG
    case 'info':
      return INFO_TOAST_CONFIG
    default:
      return INFO_TOAST_CONFIG
  }
}

/**
 * Helper pour créer une configuration de toast personnalisée
 */
export function createToastConfig (
  position: ToastPosition = TOAST_POSITIONS.topCenter,
  duration: number = TOAST_DURATIONS.normal,
  style?: React.CSSProperties
): ToastOptions {
  return {
    position,
    autoClose: duration,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style
  }
}
