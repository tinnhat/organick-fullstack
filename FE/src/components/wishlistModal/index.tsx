import client from '@/app/client'
import { faXmark, faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQuery } from '@tanstack/react-query'
import { cloneDeep, isEmpty } from 'lodash'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import './style.scss'

type Props = {
  open: boolean
  onClose: () => void
}

export default function ModalWishlist({ open, onClose }: Props) {
  const router = useRouter()
  const { data: wishlist } = useQuery<any>({ queryKey: ['User Wishlist'] })
  const { data: cart } = useQuery<any>({ queryKey: ['User Cart'] })

  if (!open) return null

  const handleAddToCart = (product: any) => {
    client.setQueryData(['User Cart'], (initalValue: any) => {
      const updatedValue = Array.isArray(initalValue)
        ? [
            ...initalValue,
            {
              ...product,
              quantityAddtoCart: 1,
            },
          ]
        : [
            {
              ...product,
              quantityAddtoCart: 1,
            },
          ]
      const arrValue = cloneDeep(updatedValue).reduce((acc: any, item: any) => {
        const existingItem = acc.find((i: any) => i._id === item._id)
        if (existingItem) {
          existingItem.quantityAddtoCart += item.quantityAddtoCart
        } else {
          acc.push(item)
        }
        return acc
      }, [])
      return arrValue
    })
    toast.success('Added to cart', {
      position: 'top-center',
      duration: 3000,
    })
  }

  const handleRemoveFromWishlist = (product: any) => {
    client.setQueryData(['User Wishlist'], (initalValue: any) => {
      const newValue = cloneDeep(initalValue)
      const result = Array.isArray(newValue)
        ? newValue.filter((i: any) => i._id !== product._id)
        : []
      return result
    })
    toast.success(`Removed ${product.name} from wishlist`, {
      position: 'top-center',
      duration: 3000,
    })
  }

  const handleProductClick = (slug: string, id: string) => {
    router.push(`/shop/${slug}/${id}`)
    onClose()
  }

  return (
    <section className='modalWishlist'>
      <div className='box-wishlist'>
        <div className='title-box'>
          <p className='title-box-text'>
            Wishlist
            {wishlist && wishlist.length > 0 && (
              <span className='wishlist-count'>({wishlist.length})</span>
            )}
          </p>
          <FontAwesomeIcon icon={faXmark} className='icon' onClick={onClose} />
        </div>

        {isEmpty(wishlist) ? (
          <div className='empty-wishlist'>
            <FontAwesomeIcon icon={faHeart} className='empty-icon' />
            <p className='empty-text'>Your wishlist is empty</p>
            <button className='btn-shop' onClick={() => router.push('/shop')}>
              Go Shopping
            </button>
          </div>
        ) : (
          <ul className='list-items'>
            {wishlist.map((item: any) => (
              <li className='item' key={item._id}>
                <div
                  className='item-img'
                  onClick={() => handleProductClick(item.slug || item.name.toLowerCase().replace(/\s+/g, '-'), item._id)}
                >
                  <Image src={item.image} alt={item.name} width={80} height={80} />
                </div>
                <div className='item-info'>
                  <p
                    className='item-name'
                    onClick={() => handleProductClick(item.slug || item.name.toLowerCase().replace(/\s+/g, '-'), item._id)}
                  >
                    {item.name}
                  </p>
                  <p className='item-category'>
                    {item.category?.[0]?.name || item.category || 'Uncategorized'}
                  </p>
                  <p className='item-price'>${item.price}</p>
                </div>
                <div className='item-actions'>
                  <button className='btn-add-cart' onClick={() => handleAddToCart(item)}>
                    Add to Cart
                  </button>
                  <button
                    className='btn-remove'
                    onClick={() => handleRemoveFromWishlist(item)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
