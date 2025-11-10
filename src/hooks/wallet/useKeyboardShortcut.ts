import { useEffect } from 'react'

/**
 * Hook personnalisé pour gérer les raccourcis clavier
 * Principe SRP: Responsabilité unique de gestion des raccourcis clavier
 *
 * @param {string} key - Touche à écouter
 * @param {() => void} callback - Fonction à exécuter
 */
export function useKeyboardShortcut (key: string, callback: () => void): void {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
      if (e.key === key) {
        callback()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => { window.removeEventListener('keydown', handleKeyPress) }
  }, [key, callback])
}
