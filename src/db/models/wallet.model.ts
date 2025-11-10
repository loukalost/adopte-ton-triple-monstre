import mongoose from 'mongoose'

const { Schema } = mongoose

/**
 * Schéma pour le portefeuille (Wallet) de l'utilisateur
 *
 * Ce modèle stocke la monnaie virtuelle (Koins) de chaque utilisateur.
 * Chaque utilisateur possède un unique wallet lié à son compte via ownerId.
 */
const walletSchema = new Schema({
  /**
   * Identifiant du propriétaire du wallet
   * Référence l'utilisateur dans la collection 'user'
   */
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true // Un seul wallet par utilisateur
  },
  /**
   * Montant de Koins possédé par l'utilisateur
   * Par défaut, chaque nouvel utilisateur commence avec 100 Koins
   */
  balance: {
    type: Number,
    required: true,
    default: 100,
    min: 0 // Le solde ne peut pas être négatif
  }
}, {
  timestamps: true // Ajoute automatiquement createdAt et updatedAt
})

// Index pour optimiser les recherches par ownerId
walletSchema.index({ ownerId: 1 })

export default mongoose.models.Wallet ?? mongoose.model('Wallet', walletSchema)
