import React from 'react'
import './style.scss'
type Props = {}

export default function LoadingCustom({}: Props) {
  return (
    <div className='loading-box'>
      <div className='loader'></div>
    </div>
  )
}