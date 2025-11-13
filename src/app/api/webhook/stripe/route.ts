import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'
import Wallet from '@/db/models/wallet.model'
import { pricingTable } from '@/config/pricing'
import mongoose from 'mongoose'

export const runtime = 'nodejs'

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME as string}:${process.env.MONGODB_PASSWORD as string}@${process.env.MONGODB_HOST as string}/${process.env.MONGODB_DATABASE_NAME as string}${process.env.MONGODB_PARAMS as string}&appName=${process.env.MONGODB_APP_NAME as string}`

async function connectDB (): Promise<void> {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri)
  }
}

export async function POST (req: Request): Promise<Response> {
  console.log('🔔 Webhook Stripe reçu')

  // Connexion à MongoDB
  try {
    await connectDB()
    console.log('✅ Connexion MongoDB établie')
  } catch (error) {
    console.error('❌ Erreur connexion MongoDB:', error)
    return new Response('Database connection failed', { status: 500 })
  }

  const sig = (await headers()).get('stripe-signature')
  const payload = await req.text() // corps brut requis

  console.log('🔑 Signature Stripe:', sig !== null ? 'Présente' : 'Absente')

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(payload, sig as string, process.env.STRIPE_WEBHOOK_SECRET as string)
    console.log('✅ Event Stripe validé:', event.type)
  } catch (err: any) {
    console.error('❌ Erreur validation webhook:', err.message)
    return new Response(`Webhook Error: ${err.message as string}`, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      console.log('💳 Checkout session completed')
      console.log('� Event complet:', JSON.stringify(event.data.object, null, 2))
      console.log('�👤 User ID:', event?.data?.object?.metadata?.userId)
      console.log('📦 Product ID:', event?.data?.object?.metadata?.productId)

      const userId = event?.data?.object?.metadata?.userId
      const productId = event?.data?.object?.metadata?.productId

      if (userId === null || userId === undefined) {
        console.error('❌ userId est null ou undefined dans les métadonnées')
        break
      }

      if (productId === null || productId === undefined) {
        console.error('❌ productId est null ou undefined dans les métadonnées')
        break
      }

      console.log('� Recherche du wallet pour ownerId:', userId)
      const wallet = await Wallet.findOne({ ownerId: userId })
      console.log('�💼 Wallet trouvé:', wallet !== null && wallet !== undefined ? `Oui (balance: ${Number(wallet?.balance)})` : 'Non')

      if (wallet !== null && wallet !== undefined) {
        console.log('🔍 Recherche dans pricingTable pour productId:', productId)
        console.log('📋 pricingTable:', JSON.stringify(pricingTable, null, 2))

        const entry = Object.entries(pricingTable).find(([_, pkg]) => pkg.productId === productId)
        console.log('🔍 Recherche produit dans pricingTable:', entry !== undefined ? `Trouvé (${entry[0]} Koins)` : 'Non trouvé')

        if (entry !== undefined) {
          const koinsToAdd = Number(entry[0])
          const oldBalance = Number(wallet.balance)

          console.log(`💰 Tentative de mise à jour: ${oldBalance} + ${koinsToAdd} Koins`)

          // Mise à jour avec $inc pour garantir l'atomicité
          const updateResult = await Wallet.updateOne(
            { ownerId: userId },
            { $inc: { balance: koinsToAdd } }
          )

          console.log('📊 Résultat de la mise à jour:', JSON.stringify(updateResult, null, 2))

          // Vérification après mise à jour
          const updatedWallet = await Wallet.findOne({ ownerId: userId })
          console.log(`✅ Wallet après mise à jour: ${Number(updatedWallet?.balance)}`)
          console.log(`✅ Wallet mis à jour: ${oldBalance} → ${Number(updatedWallet?.balance)} (+${koinsToAdd} Koins)`)
        } else {
          console.error('❌ Product not found in pricing table:', productId)
          console.log('📋 Products disponibles:', Object.values(pricingTable).map(p => p.productId))
        }
      } else {
        console.error('❌ Wallet not found for user:', userId)

        // Essayons de lister tous les wallets pour debug
        const allWallets = await Wallet.find({}).limit(5)
        console.log('📋 Exemples de wallets en base:', allWallets.map(w => ({ ownerId: String(w.ownerId), balance: w.balance })))
      }
      break
    }
    case 'payment_intent.succeeded': {
      console.log('Payment intent succeeded')
      console.log(event.data.object)
      // TODO: idem pour flow Payment Element
      break
    }
    // gérez d'autres événements utiles (payment_failed, refund, dispute...)
  }
  return new Response('ok', { status: 200 })
}
