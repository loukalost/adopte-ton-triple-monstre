/**
 * Table de tarification pour les packages de Koins
 *
 * Cette configuration est partagée entre le client et le serveur.
 * Elle définit les différents packages disponibles à l'achat.
 */

export interface PricingPackage {
  productId: string
  price: number
}

export const pricingTable: Record<number, PricingPackage> = {
  10: {
    productId: 'prod_TPksUJ5bWtH6bA',
    price: 0.99
  },
  50: {
    productId: 'prod_TPktiyWzOoEAxD',
    price: 3.99
  },
  500: {
    productId: 'prod_TPkueER1X6PAaO',
    price: 29.99
  },
  1000: {
    productId: 'prod_TPkulod205ndzN',
    price: 49.99
  }
}
