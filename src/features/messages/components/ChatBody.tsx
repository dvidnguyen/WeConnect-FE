import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { cn } from '@/shared/utils/cn.utils'
import type { ConversationMessage } from '../../../api/conversation.api'

interface ChatBodyProps {
  conversationId?: string
  messages: ConversationMessage[]
}

// Export as named export for proper module resolution
export const ChatBody = ({ conversationId, messages }: ChatBodyProps) => {
  // Format time function
  const formatTime = (timeString: string) => {
    const date = new Date(timeString)
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
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
    <div className="flex-1 min-h-0  overflow-y-auto p-4 space-y-4">
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
              {message.type === 'image' && message.url && message.url.length > 0 && (
                <div className="space-y-2">
                  {message.content && <p>{message.content}</p>}
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
                </div>
              )}

              {/* File Content */}
              {message.type === 'file' && message.url && message.url.length > 0 && (
                <div className="space-y-2">
                  {message.content && <p>{message.content}</p>}
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
                </div>
              )}

              {/* Voice Content */}
              {message.type === 'voice' && message.url && message.url.length > 0 && (
                <div className="space-y-2">
                  {message.content && <p>{message.content}</p>}
                  {message.url.map((audioUrl, index) => (
                    <audio key={index} controls className="max-w-full">
                      <source src={audioUrl} type="audio/mpeg" />
                      <source src={audioUrl} type="audio/wav" />
                      <source src={audioUrl} type="audio/ogg" />
                      Trình duyệt không hỗ trợ phát audio.
                    </audio>
                  ))}
                </div>
              )}
            </div>

            {/* Timestamp */}
            <span className={cn(
              "text-xs text-muted-foreground",
              message.mine ? "text-right" : "text-left"
            )}>
              {formatTime(message.sentAt)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ChatBody
