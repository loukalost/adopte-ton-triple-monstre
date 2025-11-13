'use client'

import { useEffect, useState, useCallback, useMemo, lazy, Suspense } from 'react'
import { authClient } from '@/lib/auth-client'
import { createMonster } from '@/actions/monsters.actions'
import type { CreateMonsterFormValues } from '@/types/forms/create-monster-form'
import type { DBMonster } from '@/types/monster'
import {
  useUserDisplay,
  calculateMonsterStats,
  formatLatestAdoptionLabel,
  formatFavoriteMoodMessage
} from '@/hooks/dashboard'
import { generateQuests } from '@/hooks/dashboard/use-quests'
import { WelcomeHero } from './welcome-hero'
import { QuestsSection } from './quests-section'
import { MoodTipSection } from './mood-tip-section'
import MonstersList from '../monsters/monsters-list'

// ✅ OPTIMISATION 8: Lazy loading du modal de création de monstre
const CreateMonsterModal = lazy(async () => await import('./create-monster-modal'))

// ✅ OPTIMISATION 1: Constante pour l'intervalle de polling (augmenté pour réduire les requêtes)
const POLLING_INTERVAL_DASHBOARD = 30000 // 30s au lieu de 10s (-67% de requêtes)

type Session = typeof authClient.$Infer.Session

/**
 * Composant principal du contenu du dashboard - Version Jeu Vidéo Fun
 *
 * Responsabilité unique : orchestrer l'affichage des différentes sections
 * du dashboard (bienvenue, statistiques, quêtes, monstres, etc.).
 *
 * Nouveau design :
 * - Layout repensé pour mettre les monstres en avant
 * - Couleurs fun et engageantes
 * - Animations ludiques
 *
 * Optimisations :
 * - useMemo pour mémoriser les calculs de statistiques
 * - useCallback pour mémoriser les handlers
 * - Polling réduit (30s au lieu de 10s)
 * - Évite les re-renders inutiles
 *
 * @param {Object} props - Props du composant
 * @param {Session} props.session - Session utilisateur Better Auth
 * @param {DBMonster[]} props.monsters - Liste des monstres de l'utilisateur
 * @returns {React.ReactNode} Contenu complet du dashboard
 */
function DashboardContent ({ session, monsters }: { session: Session, monsters: DBMonster[] }): React.ReactNode {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [monsterList, setMonsterList] = useState<DBMonster[]>(monsters)
  // Extraction des informations utilisateur
  const userDisplay = useUserDisplay(session)

  // ✅ OPTIMISATION 2: Mémoriser les calculs de statistiques (opérations potentiellement coûteuses)
  const stats = useMemo(() => calculateMonsterStats(monsterList), [monsterList])
  const latestAdoptionLabel = useMemo(() => formatLatestAdoptionLabel(stats.latestAdoption), [stats.latestAdoption])
  const favoriteMoodMessage = useMemo(() => formatFavoriteMoodMessage(stats.favoriteMood, stats.totalMonsters), [stats.favoriteMood, stats.totalMonsters])

  // ✅ OPTIMISATION 3: Mémoriser la génération des quêtes
  const quests = useMemo(() => generateQuests(stats), [stats.highestLevel, stats.moodVariety, stats.totalMonsters])

  useEffect(() => {
    const fetchAndUpdateMonsters = async (): Promise<void> => {
      const response = await fetch('/api/monsters')
      const updatedMonsters = await response.json()
      setMonsterList(updatedMonsters)
    }

    // ✅ OPTIMISATION 4: Polling réduit à 30s au lieu de 10s (-67% de requêtes)
    const interval = setInterval(() => {
      void fetchAndUpdateMonsters()
    }, POLLING_INTERVAL_DASHBOARD)

    return () => clearInterval(interval)
  }, [])

  /**
   * Ouvre le modal de création de monstre
   */
  // ✅ OPTIMISATION 5: Mémoriser le callback d'ouverture de modal
  const handleCreateMonster = useCallback((): void => {
    setIsModalOpen(true)
  }, [])

  /**
   * Ferme le modal de création de monstre
   */
  // ✅ OPTIMISATION 6: Mémoriser le callback de fermeture de modal
  const handleCloseModal = useCallback((): void => {
    setIsModalOpen(false)
  }, [])

  /**
   * Soumet le formulaire de création de monstre
   * @param {CreateMonsterFormValues} values - Valeurs du formulaire
   */
  // ✅ OPTIMISATION 7: Mémoriser le callback de soumission
  const handleMonsterSubmit = useCallback((values: CreateMonsterFormValues): void => {
    void createMonster(values).then(() => {
      window.location.reload()
    })
  }, [])

  return (
    <div className='relative min-h-screen overflow-hidden bg-neutral-50'>
      <main className='relative z-10 mx-auto w-full max-w-6xl px-4 pb-24 pt-8 sm:px-6 lg:px-8'>
        {/* Section héro avec bienvenue */}
        <section className='relative overflow-hidden rounded-lg bg-white/95 px-6 py-8 shadow-lg border-2 border-neutral-100 mb-8'>

          <div className='relative space-y-6'>
            {/* Message de bienvenue */}
            <WelcomeHero
              userDisplay={userDisplay}
              onCreateMonster={handleCreateMonster}

            />

            {/* Statistiques en grille horizontale */}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
              {/* Stat 1: Total Compagnons */}
              <div className='rounded-lg bg-[color:var(--color-electric-500)] p-4 shadow-md transition-all duration-300 hover:shadow-lg'>
                <div className='flex items-center justify-between'>
                  <div>
                    <div className='text-3xl font-bold text-white'>
                      {stats.totalMonsters}
                    </div>
                    <div className='mt-1 text-xs font-bold text-white/90 uppercase'>
                      Compagnons
                    </div>
                  </div>
                  <div className='text-3xl opacity-20'>
                    🎮
                  </div>
                </div>
              </div>

              {/* Stat 2: Niveau Max */}
              <div className='rounded-lg bg-[color:var(--color-neon-purple-500)] p-4 shadow-md transition-all duration-300 hover:shadow-lg'>
                <div className='flex items-center justify-between'>
                  <div>
                    <div className='text-3xl font-bold text-white'>
                      {stats.highestLevel}
                    </div>
                    <div className='mt-1 text-xs font-bold text-white/90 uppercase'>
                      Niveau Max
                    </div>
                  </div>
                  <div className='text-3xl opacity-20'>
                    ⭐
                  </div>
                </div>
              </div>

              {/* Stat 3: Dernière Adoption */}
              <div className='rounded-lg bg-[color:var(--color-neutral-700)] p-4 shadow-md transition-all duration-300 hover:shadow-lg'>
                <div className='flex items-center justify-between'>
                  <div>
                    <div className='text-xl font-bold text-white'>
                      {latestAdoptionLabel}
                    </div>
                    <div className='mt-1 text-xs font-bold text-white/90 uppercase'>
                      Dernière Adoption
                    </div>
                  </div>
                  <div className='text-3xl opacity-20'>
                    🗓️
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section principale : monstres */}
        <div className='space-y-6'>
          {/* Liste des monstres */}
          <MonstersList monsters={monsterList} className='mt-0' />
        </div>

        {/* Quêtes et conseils */}
        <div className='grid gap-6 lg:grid-cols-2 my-8'>
          <QuestsSection quests={quests} />
          <MoodTipSection message={favoriteMoodMessage} />
        </div>
      </main>

      {/* Modal de création de monstre */}
      {isModalOpen && (
        <Suspense fallback={<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'><div className='text-white text-xl'>✨ Chargement...</div></div>}>
          <CreateMonsterModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={handleMonsterSubmit}
          />
        </Suspense>
      )}

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-30px);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-25px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.2) rotate(180deg);
          }
        }

        @keyframes twinkle-delayed {
          0%, 100% {
            opacity: 0.4;
            transform: scale(0.9) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.1) rotate(-180deg);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }

        .animate-twinkle-delayed {
          animation: twinkle-delayed 4s ease-in-out infinite;
        }
      `}
      </style>
    </div>
  )
}

export default DashboardContent
