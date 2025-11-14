import AppHeaderWrapper from './app-header-wrapper'
import BottomNavWrapper from './bottom-nav-wrapper'

interface AppLayoutProps {
  children: React.ReactNode
}

/**
 * Layout principal de l'application avec navigation
 *
 * Ce composant wrap les pages authentifiées et ajoute :
 * - AppHeader en haut sur desktop (md et plus) avec wallet balance
 * - BottomNav en bas sur mobile/tablette (moins de md) avec wallet balance
 * - Padding bottom sur mobile pour éviter que le contenu soit caché par la barre
 *
 * Responsabilité unique : Orchestrer l'affichage de la navigation
 * en fonction de la taille de l'écran
 *
 * Note : Les wrappers gèrent la récupération du wallet côté serveur
 *
 * @param {AppLayoutProps} props - Les propriétés du composant
 * @param {React.ReactNode} props.children - Le contenu de la page
 */
export default function AppLayout ({ children }: AppLayoutProps): React.ReactNode {
  return (
    <div className='min-h-screen flex flex-col'>
      {/* Header desktop (masqué sur mobile) - récupère le wallet */}
      <AppHeaderWrapper />

      {/* Contenu principal avec padding pour la barre mobile */}
      <main className='flex-1 pb-20 md:pb-0'>
        {children}
      </main>

      {/* Navigation mobile (masquée sur desktop) - récupère le wallet */}
      <BottomNavWrapper />
    </div>
  )
}
