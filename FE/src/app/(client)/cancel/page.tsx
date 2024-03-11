'use client'
import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

type Props = {}

export default function Cancel({}: Props) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const session_id = searchParams.get('session_id')
    const fetchData = async () => {
      const res = await fetch(`/api/sessions/${session_id}`, {
        method: 'GET',
      })
      const result = await res.json()
      console.log(result)
    }
    console.log(session_id)
    if (session_id) {
      fetchData()
    };
    
  }, [])
  return (
    <div>Cancel</div>
  )
}