// src/components/ChatBody.tsx
import { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { cn } from '@/shared/utils/cn.utils'
import type { ConversationMessage } from '../../../api/conversation.api'
import '../ScrollBar.css'
import { DownloadCloud, Eye, FileText, Image as ImageIcon, Heart } from 'lucide-react'
import { messageService } from '@/services/message.service'
import { socketService } from '@/services/socket.service'

interface ChatBodyProps {
  conversationId?: string
  messages: ConversationMessage[]
  messageStatus?: {
    [messageId: string]: 'sending' | 'sent' | 'error'
  }
}

const getCurrentUserId = () => {
  try {
    if ((window as any).__USER__ && (window as any).__USER__.id) return (window as any).__USER__.id
    return localStorage.getItem('userId') || localStorage.getItem('currentUserId') || null
  } catch { return null }
}

export const ChatBody = ({ conversationId, messages, messageStatus = {} }: ChatBodyProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [seenByMap, setSeenByMap] = useState<Record<string, Set<string>>>({})
  const [reactionMap, setReactionMap] = useState<Record<string, { likeCount: number; likedByMe: boolean }>>({})
  const lastMarkedRef = useRef<string | null>(null)

  const currentUserId = getCurrentUserId()

  const isMessageFromOther = (m: any) => {
    if (!m) return false
    if (m.senderId) return String(m.senderId) !== String(currentUserId)
    return !m.mine
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  // initial mark-read when opening: use authoritative check
  useEffect(() => {
    if (!conversationId || messages.length === 0) return
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i]
      if (isMessageFromOther(m)) {
        if (lastMarkedRef.current !== m.id) {
          lastMarkedRef.current = m.id
          messageService.markConversationRead(conversationId, m.id)
        }
        break
      }
    }
  }, [conversationId, messages.length, currentUserId])

  // sync reaction map
  useEffect(() => {
    const next: Record<string, { likeCount: number; likedByMe: boolean }> = {}
    messages.forEach(m => {
      const likeCount = (m as any).reaction ?? 0
      const likedByMe = !!((m as any).likedByMe ?? (m as any).reacted ?? false)
      next[m.id] = { likeCount, likedByMe }
    })
    setReactionMap(prev => ({ ...prev, ...next }))
  }, [messages])

  const formatTime = (timeString: string) => {
    const date = new Date(timeString)
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })
  }

  const getStatusIcon = (messageId: string) => {
    const status = messageStatus[messageId]
    switch (status) {
      case 'sending': return <div className="flex items-center gap-1"><div className="w-3 h-3 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" /><span className="text-xs text-muted-foreground">Đang gửi...</span></div>
      case 'sent': return <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center"><svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></div><span className="text-xs text-green-500">Đã gửi</span></div>
      case 'error': return <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-full flex items-center justify-center"><svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg></div><span className="text-xs text-red-500">Gửi thất bại</span></div>
      default: return null
    }
  }

  const markReadForMessage = (messageId: string) => {
    if (!conversationId) return
    if (lastMarkedRef.current === messageId) return
    lastMarkedRef.current = messageId
    messageService.markConversationRead(conversationId, messageId)
  }

  // IntersectionObserver: mark visible incoming messages as read
  useEffect(() => {
    if (!conversationId) return
    const selector = '[data-msg-id]'
    const els = Array.from(document.querySelectorAll(selector)) as HTMLElement[]
    if (els.length === 0) return

    const observer = new IntersectionObserver((entries) => {
      let highestIdx = -1
      let highestMsgId: string | null = null
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement
          const msgId = el.getAttribute('data-msg-id') || ''
          const idx = messages.findIndex(m => m.id === msgId)
          if (idx > highestIdx && idx !== -1 && isMessageFromOther(messages[idx])) {
            highestIdx = idx
            highestMsgId = msgId
          }
        }
      })
      if (highestMsgId) markReadForMessage(highestMsgId)
    }, { root: null, rootMargin: '0px', threshold: 0.6 })

    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [messages, conversationId, currentUserId])

  // receipt updates -> seenByMap (use unsubscribe returned by messageService)
  useEffect(() => {
    if (!conversationId) return
    const onReceipt = (payload: any) => {
      if (!payload || payload.conversationId !== conversationId) return
      setSeenByMap(prev => {
        const next = { ...prev }
        const reader = payload.userId ?? 'unknown'
        if (payload.messageId) {
          const s = new Set(Array.from(next[payload.messageId] ?? [])); s.add(reader); next[payload.messageId] = s
        } else if (payload.readAt) {
          const readAt = new Date(payload.readAt).getTime()
          messages.forEach(m => {
            if (new Date(m.sentAt).getTime() <= readAt) {
              const s = new Set(Array.from(next[m.id] ?? [])); s.add(reader); next[m.id] = s
            }
          })
        }
        return next
      })
    }
    const unsub1 = messageService.onReceiptUpdate(onReceipt)
    const unsub2 = messageService.onReceiptAck(onReceipt)
    return () => { unsub1 && unsub1(); unsub2 && unsub2(); }
  }, [conversationId, messages])

  // reaction listeners unchanged
  useEffect(() => {
    const onReactionUpdate = (payload: any) => {
      if (payload.conversationId !== conversationId) return
      setReactionMap(prev => {
        const cur = prev[payload.messageId] ?? { likeCount: 0, likedByMe: false }
        return { ...prev, [payload.messageId]: { likeCount: payload.likeCount ?? cur.likeCount, likedByMe: cur.likedByMe ?? false } }
      })
    }
    const onReactionAck = (payload: any) => {
      if (payload.conversationId !== conversationId) return
      setReactionMap(prev => {
        const cur = prev[payload.messageId] ?? { likeCount: 0, likedByMe: false }
        return { ...prev, [payload.messageId]: { likeCount: payload.likeCount ?? cur.likeCount, likedByMe: payload.likedByMe ?? cur.likedByMe } }
      })
    }

    socketService.on('reaction-update', onReactionUpdate)
    socketService.on('reaction-ack', onReactionAck)
    return () => {
      socketService.off('reaction-update', onReactionUpdate)
      socketService.off('reaction-ack', onReactionAck)
    }
  }, [conversationId])

  const toggleLike = (messageId: string) => {
    const cur = reactionMap[messageId] ?? { likeCount: 0, likedByMe: false }
    const nextLiked = !cur.likedByMe
    const nextCount = nextLiked ? cur.likeCount + 1 : Math.max(0, cur.likeCount - 1)
    setReactionMap(prev => ({ ...prev, [messageId]: { likeCount: nextCount, likedByMe: nextLiked } }))
    try {
      if (messageService && (messageService as any).sendReaction) {
        (messageService as any).sendReaction(messageId, nextLiked)
      } else {
        socketService.emit('reaction-like', { messageId, like: nextLiked }, (ack: any) => {
          if (ack && ack.messageId) {
            setReactionMap(prev => {
              const c = prev[ack.messageId] ?? { likeCount: 0, likedByMe: false }
              return { ...prev, [ack.messageId]: { likeCount: ack.likeCount ?? c.likeCount, likedByMe: ack.likedByMe ?? c.likedByMe } }
            })
          }
        })
      }
    } catch (e) {
      console.warn('[ChatBody] reaction emit failed', e)
      setReactionMap(prev => ({ ...prev, [messageId]: cur }))
    }
  }

  if (!conversationId) return (<div className="flex-1 flex items-center justify-center bg-muted/20"><div className="text-center space-y-2"><h3 className="text-lg font-medium mb-2">Chào mừng đến với WeConnect</h3><p className="text-muted-foreground">Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu nhắn tin</p></div></div>)
  if (messages.length === 0) return (<div className="flex-1 flex items-center justify-center bg-muted/20"><div className="text-center space-y-2"><p className="text-muted-foreground">Chưa có tin nhắn nào</p><p className="text-sm text-muted-foreground">Hãy gửi tin nhắn đầu tiên!</p></div></div>)

  return (
    <div className={`flex-1 min-h-0 overflow-y-auto custom-scrollbar`}>
      {messages.map((message, idx) => {
        const isLast = idx === messages.length - 1
        const reaction = reactionMap[message.id] ?? { likeCount: 0, likedByMe: false }
        const seenSet = seenByMap[message.id] ?? new Set<string>()
        const authoritativeMine = message.senderId
          ? String(message.senderId) === String(currentUserId)
          : message.mine === true;

        return (
          <div key={message.id} data-msg-id={message.id} onClick={() => { if (isMessageFromOther(message)) markReadForMessage(message.id) }} className={cn("flex gap-3 max-w-[70%] my-2", authoritativeMine ? "ml-auto flex-row-reverse" : "mr-auto")} style={{ cursor: authoritativeMine ? 'default' : 'pointer' }}>
            {!authoritativeMine && (<Avatar className="h-8 w-8 mt-1"><AvatarImage src={message.senderAvatar || undefined} alt={message.senderName} /><AvatarFallback className="text-xs">{message.senderName?.charAt(0)?.toUpperCase() ?? '?'}</AvatarFallback></Avatar>)}
            <div className={cn("flex flex-col gap-1", authoritativeMine && "items-end")}>
              {!authoritativeMine && <span className="text-xs text-muted-foreground font-medium">{message.senderName}</span>}
              <div className={cn("rounded-lg px-3 py-2 max-w-md break-words", authoritativeMine ? "bg-primary text-primary-foreground" : "bg-muted")}>
                {message.type === 'text' && <p>{message.content}</p>}
                {/* images/files/audio same as before - omitted for brevity but keep your original rendering */}
                {message.type === 'image' && (message.url && message.url.length > 0 ? <div className="grid gap-2">{message.url.map((imageUrl: string, index: number) => <img key={index} src={imageUrl} alt="Hình ảnh" className="max-w-full h-auto rounded" loading="lazy" />)}</div> : <div className="p-2 bg-muted/20 rounded text-sm">📷 Đang tải hình ảnh...</div>)}
                {/* other types... */}
              </div>

              <div className={cn("flex items-center gap-2", authoritativeMine ? "justify-end" : "justify-start")}>
                <span className="text-xs text-muted-foreground">{formatTime(message.sentAt)}</span>
                {authoritativeMine && getStatusIcon(message.id)}
                <button onClick={() => toggleLike(message.id)} className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-muted/10" title={reaction.likedByMe ? 'Bỏ thích' : 'Thích'}>{reaction.likedByMe ? <Heart className="h-4 w-4 text-red-500" /> : <Heart className="h-4 w-4 text-muted-foreground" />}<span className="text-xs">{reaction.likeCount}</span></button>
                {authoritativeMine && isLast && <span className="text-xs text-muted-foreground ml-2">{(message.receipt === 1 || (seenByMap[message.id] && seenByMap[message.id].size > 0)) ? <span className="inline-flex items-center gap-1 text-green-500">Đã xem</span> : <span className="inline-flex items-center gap-1 text-muted-foreground">Chưa xem</span>}</span>}
              </div>
            </div>
          </div>
        )
      })}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatBody
