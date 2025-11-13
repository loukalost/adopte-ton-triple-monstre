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
  // Connexion à MongoDB
  try {
    await connectDB()
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    return new Response('Database connection failed', { status: 500 })
  }

  const sig = (await headers()).get('stripe-signature')
  const payload = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(payload, sig as string, process.env.STRIPE_WEBHOOK_SECRET as string)
  } catch (err: any) {
    console.error('❌ Webhook validation error:', err.message)
    return new Response(`Webhook Error: ${err.message as string}`, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const userId = event?.data?.object?.metadata?.userId
      const productId = event?.data?.object?.metadata?.productId

      if (userId === null || userId === undefined) {
        console.error('❌ Missing userId in webhook metadata')
        break
      }

      if (productId === null || productId === undefined) {
        console.error('❌ Missing productId in webhook metadata')
        break
      }

      const wallet = await Wallet.findOne({ ownerId: userId })

      if (wallet !== null && wallet !== undefined) {
        const entry = Object.entries(pricingTable).find(([_, pkg]) => pkg.productId === productId)

        if (entry !== undefined) {
          const koinsToAdd = Number(entry[0])
          const oldBalance = Number(wallet.balance)

          // Mise à jour atomique avec $inc
          await Wallet.updateOne(
            { ownerId: userId },
            { $inc: { balance: koinsToAdd } }
          )

          console.log(`✅ Wallet updated: ${oldBalance} → ${oldBalance + koinsToAdd} (+${koinsToAdd} Koins) for user ${userId}`)
        } else {
          console.error('❌ Product not found in pricing table:', productId)
        }
      } else {
        console.error('❌ Wallet not found for user:', userId)
      }
      break
    }
    case 'payment_intent.succeeded': {
      // TODO: Handle Payment Element flow
      break
    }
  }
  return new Response('ok', { status: 200 })
}
