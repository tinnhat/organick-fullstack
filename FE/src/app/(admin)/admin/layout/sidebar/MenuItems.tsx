import {
  IconBoxMultiple,
  IconHome,
  IconPoint,
  IconStar,
  IconUser
} from '@tabler/icons-react'
import { uniqueId } from 'lodash'

const Menuitems = [
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconHome,
    href: '/admin'
  },
  {
    id: uniqueId(),
    title: 'Users',
    icon: IconUser,
    href: '/admin/users'
  },
  {
    id: uniqueId(),
    title: 'Products',
    icon: IconStar,
    href: '/admin/products'
  },
  {
    id: uniqueId(),
    title: 'Orders',
    icon: IconBoxMultiple,
    href: '/admin/orders'
  },
  {
    id: uniqueId(),
    title: 'Categories',
    icon: IconPoint,
    href: '/admin/categories'
  }
]

export default Menuitems
