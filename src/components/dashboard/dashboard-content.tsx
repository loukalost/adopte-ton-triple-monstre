'use client'

import { useEffect, useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { createMonster } from '@/actions/monsters.actions'
import type { CreateMonsterFormValues } from '@/types/forms/create-monster-form'
import type { DBMonster } from '@/types/monster'
import {
  useUserDisplay,
  useMonsterStats,
  useLatestAdoptionLabel,
  useFavoriteMoodMessage,
  useQuests
} from '@/hooks/dashboard'
import CreateMonsterModal from './create-monster-modal'
import { WelcomeHero } from './welcome-hero'
import { QuestsSection } from './quests-section'
import { MoodTipSection } from './mood-tip-section'
import MonstersList from '../monsters/monsters-list'

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

  // Calcul des statistiques des monstres
  const stats = useMonsterStats(monsters)
  const latestAdoptionLabel = useLatestAdoptionLabel(stats.latestAdoption)
  const favoriteMoodMessage = useFavoriteMoodMessage(stats.favoriteMood, stats.totalMonsters)

  // Génération des quêtes
  const quests = useQuests(stats)

  useEffect(() => {
    const fetchAndUpdateMonsters = async (): Promise<void> => {
      const response = await fetch('/api/monsters')
      const updatedMonsters = await response.json()
      setMonsterList(updatedMonsters)
    }

    const interval = setInterval(() => {
      void fetchAndUpdateMonsters()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  /**
   * Ouvre le modal de création de monstre
   */
  const handleCreateMonster = (): void => {
    setIsModalOpen(true)
  }

  /**
   * Ferme le modal de création de monstre
   */
  const handleCloseModal = (): void => {
    setIsModalOpen(false)
  }

  /**
   * Soumet le formulaire de création de monstre
   * @param {CreateMonsterFormValues} values - Valeurs du formulaire
   */
  const handleMonsterSubmit = (values: CreateMonsterFormValues): void => {
    void createMonster(values).then(() => {
      window.location.reload()
    })
  }

  return (
    <div className='relative min-h-screen overflow-hidden bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-200'>
      {/* Bulles décoratives de fond plus colorées */}
      <div className='pointer-events-none absolute -right-32 top-24 h-96 w-96 rounded-full bg-gradient-to-br from-yellow-300/40 to-orange-400/40 blur-3xl animate-float' aria-hidden='true' />
      <div className='pointer-events-none absolute -left-32 bottom-24 h-96 w-96 rounded-full bg-gradient-to-br from-pink-300/40 to-purple-400/40 blur-3xl animate-float-delayed' aria-hidden='true' />
      <div className='pointer-events-none absolute top-1/2 left-1/2 h-80 w-80 rounded-full bg-gradient-to-br from-blue-300/30 to-indigo-400/30 blur-3xl animate-pulse-slow' aria-hidden='true' />

      {/* Étoiles décoratives */}
      <div className='pointer-events-none absolute top-20 right-40 text-6xl animate-twinkle'>⭐</div>
      <div className='pointer-events-none absolute top-40 left-20 text-5xl animate-twinkle-delayed'>✨</div>
      <div className='pointer-events-none absolute bottom-40 right-60 text-4xl animate-twinkle'>💫</div>

      <main className='relative z-10 mx-auto w-full max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8'>
        {/* Section héro avec bienvenue - EN HAUT */}
        <section className='relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-white/95 via-purple-50/90 to-pink-50/90 px-8 py-10 shadow-2xl ring-4 ring-white/80 backdrop-blur-lg mb-12'>
          {/* Bulles décoratives internes */}
          <div className='pointer-events-none absolute -right-20 -top-10 h-48 w-48 rounded-full bg-gradient-to-br from-yellow-200/50 to-orange-300/50 blur-2xl' aria-hidden='true' />
          <div className='pointer-events-none absolute -left-24 bottom-0 h-48 w-48 rounded-full bg-gradient-to-tr from-pink-200/50 to-purple-300/50 blur-2xl' aria-hidden='true' />

          <div className='relative space-y-8'>
            {/* Message de bienvenue */}
            <WelcomeHero
              userDisplay={userDisplay}
              onCreateMonster={handleCreateMonster}

            />

            {/* Statistiques en grille horizontale - AMÉLIORÉ */}
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-3'>
              {/* Stat 1: Total Compagnons */}
              <div className='group relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-500 p-6 shadow-xl ring-4 ring-yellow-200/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl'>
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-shine' />
                <div className='relative flex items-center justify-between'>
                  <div>
                    <div className='text-6xl font-black text-white drop-shadow-2xl'>
                      {stats.totalMonsters}
                    </div>
                    <div className='mt-2 text-base font-bold text-white/95 uppercase tracking-wide'>
                      Compagnons
                    </div>
                  </div>
                  <div className='text-6xl opacity-20 group-hover:opacity-30 transition-opacity'>
                    🎮
                  </div>
                </div>
              </div>

              {/* Stat 2: Niveau Max */}
              <div className='group relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-400 via-purple-400 to-purple-500 p-6 shadow-xl ring-4 ring-pink-200/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl'>
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-shine' />
                <div className='relative flex items-center justify-between'>
                  <div>
                    <div className='text-6xl font-black text-white drop-shadow-2xl'>
                      {stats.highestLevel}
                    </div>
                    <div className='mt-2 text-base font-bold text-white/95 uppercase tracking-wide'>
                      Niveau Max
                    </div>
                  </div>
                  <div className='text-6xl opacity-20 group-hover:opacity-30 transition-opacity group-hover:animate-bounce'>
                    ⭐
                  </div>
                </div>
              </div>

              {/* Stat 3: Dernière Adoption */}
              <div className='group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-400 via-indigo-400 to-indigo-500 p-6 shadow-xl ring-4 ring-blue-200/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl'>
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-shine' />
                <div className='relative flex items-center justify-between'>
                  <div>
                    <div className='text-3xl font-black text-white drop-shadow-2xl'>
                      {latestAdoptionLabel}
                    </div>
                    <div className='mt-2 text-base font-bold text-white/95 uppercase tracking-wide'>
                      Dernière Adoption
                    </div>
                  </div>
                  <div className='text-6xl opacity-20 group-hover:opacity-30 transition-opacity'>
                    🗓️
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section principale : monstres */}
        <div className='space-y-8'>
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
      <CreateMonsterModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleMonsterSubmit}
      />

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
