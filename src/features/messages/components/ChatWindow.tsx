import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ChatHeader } from './ChatHeader'
import ChatBody from './ChatBody'
import { ChatFooter } from './ChatFooter'
import { useConversations } from '../hook/useConversations'
import { useMessages } from '../hook/useMessages'
import { type SendMessageRequest } from '../../../api/message.api'
import type { ConversationMessage } from '../../../api/conversation.api'
import { toast } from 'sonner'

import { socketService } from '@/services/socket.service'
import conversationService from '@/services/conversation.service'
import { messageService } from '@/services/message.service'


// <-- nếu bạn có hook auth, import nó và dùng. Ví dụ:
// import { useAuth } from '@/app/hooks/useAuth'

interface ChatWindowProps {
  selectedConversationId?: string
}

export const ChatWindow = ({ selectedConversationId }: ChatWindowProps) => {
  const { conversations, getConversations } = useConversations()

  // Auth: replace with your auth hook if available
  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null
  const currentUserId = storedUser ? (JSON.parse(storedUser).id as string) : undefined

  // messages & helpers come from hook
  const { messages, sending, sendMessage, addMessage, loadMessages, replaceMessage } =
    useMessages(selectedConversationId ?? undefined, currentUserId)

  const [messageStatus, setMessageStatus] = useState<Record<string, 'sending' | 'sent' | 'error'>>({})

  // refs to avoid stale closures in socket handlers
  const selectedConvRef = useRef<string | null>(selectedConversationId ?? null)
  const messagesRef = useRef<ConversationMessage[]>(messages)
  messagesRef.current = messages

  useEffect(() => {
    selectedConvRef.current = selectedConversationId ?? null
  }, [selectedConversationId])

  // initial load of conversation list
  useEffect(() => {
    getConversations()
  }, [getConversations])

  // load messages when selected conversation changes
  useEffect(() => {
    if (selectedConversationId) {
      loadMessages(selectedConversationId)
      setMessageStatus({})
    }
  }, [selectedConversationId, loadMessages])

  // handle sending message (optimistic + replace)
  const handleSendMessage = useCallback(async (content: string, type: 'text' | 'image' | 'voice', files?: File[]) => {
    if (!selectedConversationId) return

    const tempId = `temp_${Date.now()}`

    const tempMessage: ConversationMessage = {
      id: tempId,
      conversationId: selectedConversationId,
      senderId: currentUserId ?? '',
      senderName: 'Bạn',
      type,
      receipt: 0,
      reaction: 0,
      url: [],
      urlDownload: [],
      content,
      sentAt: new Date().toISOString(),
      mine: true,
      senderAvatar: null
    }

    // optimistic UI
    addMessage(tempMessage)
    setMessageStatus(prev => ({ ...prev, [tempId]: 'sending' }))

    try {
      const sendData: SendMessageRequest & { clientTempId?: string } = {
        conversationId: selectedConversationId,
        content,
        type,
        files,
        clientTempId: tempId
      }

      const response = await sendMessage(sendData as SendMessageRequest)

      if (response) {
        const serverMessage: ConversationMessage = { ...response }
        // replace optimistic message by server message (matched by clientTempId or tempId)
        replaceMessage((response as any).clientTempId || tempId, serverMessage)

        setMessageStatus(prev => {
          const copy = { ...prev }
          delete copy[tempId]
          return copy
        })
      }
    } catch (error) {
      setMessageStatus(prev => ({ ...prev, [tempId]: 'error' }))
      toast.error('Không thể gửi tin nhắn')
      console.error('Send message error:', error)
    }
  }, [selectedConversationId, currentUserId, addMessage, sendMessage, replaceMessage])

  // socket: incoming message append
  useEffect(() => {
    const onMessage = (payload: any) => {
      try {
        if (!payload || !payload.conversationId) return
        // if message belongs to the currently open conversation -> append
        if (payload.conversationId === selectedConvRef.current) {
          // guard dup
          if (messagesRef.current.some(m => m.id === payload.id)) return
          addMessage(payload as ConversationMessage)

          // optimistic mark read: ask backend to mark up to this message as read
          if (!payload.mine) {
            try {
              messageService.markConversationRead(payload.conversationId, payload.id)
            } catch (e) {
              // ignore
            }
          }
        } else {
          // message belongs to other conversation: conversation:update will handle UI preview/unread in list
        }
      } catch (e) {
        console.warn('[ChatWindow] onMessage handler error', e)
      }
    }

    socketService.on('message', onMessage)
    return () => { socketService.off('message', onMessage) }
  }, [addMessage])

  // conversation:update handler for currently open conversation
  useEffect(() => {
    const handler = (payloadAny: any) => {
      const payload = payloadAny?.detail ?? payloadAny
      if (!payload || !payload.conversationId) return

      // if this update is for the currently open convo, ensure local messages are in sync
      if (payload.conversationId === selectedConvRef.current) {
        // If server included a lastMessageTime, compare to our last message's sentAt
        const lastLocalTime = messagesRef.current.length ? new Date(messagesRef.current[messagesRef.current.length - 1].sentAt).getTime() : 0
        const incomingTime = payload.lastMessageTime ? new Date(payload.lastMessageTime).getTime() : 0

        if (incomingTime > lastLocalTime) {
          // fetch tail messages to ensure we have the real message
          if (selectedConvRef.current) {
            loadMessages(selectedConvRef.current)
          }
        } else {
          // otherwise ensure unread is reset on server side (optional)
          try { conversationService.resetUnreadCount(payload.conversationId) } catch (e) { /* ignore */ }
        }
      }
    }

    // register both: service callback and window event
    conversationService.onConversationUpdate(handler)
    window.addEventListener('conversation:update', handler)

    return () => {
      conversationService.offConversationUpdate()
      window.removeEventListener('conversation:update', handler)
    }
  }, [loadMessages])

  // UI: find selected conversation for header
  const selectedConversation = selectedConversationId
    ? conversations.find(conv => conv.conversationId === selectedConversationId)
    : undefined
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Header */}
      <ChatHeader
        conversation={selectedConversation}
        conversationId={selectedConversationId}
      />

      {/* Body */}
      <ChatBody
        conversationId={selectedConversationId}
        messages={messages}
        messageStatus={messageStatus}
      />

      {/* Footer */}
      <ChatFooter
        conversationId={selectedConversationId}
        onSendMessage={handleSendMessage}
        sending={sending}
      />
    </div>
  )
}

export default ChatWindow
