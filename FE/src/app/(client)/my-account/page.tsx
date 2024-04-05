import FormMyAccount from '@/app/components/formMyAccount'
import './style.scss'

export default function MyAccount() {
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
