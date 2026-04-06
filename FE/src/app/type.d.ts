type Order = {
  _id: string
  address: string
  phone: string
  note?: string
  listProduct: Product[]
  totalPrice: number
  statusId?: string
  stripeCheckoutLink?: string
  checkOutSessionId?: string
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
  category?: Category[]
  categoryId?: string
  quantity: number
  quantityAddtoCart?: number
  priceSale: number
  price: number
  image: string | Buffer | undefined
  star: number
  reviewCount?: number
  updateAt: Date | string
  createdAt: Date | string
  _destroy: boolean
}

type Review = {
  _id: string
  productId: string
  userId: User
  rating: number
  comment: string
  isEdited?: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

type User = {
  _id: string
  fullname: string
  email: string
  password?: string
  isConfirmed: boolean
  isAdmin: boolean
  avatar: string
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

// ============ FEATURE: websocket-chat START ============
type Message = {
  _id: string
  senderId: string
  receiverId: string
  content: string
  isRead: boolean
  createdAt: Date | string
}

type Conversation = {
  _id: string
  userId: string
  userName: string
  userEmail: string
  userAvatar?: string
  lastMessage?: string
  lastMessageAt?: Date | string
  unreadCount: number
  isOnline: boolean
}

type TypingStatus = {
  userId: string
  isTyping: boolean
}
// ============ FEATURE: websocket-chat END ============

// ============ FEATURE: notifications START ============
type NotificationType = 'order' | 'chat' | 'review' | 'system'

type Notification = {
  _id: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  relatedId?: string
  createdAt: Date | string
}
// ============ FEATURE: notifications END ============