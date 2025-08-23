import { useState } from 'react'
import { ConversationList, ChatWindow } from '../components'

const MessagesPage = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string>()

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId)
  }

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
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
