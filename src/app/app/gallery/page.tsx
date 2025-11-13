import { getPublicMonsters } from '@/actions/gallery.actions'
import { PublicGallery } from '@/components/gallery/public-gallery'

/**
 * Page de galerie publique
 *
 * Cette page server-side récupère tous les monstres publics
 * et les affiche dans une grille interactive.
 *
 * Responsabilité unique : récupérer les monstres publics et
 * orchestrer l'affichage de la galerie.
 *
 * Principes SOLID appliqués :
 * - SRP : Gère uniquement la récupération et l'affichage de la galerie
 * - OCP : Extensible (peut ajouter filtres, pagination, etc.)
 * - DIP : Dépend des abstractions (actions, composants)
 *
 * @async
 * @returns {Promise<React.ReactNode>} Page de galerie avec les monstres publics
 *
 * @example
 * // Accès à la route
 * // GET /app/gallery
 */
export default async function GalleryPage (): Promise<React.ReactNode> {
  // Récupération des monstres publics depuis la base de données
  const publicMonsters = await getPublicMonsters()

  return (
    <div className='container mx-auto px-4 py-8 max-w-7xl'>
      <PublicGallery monsters={publicMonsters} />
    </div>
  )
}
