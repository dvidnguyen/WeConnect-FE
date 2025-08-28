// src/components/ConversationList.tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { Badge } from '@/shared/components/ui/badge'
import { cn } from '@/shared/utils/cn.utils'
import { useConversations } from '../hook/useConversations'
import { useEffect, useState, useCallback } from 'react'
import { Loader2 } from 'lucide-react'
import conversationService from '@/services/conversation.service' // <-- đảm bảo path đúng

interface ConversationListProps {
  selectedConversationId?: string
  onSelectConversation: (conversationId: string) => void
}

export const ConversationList = ({ selectedConversationId, onSelectConversation }: ConversationListProps) => {
  const { conversations, loading, getConversations } = useConversations()

  // local copy so we can patch one item without refetching whole list
  const [localConversations, setLocalConversations] = useState(() => conversations ?? [])

  // sync when hook updates
  useEffect(() => {
    setLocalConversations(conversations ?? [])
  }, [conversations])

  // Load conversations once
  useEffect(() => {
    getConversations()
  }, [getConversations])

  // update handler: patch one conversation in localConversations
  const handleConvUpdate = useCallback((payloadAny: any) => {
    const payload = payloadAny?.detail ?? payloadAny
    if (!payload || !payload.conversationId) return

    setLocalConversations(prev => {
      let found = false
      const next = prev.map(c => {
        if (c.conversationId === payload.conversationId) {
          found = true
          return {
            ...c,
            lastMessage: payload.lastMessage ?? c.lastMessage,
            unreadCount: typeof payload.unreadCount === 'number' ? payload.unreadCount : c.unreadCount,
            lastMessageTime: payload.lastMessageTime ?? c.lastMessageTime,
          }
        }
        return c
      })

      // if conversation not found locally, optionally prepend a synthetic entry
      if (!found && payload.conversationId) {
        const synthetic = {
          conversationId: payload.conversationId,
          name: payload.name ?? 'Không tên',
          avatar: payload.avatar ?? null,
          type: payload.type ?? 'private',
          lastMessage: payload.lastMessage ?? '',
          lastMessageTime: payload.lastMessageTime ?? new Date().toISOString(),
          unreadCount: payload.unreadCount ?? 1,
        }
        return [synthetic, ...next]
      }

      return next
    })
  }, [])

  useEffect(() => {
    // register both interfaces (preferred callback + window event)
    conversationService.onConversationUpdate(handleConvUpdate)
    const winHandler = (e: any) => handleConvUpdate(e?.detail ?? e)
    window.addEventListener('conversation:update', winHandler)

    return () => {
      conversationService.offConversationUpdate()
      window.removeEventListener('conversation:update', winHandler)
    }
  }, [handleConvUpdate])

  const formatTime = (timeString: string | null) => {
    if (!timeString) return 'Mới tạo'
    const date = new Date(timeString)
    const now = new Date()
    const diffInMilliseconds = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60))
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInMinutes < 1) return 'Vừa xong'
    if (diffInMinutes < 60) return `${diffInMinutes} phút`
    if (diffInHours < 24) return `${diffInHours} giờ`
    return `${diffInDays} ngày`
  }

  return (
    <div className="w-80 border-r bg-background flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Tin nhắn</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2 text-sm text-muted-foreground">Đang tải...</span>
          </div>
        ) : (localConversations?.length ?? 0) === 0 ? (
          <div className="flex items-center justify-center py-8">
            <span className="text-sm text-muted-foreground">Chưa có cuộc trò chuyện nào</span>
          </div>
        ) : (
          localConversations.map((conversation: any) => (
            <div
              key={conversation.conversationId}
              onClick={() => onSelectConversation(conversation.conversationId)}
              className={cn(
                "flex items-center gap-3 p-4 hover:bg-accent cursor-pointer transition-colors border-b",
                selectedConversationId === conversation.conversationId && "bg-accent"
              )}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={conversation.avatar || undefined} alt={conversation.name} />
                  <AvatarFallback>
                    {conversation.type === 'group' ? '👥' : (conversation.name?.charAt(0)?.toUpperCase() ?? 'U')}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium truncate">{conversation.name}</h3>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(conversation.lastMessageTime)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.lastMessage || (conversation.type === 'group'
                      ? `Nhóm ${conversation.name} đã được tạo. Hãy bắt đầu trò chuyện!`
                      : `Đã chào ${conversation.name}! Hãy bắt đầu cuộc trò chuyện`
                    )}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <Badge variant="destructive" className="ml-2 h-5 min-w-5 text-xs flex items-center justify-center">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ConversationList
