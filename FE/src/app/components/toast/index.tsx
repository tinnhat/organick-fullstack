import React from 'react'
import { Toaster } from 'sonner'
import './style.scss'
type Props = {}

export default function ToastContainer({}: Props) {
  return (
    <Toaster
      closeButton={true}
      
      toastOptions={{
        classNames: {
          error: 'toast-error',
          success: 'toast-success',
          warning: 'toast-warning',
          info: 'toast-info'
        },
      }}
    />
  )
}
