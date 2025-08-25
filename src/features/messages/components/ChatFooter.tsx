import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Send, Image, Mic, Smile } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip'

interface ChatFooterProps {
  conversationId?: string
  onSendMessage?: (content: string, type: 'text' | 'image' | 'voice', files?: File[]) => void
  sending?: boolean
}

export const ChatFooter = ({ conversationId, onSendMessage, sending }: ChatFooterProps) => {
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  const handleSendMessage = () => {
    if ((!message.trim() && files.length === 0) || !conversationId || sending) return

    // Xác định type dựa trên files
    let messageType: 'text' | 'image' | 'voice' = 'text'
    if (files.length > 0) {
      const firstFile = files[0]
      if (firstFile.type.startsWith('image/')) {
        messageType = 'image'
      } else if (firstFile.type.startsWith('audio/')) {
        messageType = 'voice'
      }
    }

    onSendMessage?.(message, messageType, files)
    setMessage('')
    setFiles([]) // Reset files sau khi gửi
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording)
    // TODO: Implement voice recording
  }

  if (!conversationId) {
    return null
  }

  return (
    <div className="border-t bg-background p-4">
      <div className="flex items-end gap-2">
        {/* Left Actions */}
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <label className="h-9 w-9 p-0 flex items-center justify-center cursor-pointer">
                  <Image className="h-4 w-4" />
                  <input
                    type="file"
                    multiple
                    accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </TooltipTrigger>
              <TooltipContent>
                <p>Gửi ảnh/file</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-9 w-9 p-0 ${isRecording ? 'text-blue-500' : ''}`}
                  onClick={handleVoiceRecord}
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isRecording ? 'Dừng ghi âm' : 'Ghi âm'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0"
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Emoji</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Message Input */}
        <div className="flex-1 relative">
          <Input
            placeholder="Nhập tin nhắn..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pr-12 min-h-[40px] resize-none"
            disabled={isRecording || sending}
          />
          {/* Hiển thị file đã chọn */}
          {files.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {files.map((file, idx) => (
                <span key={idx} className="px-2 py-1 bg-muted rounded text-xs">
                  {file.name}
                </span>
              ))}
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => setFiles([])}>
                  Xóa file
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={sending}
                >
                  Gửi file
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSendMessage}
          disabled={(!message.trim() && files.length === 0) || isRecording || sending}
          size="sm"
          className="h-10 w-10 p-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="mt-2 flex items-center gap-2 text-red-500 text-sm">
          <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
          <span>Đang ghi âm...</span>
        </div>
      )}
    </div>
  )
}

export default ChatFooter
