import { useEffect, useState } from 'react'
import { ChatHeader } from './ChatHeader'
import ChatBody from './ChatBody'
import { ChatFooter } from './ChatFooter'
import { useConversations } from '../hook/useConversations'
import { messageAPI, type SendMessageRequest } from '../../../api/message.api'
import type { ConversationMessage } from '../../../api/conversation.api'
import { toast } from 'sonner'

interface ChatWindowProps {
  selectedConversationId?: string
}

export const ChatWindow = ({ selectedConversationId }: ChatWindowProps) => {
  const { conversations, getConversationMessages, getConversations } = useConversations()
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [sending, setSending] = useState(false)

  // Load conversations when component mounts
  useEffect(() => {
    getConversations()
  }, [getConversations])

  // Find selected conversation
  const selectedConversation = selectedConversationId
    ? conversations.find(conv => conv.conversationId === selectedConversationId)
    : undefined

  // Debug logging
  console.log('ChatWindow Debug:', {
    selectedConversationId,
    conversationsCount: conversations.length,
    selectedConversation,
    allConversations: conversations
  })

  // Load messages when conversation changes
  useEffect(() => {
    const loadMessages = async () => {
      if (selectedConversationId) {
        const messagesData = await getConversationMessages(selectedConversationId)
        setMessages(messagesData)
      } else {
        setMessages([])
      }
    }

    loadMessages()
  }, [selectedConversationId, getConversationMessages])

  const handleSendMessage = async (content: string, type: 'text' | 'image' | 'voice', files?: File[]) => {
    if (!selectedConversationId) return

    try {
      setSending(true)

      const sendData: SendMessageRequest = {
        conversationId: selectedConversationId,
        content,
        type,
        files
      }

      const response = await messageAPI.sendMessage(sendData)

      if (response.code === 200) {
        // Add new message to current messages
        setMessages(prev => [...prev, response.result])
        toast.success('Tin nhắn đã được gửi')
      }
    } catch (error) {
      toast.error('Không thể gửi tin nhắn')
      console.error('Send message error:', error)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col ">
      {/* Header */}
      <ChatHeader
        conversation={selectedConversation}
        conversationId={selectedConversationId}
      />

      {/* Body */}
      <ChatBody
        conversationId={selectedConversationId}
        messages={messages}
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
