export const WHITE_LIST = ['http://localhost:3000', 'https://organick-fullstack.vercel.app']
export const JWT = {
  expiresIn: '1m',
  expiresInRefresh: '3m'
}

export const FILE_ALLOW = ['image/jpeg', 'image/png', 'image/jpg']

// maximum file size 10mb
export const FILE_SIZE = 1024 * 1024 * 10

//default avatar link
export const DEFAULT_AVATAR =
  'https://res.cloudinary.com/dchseyg1q/image/upload/v1710660321/organick/users/fbq5fx3zjlla7ufhpzol.jpg'

export enum StatusOrder {
  Cancel = 'Cancel',
  Pending = 'Pending',
  Confirm = 'Confirm',
  Shipping = 'Shipping',
  Completed = 'Completed'
}
