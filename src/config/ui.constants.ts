/**
 * UI Constants Configuration
 *
 * Configuration centralisée de toutes les constantes d'interface utilisateur :
 * durées d'animation, délais, timeouts, etc.
 *
 * Principe OCP : Facile à modifier sans toucher au code des composants
 * Principe SRP : Responsabilité unique de configuration UI
 *
 * @module config/ui
 */

/**
 * Durées d'animation (en millisecondes)
 */
export const ANIMATION_DURATIONS = {
  /** Transition rapide (hover, active states) */
  fast: 200,
  /** Transition normale (transitions générales) */
  normal: 300,
  /** Transition lente (animations complexes) */
  slow: 500,
  /** Animation de compteur (wallet balance) */
  countUp: 2000,
  /** Animation de confettis (level up) */
  confetti: 3000
} as const

/**
 * Délais d'animation (en millisecondes)
 */
export const ANIMATION_DELAYS = {
  /** Délai court */
  short: 200,
  /** Délai moyen */
  medium: 500,
  /** Délai long */
  long: 1000
} as const

/**
 * Timeouts et intervalles (en millisecondes)
 */
export const TIMEOUTS = {
  /** Auto-dismiss pour les alertes */
  alertAutoDismiss: 10_000,
  /** Auto-dismiss pour les toasts de succès */
  toastSuccess: 3000,
  /** Auto-dismiss pour les toasts d'erreur */
  toastError: 5000,
  /** Délai de debounce pour les inputs */
  debounce: 300,
  /** Intervalle de polling */
  polling: 30_000
} as const

/**
 * Paramètres d'animation pour les monstres
 */
export const MONSTER_ANIMATION = {
  /** Durée d'un cycle d'action (en frames) */
  actionCycleDuration: 150,
  /** Durée d'un saut (en frames) */
  jumpCycleDuration: 30,
  /** Vitesse de pulsation */
  pulseSpeed: 0.15,
  /** Amplitude de pulsation */
  pulseAmplitude: 0.2,
  /** Durée d'une ondulation (en frames) */
  rippleDuration: 50,
  /** Rayon de base d'une ondulation */
  rippleBaseRadius: 30,
  /** Rayon maximum d'une ondulation */
  rippleMaxRadius: 50
} as const

/**
 * Paramètres d'animation pour les effets visuels
 */
export const VISUAL_EFFECTS = {
  /** Nombre de confettis dans l'animation de level up */
  confettiCount: 20,
  /** Taille des pixels pour les previews d'accessoires */
  pixelSize: 30,
  /** Nombre d'étapes pour les animations progressives */
  progressSteps: 30
} as const

/**
 * Classes CSS pour les transitions (TailwindCSS)
 */
export const TRANSITION_CLASSES = {
  /** Transition standard */
  default: 'transition-all duration-300',
  /** Transition rapide */
  fast: 'transition-all duration-200',
  /** Transition lente */
  slow: 'transition-all duration-500',
  /** Transition de shadow */
  shadow: 'transition-shadow duration-200',
  /** Transition de couleurs */
  colors: 'transition-colors duration-200',
  /** Transition de transformation */
  transform: 'transition-transform duration-300'
} as const

/**
 * Échelles de transformation
 */
export const TRANSFORM_SCALES = {
  /** Effet de clic (active state) */
  active: 0.95,
  /** Effet de hover */
  hover: 1.05,
  /** Effet de hover prononcé */
  hoverLarge: 1.1,
  /** État normal */
  normal: 1
} as const

/**
 * Opacités
 */
export const OPACITY = {
  /** Complètement transparent */
  transparent: 0,
  /** Très faible */
  veryLow: 0.1,
  /** Faible */
  low: 0.3,
  /** Moyenne */
  medium: 0.5,
  /** Élevée */
  high: 0.75,
  /** État désactivé */
  disabled: 0.5,
  /** État actif (pressé) */
  active: 0.75,
  /** Complètement opaque */
  full: 1
} as const

/**
 * Z-index layers (pour la superposition des éléments)
 */
export const Z_INDEX = {
  /** Arrière-plan décoratif */
  background: -1,
  /** Contenu normal */
  normal: 0,
  /** Contenu élevé */
  elevated: 10,
  /** Modals et overlays */
  modal: 100,
  /** Toasts et notifications */
  toast: 1000,
  /** Tooltips */
  tooltip: 1100
} as const

/**
 * Helper pour obtenir une classe de transition
 */
export function getTransitionClass (type: keyof typeof TRANSITION_CLASSES = 'default'): string {
  return TRANSITION_CLASSES[type]
}

/**
 * Helper pour obtenir une durée d'animation en ms
 */
export function getAnimationDuration (type: keyof typeof ANIMATION_DURATIONS): number {
  return ANIMATION_DURATIONS[type]
}

/**
 * Helper pour obtenir un timeout en ms
 */
export function getTimeout (type: keyof typeof TIMEOUTS): number {
  return TIMEOUTS[type]
}
