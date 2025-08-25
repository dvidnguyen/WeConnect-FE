import { useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { cn } from '@/shared/utils/cn.utils'
import type { ConversationMessage } from '../../../api/conversation.api'
import '../ScrollBar.css'

interface ChatBodyProps {
  conversationId?: string
  messages: ConversationMessage[]
  messageStatus?: {
    [messageId: string]: 'sending' | 'sent' | 'error'
  }
}

// Export as named export for convenience; we also export default at the end
export const ChatBody = ({ conversationId, messages, messageStatus = {} }: ChatBodyProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom when new messages arrive (use messages.length to avoid
  // retriggering on stable message objects)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  // Format time function
  const formatTime = (timeString: string) => {
    const date = new Date(timeString)
    // nếu bạn đang bù timezone bằng +17 giờ trước đó, giữ, nếu không xóa dòng dưới
    date.setHours(date.getHours() + 17)
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  // Get status icon for message
  const getStatusIcon = (messageId: string) => {
    const status = messageStatus[messageId]
    switch (status) {
      case 'sending':
        return (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-muted-foreground">Đang gửi...</span>
          </div>
        )
      case 'sent':
        return (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs text-green-500">Đã gửi</span>
          </div>
        )
      case 'error':
        return (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs text-red-500">Gửi thất bại</span>
          </div>
        )
      default:
        return null
    }
  }

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-medium mb-2">Chào mừng đến với WeConnect</h3>
          <p className="text-muted-foreground">Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu nhắn tin</p>
        </div>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">Chưa có tin nhắn nào</p>
          <p className="text-sm text-muted-foreground">Hãy gửi tin nhắn đầu tiên!</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex-1 min-h-0 overflow-y-auto custom-scrollbar`}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex gap-3 max-w-[70%]",
            message.mine ? "ml-auto flex-row-reverse" : "mr-auto"
          )}
        >
          {/* Avatar */}
          {!message.mine && (
            <Avatar className="h-8 w-8 mt-1">
              <AvatarImage src={message.senderAvatar || undefined} alt={message.senderName} />
              <AvatarFallback className="text-xs">
                {message.senderName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}

          {/* Message Content */}
          <div className={cn("flex flex-col gap-1", message.mine && "items-end")}>
            {/* Sender Name (only for others) */}
            {!message.mine && (
              <span className="text-xs text-muted-foreground font-medium">
                {message.senderName}
              </span>
            )}

            {/* Message Bubble */}
            <div
              className={cn(
                "rounded-lg px-3 py-2 max-w-md break-words",
                message.mine
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              {/* Text Content */}
              {message.type === 'text' && <p>{message.content}</p>}

              {/* Image Content */}
              {message.type === 'image' && (
                <div className="space-y-2">
                  {message.content && <p>{message.content}</p>}
                  {message.url && message.url.length > 0 ? (
                    <div className="grid gap-2">
                      {message.url.map((imageUrl, index) => (
                        <img
                          key={index}
                          src={imageUrl}
                          alt="Hình ảnh"
                          className="max-w-full h-auto rounded"
                          loading="lazy"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="p-2 bg-muted/20 rounded text-sm">
                      📷 Đang tải hình ảnh...
                    </div>
                  )}
                </div>
              )}

              {/* File Content */}
              {message.type === 'file' && (
                <div className="space-y-2">
                  {message.content && <p>{message.content}</p>}
                  {message.url && message.url.length > 0 ? (
                    <div className="space-y-1">
                      {message.url.map((fileUrl, index) => (
                        <a
                          key={index}
                          href={message.urlDownload?.[index] || fileUrl}
                          download
                          className="block p-2 bg-background/20 rounded text-sm hover:bg-background/30 transition-colors"
                        >
                          📎 Tải xuống file
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="p-2 bg-muted/20 rounded text-sm">
                      📎 Đang tải file...
                    </div>
                  )}
                </div>
              )}

              {/* Voice Content */}
              {message.type === 'voice' && (
                <div className="space-y-2">
                  {message.content && <p>{message.content}</p>}
                  {message.url && message.url.length > 0 ? (
                    message.url.map((audioUrl, index) => (
                      <audio key={index} controls className="max-w-full">
                        <source src={audioUrl} type="audio/mpeg" />
                        <source src={audioUrl} type="audio/wav" />
                        <source src={audioUrl} type="audio/ogg" />
                        Trình duyệt không hỗ trợ phát audio.
                      </audio>
                    ))
                  ) : (
                    <div className="p-2 bg-muted/20 rounded text-sm">
                      🎤 Đang tải audio...
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Timestamp and Status */}
            <div className={cn(
              "flex items-center gap-2",
              message.mine ? "justify-end" : "justify-start"
            )}>
              <span className="text-xs text-muted-foreground">
                {formatTime(message.sentAt)}
              </span>
              {/* Status chỉ hiển thị cho tin nhắn của mình */}
              {message.mine && getStatusIcon(message.id)}
            </div>
          </div>
        </div>
      ))}
      {/* Invisible div for auto-scroll */}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatBody
