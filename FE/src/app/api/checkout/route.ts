import { NextResponse } from 'next/server'
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY!)
const HOST = process.env.HOST_FE
const getActiveProducts = async () => {
  const products = await stripe.products.list()
  const availableProducts = products.data.filter((product: any) => product.active)
  return availableProducts
}

export const POST = async (request: any) => {
  //products do client gui len co the la mang
  const { products,customerEmail } = await request.json()

  //get nhung product dang active
  let activeProducts = await getActiveProducts()
  try {
    for (const product of products) {
      const stripeProduct = activeProducts.find(
        (activeProduct: any) => activeProduct.id === product._id
      )
      //chua co product
      if (stripeProduct === undefined) {
        await stripe.products.create({
          id: product._id,
          active: true,
          name: product.name,
          description: product.description,
          default_price_data: {
            unit_amount: product.price * 100,
            currency: 'usd',
          },
          images: [product.image],
          url: product.slug,
        })
      }
    }
  } catch (error) {
    console.log('error: ', error)
  }
  activeProducts = await getActiveProducts()
  let stripeItems: any = []
  for (const product of products) {
    const stripeProduct = activeProducts.find(
      (activeProduct: any) => activeProduct.id === product._id
    )

    if (stripeProduct) {
      //push product thanh toan len stripe de show UI checkout
      await stripeItems.push({
        price: stripeProduct?.default_price,
        quantity: product?.quantityAddtoCart,
      })
    }
  }


  const session = await stripe.checkout.sessions.create({
    customer_email: customerEmail,
    line_items: stripeItems,
    mode: 'payment',
    success_url: `${HOST}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${HOST}/pending?session_id={CHECKOUT_SESSION_ID}`,
    custom_fields: [
      {
        key: 'phone',
        label: {
          type: 'custom',
          custom: 'Phone number',
        },
        type: 'numeric',
      },
      {
        key: 'address',
        label: {
          type: 'custom',
          custom: 'Address',
        },
        type: 'text',
      },
      {
        key: 'note',
        label: {
          type: 'custom',
          custom: 'Note',
        },
        type: 'text',
        optional: true,
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
