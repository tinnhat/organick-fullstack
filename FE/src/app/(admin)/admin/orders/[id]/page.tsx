'use client'
import React from 'react'
import { useParams } from 'next/navigation'
type Props = {}

export default function OrderDetail({}: Props) {
  const params = useParams()
  console.log(params)
  
  return (
    <div>OrderDetail</div>
  )
}