export const SOCKET_EVENTS = {
  CLIENT: {
    SEND_MESSAGE: 'sendMessage',
    GET_MESSAGES: 'getMessages',
    GET_CONVERSATIONS: 'getConversations',
    TYPING: 'typing',
    MARK_AS_READ: 'markAsRead',
    DELETE_MESSAGE: 'deleteMessage',
    GET_NOTIFICATIONS: 'getNotifications',
  },
  SERVER: {
    NEW_MESSAGE: 'newMessage',
    MESSAGES_HISTORY: 'messagesHistory',
    CONVERSATIONS_LIST: 'conversationsList',
    TYPING: 'typing',
    UNREAD_UPDATE: 'unreadUpdate',
    NOTIFICATION: 'notification',
    NOTIFICATIONS_LIST: 'notificationsList',
    ONLINE_USERS: 'onlineUsers',
    USER_ONLINE: 'userOnline',
    USER_OFFLINE: 'userOffline',
  },
} as const

export type SocketEvents = typeof SOCKET_EVENTS
