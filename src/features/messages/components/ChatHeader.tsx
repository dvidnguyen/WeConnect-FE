import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { Button } from '@/shared/components/ui/button'
import { Phone, Video, MoreVertical, Loader2, Mic, MicOff, VideoOff } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import type { Conversation } from '../../../api/conversation.api'
import CallDialog from './CallDialog'
import { useEffect, useRef, useState } from 'react'
import { callService } from '@/services/call.service'
import { userApi } from '@/api/user.api'
import { toast } from 'sonner';
interface ChatHeaderProps {
  conversation?: Conversation
  conversationId?: string
}

export const ChatHeader = ({ conversation, conversationId }: ChatHeaderProps) => {
  // loading states if conversationId exists but conversation data not ready
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

  /* ---------- UI & media states ---------- */
  const [dialogOpen, setDialogOpen] = useState(false)
  const [mode, setMode] = useState<'idle' | 'outgoing' | 'incoming' | 'in-call'>('idle')
  const [mediaKind, setMediaKind] = useState<'audio' | 'video'>('audio')
  const [peerUserId, setPeerUserId] = useState<string>('') // caller or callee id (other)
  const [callerAvatar, setCallerAvatar] = useState<string>('') // avatar of the caller (incoming)
  const [calleeAvatar, setCalleeAvatar] = useState<string>('') // avatar of the callee (outgoing)
  const [callerName, setCallerName] = useState<string>('') // display name for caller
  const [calleeName, setCalleeName] = useState<string>('') // display name for callee
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const callTimerRef = useRef<number | null>(null)

  // local / remote streams
  const [localStream, setLocalStreamState] = useState<MediaStream | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)

  // simple profile cache
  const profileCacheRef = useRef<Map<string, { avatar?: string; name?: string }>>(new Map())

  /* ---------- helpers ---------- */
  const startTimer = () => {
    stopTimer()
    setCallDuration(0)
    callTimerRef.current = window.setInterval(() => setCallDuration(prev => prev + 1), 1000)
  }
  const stopTimer = () => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current)
      callTimerRef.current = null
    }
  }

  const cleanupLocalStream = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => {
        try { t.stop() } catch (e) { }
      })
      localStreamRef.current = null
    }
    setLocalStreamState(null)
    setIsCameraOn(false)
  }

  const ensureMedia = async (kind: 'audio' | 'video') => {
    try {
      if (kind === 'video') {
        const s = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        if (isMuted) s.getAudioTracks().forEach(t => (t.enabled = false))
        localStreamRef.current = s
        setLocalStreamState(s)
        setIsCameraOn(true)
      } else {
        const s = await navigator.mediaDevices.getUserMedia({ audio: true })
        if (localStreamRef.current) localStreamRef.current.getVideoTracks().forEach(t => t.stop())
        if (isMuted) s.getAudioTracks().forEach(t => (t.enabled = false))
        localStreamRef.current = s
        setLocalStreamState(s)
        setIsCameraOn(false)
      }
    } catch (err) {
      console.error('[ChatHeader] ensureMedia error', err)
      cleanupLocalStream()
      throw err
    }
  }

  const getTargetUserIdFromConversation = (): string => {
    // Try common shapes
    const anyConv = conversation as any
    if (!anyConv) return ''
    if (Array.isArray(anyConv.participants) && anyConv.participants.length > 0) {
      // If participants include current user, ideally filter current user out. 
      // For simplicity we return first other id if it exists.
      return anyConv.participants[0]
    }
    if (Array.isArray(anyConv.members) && anyConv.members.length > 0) return anyConv.members[0]
    return anyConv.otherUserId || anyConv.participantId || anyConv.userId || ''
  }

  const fetchProfileAndCache = async (userId: string) => {
    if (!userId) return { avatar: '', name: '' }
    const cache = profileCacheRef.current
    if (cache.has(userId)) return cache.get(userId)!
    try {
      const res = await userApi.getUserProfile(userId)
      // adapt to actual result path
      const avatar = (res as any).result?.avatar || (res as any).result?.avatarUrl || ''
      const name = (res as any).result?.name || (res as any).result?.displayName || ''
      cache.set(userId, { avatar, name })
      return { avatar, name }
    } catch (e) {
      console.warn('[ChatHeader] fetchProfile failed', e)
      return { avatar: '', name: '' }
    }
  }

  /* ---------- call actions (UI triggers) ---------- */
  const startOutgoingCall = async (kind: 'audio' | 'video') => {
    if (!conversationId) {
      console.warn('[ChatHeader] cannot start call: missing conversationId')
      return
    }
    setMediaKind(kind)
    setMode('outgoing')
    setDialogOpen(true)
    setPeerUserId('')

    try {
      await ensureMedia(kind)
    } catch (e) {
      console.warn('[ChatHeader] ensureMedia failed', e)
    }

    // set local stream into service
    try {
      await callService.setLocalStream(localStreamRef.current)
    } catch (e) {
      console.warn('[ChatHeader] setLocalStream failed', e)
    }

    // fetch callee profile for dialog UX
    const targetUserId = getTargetUserIdFromConversation()
    if (targetUserId) {
      const prof = await fetchProfileAndCache(targetUserId)
      setCalleeAvatar(prof.avatar || conversation?.avatar || '')
      setCalleeName(prof.name || conversation?.name || '')
    } else {
      setCalleeAvatar(conversation?.avatar || '')
      setCalleeName(conversation?.name || '')
    }

    // start call as caller (service will create pc when accepted or when you choose to)
    try {
      await callService.startCallAsCaller(conversationId, targetUserId, localStreamRef.current, kind)
    } catch (e) {
      console.warn('[ChatHeader] startCallAsCaller error', e)
    }

    // signal invite
    callService.inviteCall(conversationId, kind)
  }

  const handleAcceptCall = async () => {
    if (!conversationId) {
      console.warn('[ChatHeader] acceptCall missing conversationId')
      setDialogOpen(false)
      setMode('idle')
      return
    }

    // prepare media so our answer includes tracks
    try {
      if (mediaKind === 'video') await ensureMedia('video')
      else await ensureMedia('audio')
    } catch (e) {
      console.warn('[ChatHeader] ensureMedia on accept failed, trying audio fallback', e)
      try { await ensureMedia('audio') } catch (_) { }
    }

    // set local stream to callService
    await callService.setLocalStream(localStreamRef.current)

    // register as callee (so handleRemoteOffer will attach tracks)
    try {
      await callService.startCallAsCallee(conversationId, peerUserId || getTargetUserIdFromConversation(), localStreamRef.current)
    } catch (e) {
      console.warn('[ChatHeader] startCallAsCallee error', e)
    }

    // fetch caller profile for better UX
    if (peerUserId) {
      const prof = await fetchProfileAndCache(peerUserId)
      setCallerAvatar(prof.avatar || '')
      setCallerName(prof.name || '')
    }

    // send accept signal to server (server should forward to caller)
    callService.acceptCall(conversationId)

    setMode('in-call')
    startTimer()
    setDialogOpen(true)
  }

  const handleRejectCall = () => {
    if (conversationId) callService.rejectCall(conversationId)
    setDialogOpen(false)
    setMode('idle')
    stopTimer()
    cleanupLocalStream()
    callService.setLocalStream(null).catch(() => { })
  }

  const handleCancelOutgoing = () => {
    if (conversationId) callService.endCall(conversationId)
    setDialogOpen(false)
    setMode('idle')
    stopTimer()
    cleanupLocalStream()
    callService.setLocalStream(null).catch(() => { })
  }

  const handleEndCall = () => {
    if (conversationId) callService.endCall(conversationId)
    setDialogOpen(false)
    setMode('idle')
    stopTimer()
    cleanupLocalStream()
    callService.setLocalStream(null).catch(() => { })
    setRemoteStream(null)
    callService.onRemoteStream(() => { }) // detach
  }

  const toggleMute = () => {
    setIsMuted(prev => {
      const next = !prev
      if (localStreamRef.current) localStreamRef.current.getAudioTracks().forEach(t => (t.enabled = !next ? true : false))
      return next
    })
  }

  const toggleCamera = async () => {
    const s = localStreamRef.current
    if (s && s.getVideoTracks().length > 0) {
      const enabledNow = s.getVideoTracks()[0].enabled
      s.getVideoTracks().forEach(t => (t.enabled = !enabledNow))
      setIsCameraOn(!enabledNow)
    } else {
      try {
        await ensureMedia('video')
        await callService.setLocalStream(localStreamRef.current)
        setIsCameraOn(true)
      } catch (e) {
        console.warn('[ChatHeader] toggleCamera failed', e)
      }
    }
  }

  /* ---------- signaling listeners ---------- */
  useEffect(() => {
    // incoming ring
    const onRing = async (data: { conversationId: string; fromUserId: string; media: string }) => {
      console.log('[ChatHeader] onRing received ->', data)
      if (conversationId && data.conversationId !== conversationId) return
      setMediaKind(data.media === 'video' ? 'video' : 'audio')
      setPeerUserId(data.fromUserId)
      setMode('incoming')
      setDialogOpen(true)

      // fetch caller profile
      if (data.fromUserId) {
        const prof = await fetchProfileAndCache(data.fromUserId)
        setCallerAvatar(prof.avatar || '')
        setCallerName(prof.name || 'Người gọi')
      }
    }
    callService.onCallRing(onRing)

    // remote accepted our outgoing invite (caller sees accepted)
    const onAccepted = async (data: { conversationId: string; userId: string }) => {
      console.log('[ChatHeader] call accepted ->', data)
      if (conversationId && data.conversationId !== conversationId) return
      setMode('in-call')
      setDialogOpen(true)
      setPeerUserId(data.userId)
      startTimer()

      // fetch profile of peer
      if (data.userId) {
        const prof = await fetchProfileAndCache(data.userId)
        setCalleeAvatar(prof.avatar || '')
        setCalleeName(prof.name || '')
      }
    }
    callService.onCallAccepted(onAccepted)

    const onRejected = (data: { conversationId: string; userId: string }) => {
      console.log('[ChatHeader] call rejected ->', data)
      if (conversationId && data.conversationId !== conversationId) return
      setMode('idle')
      setDialogOpen(false)
      stopTimer()
      cleanupLocalStream()
      callService.setLocalStream(null).catch(() => { })
      try { toast.error('Cuộc gọi bị từ chối') } catch (e) { }
    }
    callService.onCallRejected(onRejected)

    const onEnded = (data: { conversationId: string; userId: string }) => {
      console.log('[ChatHeader] call ended ->', data)
      if (conversationId && data.conversationId !== conversationId) return
      setMode('idle')
      setDialogOpen(false)
      stopTimer()
      cleanupLocalStream()
      setRemoteStream(null)
      callService.setLocalStream(null).catch(() => { })
      try { toast.error('Cuộc gọi đã kết thúc') } catch (e) { }
    }
    callService.onCallEnded(onEnded)

    // subscribe remote stream callback
    callService.onRemoteStream((s) => {
      console.log('[ChatHeader] remote stream updated', s)
      setRemoteStream(s || null)
    })

    return () => {
      callService.offCallRing()
      callService.offCallAccepted()
      callService.offCallRejected()
      callService.offCallEnded()
      callService.offWebRTCOffer()
      callService.offWebRTCAnswer()
      callService.offWebRTCCandidate()
      callService.onRemoteStream(() => { }) // detach
      stopTimer()
      cleanupLocalStream()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId])

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
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={() => startOutgoingCall('audio')}>
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={() => startOutgoingCall('video')}>
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

      {/* Unified CallDialog for incoming/outgoing/in-call */}
      <CallDialog
        open={dialogOpen}
        mode={mode}
        media={mediaKind}
        callerName={callerName || (mode === 'incoming' ? peerUserId : '')}
        callerAvatar={callerAvatar}
        calleeName={calleeName || conversation?.name}
        calleeAvatar={calleeAvatar || conversation?.avatar || ''}
        onAccept={handleAcceptCall}
        onReject={handleRejectCall}
        onCancelOutgoing={handleCancelOutgoing}
        onEndCall={handleEndCall}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onToggleCamera={toggleCamera}
        isCameraOn={isCameraOn}
        localStream={localStream}
        remoteStream={remoteStream}
        callDuration={callDuration}
      />
    </div>
  )
}

export default ChatHeader
