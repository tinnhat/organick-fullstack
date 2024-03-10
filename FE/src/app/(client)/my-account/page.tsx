import FormMyAccount from '@/app/components/formMyAccount'
import './style.scss'
type Props = {}

export default function MyAccount({}: Props) {
  return (
    <div className='my-account'>
      <div className='container'>
        <div className='my-account-container'>
          <FormMyAccount />
        </div>
      </div>
    </div>
  )
}
