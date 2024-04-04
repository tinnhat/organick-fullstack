/* eslint-disable no-case-declarations */
import express, { Request, Response } from 'express'
import stripePackage from 'stripe'

const Router = express.Router()

const stripe = new stripePackage(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = 'whsec_5TbOwlC3dn8Nn3cql6N76PJyPQw7LAFC'

Router.post('/', async (req, res) => {
  console.log('Webhook Request:', req.body.type);
  const sig = req.headers['stripe-signature']

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)

    // getting to the data we want from the event
    const subscription: any = event.data.object
    const subscriptionId: any = subscription.id

    switch (event.type) {
      case 'checkout.session.completed':
        const checkoutSession = await stripe.checkout.sessions.retrieve(subscriptionId, {
          expand: ['line_items', 'line_items.data.price.product']
        })
        const data = {
          phone: checkoutSession.custom_fields[0].numeric?.value,
          address: checkoutSession.custom_fields[1].text?.value,
          note: checkoutSession.custom_fields[2].text?.value,
          totalPrice: checkoutSession.amount_total / 100,
          listProducts: checkoutSession.line_items?.data.map((item) => {
            const { product } = item.price
            return {
              id: item.price.id,
              quantity: item.quantity
            }
          }),
          isPaid: true,
          status: 'Complete'
        }
        // Call your backend API to update the database
        // Example: You may use Axios or the built-in `fetch` API
        const order = await fetch(`${process.env.HOST_BE}/orders/checkout/${checkoutSession.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        const test = await order.json()
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    // Return a response to acknowledge receipt of the event.
    res.json({ received: true })
  } catch (err) {
    console.log('Error:', err.message)
    res.status(400).json({ error: `Webhook Error: ${err.message}` })
  }
})

export const webHooksRoute = Router
