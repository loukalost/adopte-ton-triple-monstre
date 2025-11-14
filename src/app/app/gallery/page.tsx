import { getPublicMonsters, countPublicMonsters } from '@/actions/gallery.actions'
import { PublicGallery } from '@/components/gallery/public-gallery'

/**
 * Page de galerie publique
 *
 * Cette page server-side récupère tous les monstres publics
 * et les affiche dans une grille interactive avec filtres.
 *
 * Responsabilité unique : récupérer les monstres publics initiaux et
 * orchestrer l'affichage de la galerie avec son système de filtrage.
 *
 * Principes SOLID appliqués :
 * - SRP : Gère uniquement la récupération initiale et l'affichage de la galerie
 * - OCP : Extensible (peut ajouter pagination, tri, etc.)
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
  // Récupération des monstres publics et du total depuis la base de données
  const [publicMonsters, totalCount] = await Promise.all([
    getPublicMonsters(),
    countPublicMonsters()
  ])

  return (
    <div className='container mx-auto px-4 py-8 max-w-7xl'>
      <PublicGallery initialMonsters={publicMonsters} initialTotalCount={totalCount} />
    </div>
  )
}
