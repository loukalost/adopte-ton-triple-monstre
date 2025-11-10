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
    productId: 'prod_TJrIJITcL4IHs3',
    price: 0.05
  },
  50: {
    productId: 'prod_TJrJcuzsBuRDse',
    price: 0.2
  },
  500: {
    productId: 'prod_TJrJvU3OyU8HoJ',
    price: 1.5
  },
  1000: {
    productId: 'prod_TJrK272JmJ5tGA',
    price: 2
  }
}
