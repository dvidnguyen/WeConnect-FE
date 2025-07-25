import React from 'react'

const MessageEmpty = () => {
  return (
    <div className="flex items-center justify-center h-full text-gray-500">
      <div className="text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto mb-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
        <h3 className="text-xl font-medium mb-2">Tin nhắn của bạn</h3>
        <p className="mb-4">Chọn một cuộc trò chuyện hoặc bắt đầu một cuộc trò chuyện mới</p>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Cuộc trò chuyện mới
        </button>
      </div>
    </div>
  )
}

export default MessageEmpty
