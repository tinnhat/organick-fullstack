import React from 'react'
import './style.scss'
type Props = {
  touched: any
  error: any
}

export default function ErrorField({ touched, error }: Props) {
  return <span className='error-field'>{error}</span>
}
