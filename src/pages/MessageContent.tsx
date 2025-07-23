import React from 'react'
import { useParams } from 'react-router-dom'

// Định nghĩa kiểu dữ liệu cho tin nhắn
type Message = {
  id: number;
  senderId: number;
  content: string;
  timestamp: string;
}

const MessageContent = () => {
  // Lấy ID cuộc trò chuyện từ Url từ react-router-dom
  const { id } = useParams();

  // State cho danh sách tin nhắn mock dât
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: 1,
      senderId: 1, // Người gửi
      content: "Chào bạn, dạo này bạn thế nào?",
      timestamp: "10:30 AM"
    },
    {
      id: 2,
      senderId: 0, // Người dùng hiện tại
      content: "Chào! Tôi khỏe, còn bạn?",
      timestamp: "10:32 AM"
    },
    {
      id: 3,
      senderId: 1,
      content: "Tôi cũng vậy. Bạn có rảnh gặp mặt cuối tuần này không?",
      timestamp: "10:34 AM"
    }
  ]);

  // State cho tin nhắn đang nhập
  const [newMessage, setNewMessage] = React.useState("");

  // Xử lý gửi tin nhắn
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        senderId: 0, // Người dùng hiện tại
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  // Hiển thị tin nhắn theo ID người gửi (0 là người dùng hiện tại)
  const renderMessage = (message: Message) => {
    const isSentByMe = message.senderId === 0;
    return (
      <div
        key={message.id}
        className={`mb-4 flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`px-4 py-2 rounded-lg max-w-[80%] ${isSentByMe ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
        >
          <div>{message.content}</div>
          <div className={`text-xs mt-1 ${isSentByMe ? 'text-blue-100' : 'text-gray-500'}`}>
            {message.timestamp}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="font-bold">Cuộc trò chuyện #{id}</h2>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(renderMessage)}
      </div>

      {/* Message input */}
      <form onSubmit={handleSendMessage} className="border-t p-4 flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Nhập tin nhắn..."
          className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none"
        >
          Gửi
        </button>
      </form>
    </div>
  )
}

export default MessageContent
