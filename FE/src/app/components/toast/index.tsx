import React from 'react'
import { Toaster } from 'sonner'
import './style.scss'


export default function ToastContainer() {
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
