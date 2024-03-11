import { NextResponse } from 'next/server'
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY!)
const HOST = 'http://localhost:3000'
const getActiveProducts = async () => {
  const products = await stripe.products.list()
  const availableProducts = products.data.filter((product: any) => product.active)
  return availableProducts
}

export const POST = async (request: any) => {
  //products do client gui len co the la mang
  const { products } = await request.json()
  //get nhung product dang active
  let activeProducts = await getActiveProducts()
  try {
    for (const product of products) {
      const stripeProduct = activeProducts.find(
        (activeProduct: any) => activeProduct.id === product._id
      )
      if (stripeProduct === undefined) {
        const newProduct = await stripe.products.create({
          id: product._id,
          active: product._destroy,
          name: product.name,
          description: product.description,
          default_price_data: {
            unit_amount: product.price * 100,
            currency: 'usd',
          },
          images: [product.image],
          url: product.slug,
        })
      } else {
        await stripe.products.update(stripeProduct.id, {
          active: product._destroy,
          images: [product.image],
        })
      }
    }
  } catch (error) {
    console.log(error)
  }

  activeProducts = await getActiveProducts()
  let stripeItems: any = []
  for (const product of products) {
    const stripeProduct = activeProducts.find(
      (activeProduct: any) => activeProduct.id === product._id
    )
    if (stripeProduct) {
      //push product thanh toan len stripe de show UI checkout
      stripeItems.push({
        price: stripeProduct?.default_price,
        quantity: product?.quantityCheckout,
      })
    }
  }

  const session = await stripe.checkout.sessions.create({
    line_items: stripeItems,
    mode: 'payment',
    success_url: `${HOST}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${HOST}/cancel?session_id={CHECKOUT_SESSION_ID}`,
    custom_fields: [
      {
        key: 'engraving',
        label: {
          type: 'custom',
          custom: 'Personalized engraving',
        },
        type: 'text',
      },
    ],
  })
  if (!session) {
    return NextResponse.json({
      error: {
        code: 'stripe-error',
        message: 'Something went wrong',
      },
    })
  }

  return NextResponse.json({ session }, { status: 200 })
}

