import { useState } from 'react'
import { ConversationList, ChatWindow } from '../components'

const MessagesPage = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string>()

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId)
  }

  return (
    <div className="flex min-h-0">
      {/* Left: Conversation List */}
      <ConversationList
        selectedConversationId={selectedConversationId}
        onSelectConversation={handleSelectConversation}
      />

      {/* Right: Chat Window */}
      <ChatWindow selectedConversationId={selectedConversationId} />
    </div>
  )
}

export default MessagesPage
