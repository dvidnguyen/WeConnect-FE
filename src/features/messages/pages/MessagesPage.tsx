import { Outlet, Link } from 'react-router-dom'
import { useMessages } from '@/features/messages/hooks/useMessages'
import { formatDate } from '@/shared/utils/date.utils'
import type { Conversation } from '@/features/messages/types/messages.types'
import { useState } from 'react'

/**
 * Component chính cho trang Messages
 * Layout: 2 cột, cột trái hiển thị danh sách cuộc trò chuyện, cột phải hiển thị nội dung tin nhắn
 */
const Messages = () => {
  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r flex flex-col">
        {/* Sidebar với 3 phần chính: avatar, danh sách tin nhắn và settings */}
        <div className="flex flex-col h-full">
          <UserProfileHeader />

          {/* Danh sách tin nhắn - chiếm phần lớn không gian */}
          <div className="flex-1 overflow-y-auto">
            <ContactList />
          </div>

          {/* Phần settings (bánh răng) */}
          <div className="p-4 border-t flex justify-between items-center">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Nội dung tin nhắn - Sẽ được hiển thị qua Outlet khi chọn cuộc trò chuyện */}
      <div className="w-3/4">
        <Outlet />
      </div>
    </div>
  )
}

/**
 * Component hiển thị thông tin người dùng hiện tại
 */
const UserProfileHeader = () => {
  const { currentUser } = useMessages();

  return (
    <div className="p-4 border-b flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden">
        <img
          src={currentUser?.avatar || "https://randomuser.me/api/portraits/women/65.jpg"}
          alt="User avatar"
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <div className="font-medium">{currentUser?.name || "Tên người dùng"}</div>
        <div className="text-xs text-green-500">
          {currentUser?.status === "online" ? "Online" :
            currentUser?.status === "away" ? "Away" : "Offline"}
        </div>
      </div>
    </div>
  );
}

/**
 * Component hiển thị danh sách liên hệ/cuộc trò chuyện
 */
const ContactList = () => {
  const { conversations, currentUser } = useMessages();
  const [searchTerm, setSearchTerm] = useState("");

  // Lọc cuộc trò chuyện theo từ khóa tìm kiếm
  const filteredConversations = conversations?.filter(conv => {
    const participantName = conv.isGroup ? conv.groupName :
      conv.participants.find(p => p.id !== currentUser?.id)?.name;
    return participantName?.toLowerCase().includes(searchTerm.toLowerCase());
  }) || [];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Tin nhắn</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1 pr-8 text-sm border rounded-full focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
            className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
      </div>
      <div className="space-y-1">
        {filteredConversations.map(conversation => (
          <ContactItem key={conversation.id} conversation={conversation} />
        ))}
      </div>
    </div>
  )
}

/**
 * Component hiển thị một liên hệ trong danh sách
 */
const ContactItem = ({ conversation }: { conversation: Conversation }) => {
  const { selectConversation, currentUser } = useMessages();

  // Nếu là group, hiển thị tên group, nếu không thì hiển thị tên người tham gia khác
  const displayName = conversation.isGroup
    ? conversation.groupName
    : conversation.participants.find(p => p.id !== currentUser?.id)?.name;

  // Avatar hiển thị
  const avatarUrl = conversation.isGroup
    ? conversation.groupAvatar
    : conversation.participants.find(p => p.id !== currentUser?.id)?.avatar;

  // Xác định tin nhắn gần nhất hiển thị "Bạn: " nếu là tin nhắn của mình
  const lastMessageText = conversation.lastMessage.senderId === currentUser?.id
    ? `Bạn: ${conversation.lastMessage.content}`
    : conversation.lastMessage.content;

  // Format thời gian
  const messageTime = formatDate(conversation.lastMessage.timestamp);

  return (
    <Link
      to={`/messages/${conversation.id}`}
      className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded transition-colors"
      onClick={() => selectConversation(conversation.id)}
    >
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
        <img
          src={avatarUrl}
          alt={displayName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thông tin tin nhắn */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <div className="font-medium truncate">{displayName}</div>
          <div className="text-xs text-gray-500">{messageTime}</div>
        </div>
        <div className="text-sm text-gray-500 truncate text-left">
          {lastMessageText}
        </div>
      </div>

      {/* Tin nhắn chưa đọc */}
      {conversation.unreadCount > 0 && (
        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white">
          {conversation.unreadCount}
        </div>
      )}
    </Link>
  )
}

export default Messages
