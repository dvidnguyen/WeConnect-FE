import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { Button } from '@/shared/components/ui/button'
import { Phone, Video, MoreVertical, Loader2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import type { Conversation } from '../../../api/conversation.api'
import CallDialog from './CallDialog'
import { useEffect, useState } from 'react'
import { callService } from '@/services/call.service'

interface ChatHeaderProps {
  conversation?: Conversation
  conversationId?: string
}

export const ChatHeader = ({ conversation, conversationId }: ChatHeaderProps) => {
  // Show loading state if we have conversationId but no conversation data yet
  if (conversationId && !conversation) {
    return (
      <div className="h-16 border-b flex items-center justify-center bg-muted/30">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        <p className="text-muted-foreground">Đang tải thông tin cuộc trò chuyện...</p>
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="h-16 border-b flex items-center justify-center bg-muted/30">
        <p className="text-muted-foreground">Chọn một cuộc trò chuyện để bắt đầu</p>
      </div>
    )
  }

  const [callDialogOpen, setCallDialogOpen] = useState(false)
  const [callMedia, setCallMedia] = useState<'video' | 'audio'>('audio')
  const [callerName, setCallerName] = useState<string>('')
  const [callerAvatar, setCallerAvatar] = useState<string>('')

  // Lắng nghe sự kiện call:ring
  useEffect(() => {
    const onRing = (data: { conversationId: string; fromUserId: string; media: string }) => {
      setCallDialogOpen(true)
      setCallMedia(data.media === 'video' ? 'video' : 'audio')
      setCallerName(data.fromUserId) // Nếu có thể lấy tên từ userId thì thay bằng tên
      setCallerAvatar('') // Nếu có thể lấy avatar từ userId thì thay bằng avatar
    }

    callService.onCallRing(onRing)

    return () => {
      // Clean up listener để tránh leak / override callback
      callService.offCallRing()
    }
  }, [])

  const handleAcceptCall = () => {
    if (conversationId) {
      callService.acceptCall(conversationId)
      setCallDialogOpen(false)
    }
  }

  const handleRejectCall = () => {
    if (conversationId) {
      callService.rejectCall(conversationId)
      setCallDialogOpen(false)
    }
  }

  const handleVoiceCall = () => {
    if (conversationId) {
      callService.inviteCall(conversationId, 'audio')
    }
  }

  const handleVideoCall = () => {
    if (conversationId) {
      callService.inviteCall(conversationId, 'video')
    }
  }

  return (
    <div className="h-16 border-b bg-background flex items-center justify-between px-4">
      {/* Left: Avatar and Info */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={conversation.avatar || undefined} alt={conversation.name} />
            <AvatarFallback>
              {conversation.type === 'group' ? '👥' : conversation.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {/* Note: Online status not available in current API response */}
        </div>
        <div>
          <h3 className="font-medium">{conversation.name}</h3>
          <p className="text-xs text-muted-foreground">
            {conversation.type === 'direct'
              ? 'Nhấn để xem thông tin'
              : `Nhóm chat`
            }
          </p>
        </div>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-2">
        {conversation.type === 'direct' && (
          <>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={handleVoiceCall}>
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={handleVideoCall}>
              <Video className="h-4 w-4" />
            </Button>
          </>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Xem thông tin</DropdownMenuItem>
            <DropdownMenuItem>Tìm trong cuộc trò chuyện</DropdownMenuItem>
            <DropdownMenuItem>Tắt thông báo</DropdownMenuItem>
            {conversation.type === 'direct' && (
              <DropdownMenuItem className="text-red-600">Chặn người dùng</DropdownMenuItem>
            )}
            <DropdownMenuItem className="text-red-600">Xóa cuộc trò chuyện</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* CallDialog cho người nhận */}
      <CallDialog
        open={callDialogOpen}
        media={callMedia}
        callerName={callerName}
        callerAvatar={callerAvatar}
        calleeName={conversation?.name}
        calleeAvatar={conversation?.avatar || ''}
        onAccept={handleAcceptCall}
        onReject={handleRejectCall}
      />
    </div>
  )
}

export default ChatHeader
