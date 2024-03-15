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
  description: string | undefined
  additionInfo: string
  slug?: string
  category?: string
  categoryId?: string
  quantity: number
  priceSale: number
  price: number
  image: string | Buffer | undefined
  star: number
  updateAt: Date | string
  createdAt: Date | string
  _destroy: boolean
}

type User = {
  _id: string
  fullname: string
  email: string
  password?: string
  isConfirm: boolean
  isAdmin: boolean
  updateAt: Date | string
  createdAt: Date | string
  _destroy: boolean
}

type Category = {
  _id: string
  name: string
  updateAt: Date | string
  createdAt: Date | string
  _destroy: boolean
}

type Status = {
  _id: string
  name: string
  updateAt: Date | string
  createdAt: Date | string
  _destroy: boolean
}