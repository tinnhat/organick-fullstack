'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import BaseCard from '../../components/shared/BaseCard'
type Props = {}

export default function OrderDetail({}: Props) {
  const params = useParams()
  console.log(params)

  return (
    <div>
      <BaseCard title='Oder - 123123123123123123131'>
        <p>Order Detail</p>
      </BaseCard>
    </div>
  )
}
