type Order = {
  _id: string
  address: string
  phone: string
  note?: string
  listProduct: Product[]
  totalPrice: number
  statusId?: string
  status?: string
  userId: string
  updateAt: Date | string
  createdAt: Date | string
  _destroy: boolean
}

type Product = {
  _id: string
  name: string
  description: string
  additionInfo: string
  slug?: string
  quantity: number
  priceSale: number
  price: number
  image: string | Buffer | undefined
  star: number
  updateAt: Date | string
  createdAt: Date | string
  _destroy: boolean
}
