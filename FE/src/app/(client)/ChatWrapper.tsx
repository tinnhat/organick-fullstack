'use client'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import FloatingChatButton from '@/components/chat/FloatingChatButton'

export default function ChatWrapper() {
  const { data: session } = useSession()
  const { data: unreadData } = useQuery({
    queryKey: ['unread-count'],
    queryFn: async () => {
      const res = await fetch('/v1/chat/unread-count')
      if (!res.ok) throw new Error('Failed to fetch unread count')
      return res.json()
    },
    enabled: session?.user !== undefined,
  })

  if (session?.user) {
    return <FloatingChatButton unreadCount={unreadData?.unreadCount ?? 0} />
  }
  return null
}
