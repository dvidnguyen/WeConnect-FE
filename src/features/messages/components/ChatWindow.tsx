import { useEffect, useState } from 'react'
import { ChatHeader } from './ChatHeader'
import ChatBody from './ChatBody'
import { ChatFooter } from './ChatFooter'
import { useConversations } from '../hook/useConversations'
import { useMessages } from '../hook/useMessages'
import { type SendMessageRequest } from '../../../api/message.api'
import type { ConversationMessage } from '../../../api/conversation.api'
import { toast } from 'sonner'

// <-- nếu bạn có hook auth, import nó và dùng. Ví dụ:
// import { useAuth } from '@/app/hooks/useAuth'

interface ChatWindowProps {
  selectedConversationId?: string
}

export const ChatWindow = ({ selectedConversationId }: ChatWindowProps) => {
  const { conversations, getConversations } = useConversations()

  // Lấy currentUserId: ưu tiên useAuth nếu có, fallback localStorage
  // Replace this by your actual auth hook if available
  // const { user } = useAuth();
  // const currentUserId = user?.id;
  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null
  const currentUserId = storedUser ? (JSON.parse(storedUser).id as string) : undefined

  // Truyền currentUserId vào useMessages để hook tự compute `mine`
  const { messages, sending, sendMessage, addMessage, loadMessages, replaceMessage } =
    useMessages(selectedConversationId, currentUserId)

  const [messageStatus, setMessageStatus] = useState<{
    [messageId: string]: 'sending' | 'sent' | 'error'
  }>({})

  // Load conversations when component mounts
  useEffect(() => {
    getConversations()
  }, [getConversations])

  // Find selected conversation
  const selectedConversation = selectedConversationId
    ? conversations.find(conv => conv.conversationId === selectedConversationId)
    : undefined

  // Load messages when conversation changes
  useEffect(() => {
    if (selectedConversationId) {
      loadMessages(selectedConversationId)
      setMessageStatus({})
    }
  }, [selectedConversationId, loadMessages])

  const handleSendMessage = async (content: string, type: 'text' | 'image' | 'voice', files?: File[]) => {
    if (!selectedConversationId) return

    // Tạo temp id để dễ replace sau
    const tempId = `temp_${Date.now()}`

    // Tạo message object để hiển thị ngay lập tức
    const tempMessage: ConversationMessage = {
      id: tempId,
      conversationId: selectedConversationId,
      senderId: currentUserId || '',
      senderName: 'Bạn',
      type,
      receipt: 0,
      reaction: 0,
      url: [],
      urlDownload: [],
      content,
      sentAt: new Date().toISOString(),
      mine: true, // client biết chắc là tin nhắn mình gửi
      senderAvatar: null
    }

    // Hiển thị tin nhắn ngay lập tức với trạng thái "sending"
    addMessage(tempMessage)
    setMessageStatus(prev => ({ ...prev, [tempId]: 'sending' }))

    try {
      // prepare payload; nếu type của SendMessageRequest không có clientTempId,
      // cast sang any để gửi; backend nếu hỗ trợ sẽ echo lại clientTempId
      const sendData: SendMessageRequest & { clientTempId?: string } = {
        conversationId: selectedConversationId,
        content,
        type,
        files,
        clientTempId: tempId
      }

      // Gửi tin nhắn đến server
      const response = await sendMessage(sendData as SendMessageRequest)

      if (response) {
        const serverMessage: ConversationMessage = {
          ...response, // giữ nguyên mine từ BE
        }
        replaceMessage((response as any).clientTempId || tempId, serverMessage)

        setMessageStatus(prev => {
          const copy = { ...prev }
          delete copy[tempId]
          return copy
        })
      }
    } catch (error) {
      // Xử lý lỗi
      setMessageStatus(prev => ({ ...prev, [tempId]: 'error' }))
      toast.error('Không thể gửi tin nhắn')
      console.error('Send message error:', error)
    }
  }

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
