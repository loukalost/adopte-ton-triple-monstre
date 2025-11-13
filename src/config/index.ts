/**
 * Configuration Index
 *
 * Point d'entrée centralisé pour tous les fichiers de configuration.
 * Facilite les imports et assure une meilleure organisation.
 *
 * @module config
 */

// ========================================
// Récompenses (Koins)
// ========================================
export {
  REWARDS_CONFIG,
  REWARD_AMOUNTS,
  REWARD_MESSAGES,
  REWARD_EMOJIS,
  type RewardConfig
} from './rewards'

// ========================================
// Actions des monstres
// ========================================
export {
  MONSTER_ACTIONS,
  ACTION_COLORS,
  getActionColors,
  getActionEmoji,
  getActionLabel,
  type ActionDefinition
} from './monster-actions.config'

// ========================================
// Session & Authentification
// ========================================
export {
  SESSION_ALERTS,
  SESSION_ALERT_DURATIONS,
  getSessionAlert,
  createSessionAlert,
  type SessionAlertType,
  type SessionAlertConfig
} from './session.config'

// ========================================
// OAuth (GitHub, Google, etc.)
// ========================================
export {
  GITHUB_OAUTH_CONFIG,
  OAUTH_PROVIDERS,
  OAUTH_ERROR_MESSAGES,
  getOAuthProviderConfig,
  isOAuthProviderEnabled,
  type OAuthProviderConfig
} from './oauth.config'

// ========================================
// Toasts & Notifications
// ========================================
export {
  TOAST_POSITIONS,
  TOAST_DURATIONS,
  TOAST_STYLES,
  REWARD_TOAST_CONFIG,
  SUCCESS_TOAST_CONFIG,
  ERROR_TOAST_CONFIG,
  INFO_TOAST_CONFIG,
  getToastConfig,
  createToastConfig
} from './toast.config'

// ========================================
// Constantes UI (animations, durées, etc.)
// ========================================
export {
  ANIMATION_DURATIONS,
  ANIMATION_DELAYS,
  TIMEOUTS,
  MONSTER_ANIMATION,
  VISUAL_EFFECTS,
  TRANSITION_CLASSES,
  TRANSFORM_SCALES,
  OPACITY,
  Z_INDEX,
  getTransitionClass,
  getAnimationDuration,
  getTimeout
} from './ui.constants'

// ========================================
// Accessoires
// ========================================
export {
  rarityConfig,
  accessoriesCatalog,
  getAccessoryPrice,
  getAccessoriesByCategory,
  getAccessoriesByRarity,
  getAccessoryById
} from './accessories.config'

// ========================================
// Arrière-plans
// ========================================
export {
  backgroundRarityConfig,
  backgroundsCatalog,
  getBackgroundPrice,
  getBackgroundById,
  getBackgroundsByCategory
} from './backgrounds.config'

// ========================================
// Monstres
// ========================================
export {
  XP_PER_ACTION,
  thresholdForLevel
} from './monster.constants'

// ========================================
// Boutique
// ========================================
export {
  xpBoosts
} from './shop.config'

// ========================================
// Wallet & Pricing
// ========================================
export {
  pricingTable,
  type PricingPackage
} from './pricing'

export {
  walletPackages
} from './wallet-packages'

export {
  WALLET_PACKAGES,
  WALLET_INFO_CARDS
} from './wallet.constants'
