import mongoose, { Schema, type Model } from 'mongoose'
import type { DailyQuests } from '@/types/quest'

/**
 * Schéma Mongoose pour la progression d'une quête
 *
 * Responsabilité : définir la structure de données pour une quête en cours
 */
const QuestProgressSchema = new Schema({
  questId: {
    type: String,
    required: true
  },
  current: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  target: {
    type: Number,
    required: true,
    min: 1
  },
  completed: {
    type: Boolean,
    required: true,
    default: false
  },
  completedAt: {
    type: Date,
    required: false
  },
  claimed: {
    type: Boolean,
    required: true,
    default: false
  },
  claimedAt: {
    type: Date,
    required: false
  }
}, { _id: false })

/**
 * Schéma Mongoose pour les quêtes journalières d'un utilisateur
 *
 * Responsabilité : définir la structure de données pour les quêtes d'un jour
 *
 * Principes SOLID appliqués :
 * - SRP : Gère uniquement la structure des quêtes journalières
 * - OCP : Extensible via le schéma de progression
 * - DIP : Utilise des références d'ID plutôt que des dépendances directes
 */
const DailyQuestsSchema = new Schema<DailyQuests>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    index: true
  },
  date: {
    type: String,
    required: true,
    index: true,
    // Format YYYY-MM-DD
    validate: {
      validator: (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v),
      message: 'Date must be in YYYY-MM-DD format'
    }
  },
  quests: {
    type: [QuestProgressSchema],
    required: true,
    default: [],
    validate: {
      validator: (v: unknown[]) => v.length <= 3,
      message: 'Maximum 3 daily quests allowed'
    }
  }
}, {
  timestamps: true,
  collection: 'daily_quests'
})

// Index composé pour garantir unicité par utilisateur et par jour
DailyQuestsSchema.index({ userId: 1, date: 1 }, { unique: true })

/**
 * Méthodes d'instance pour le modèle DailyQuests
 */
DailyQuestsSchema.methods = {
  /**
   * Vérifie si toutes les quêtes sont complétées
   */
  areAllQuestsCompleted (): boolean {
    return this.quests.every((q: { completed: boolean }) => q.completed)
  },

  /**
   * Récupère le nombre de quêtes complétées
   */
  getCompletedCount (): number {
    return this.quests.filter((q: { completed: boolean }) => q.completed).length
  }
}

/**
 * Méthodes statiques pour le modèle DailyQuests
 */
DailyQuestsSchema.statics = {
  /**
   * Récupère ou crée les quêtes du jour pour un utilisateur
   */
  async findOrCreateToday (userId: string, questTemplates: Array<{ questId: string, target: number }>): Promise<DailyQuests> {
    const today = new Date().toISOString().split('T')[0]

    let dailyQuests = await this.findOne({ userId, date: today })

    if (dailyQuests === null) {
      dailyQuests = await this.create({
        userId,
        date: today,
        quests: questTemplates.map(qt => ({
          questId: qt.questId,
          current: 0,
          target: qt.target,
          completed: false
        }))
      })
    }

    return dailyQuests
  }
}

// Export du modèle
const DailyQuestsModel: Model<DailyQuests> =
  mongoose.models.DailyQuests ?? mongoose.model<DailyQuests>('DailyQuests', DailyQuestsSchema)

export default DailyQuestsModel
