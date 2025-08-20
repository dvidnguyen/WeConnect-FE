import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Button } from "@/shared/components/ui/button"
import { useState, useEffect } from "react"
import { UserPlus, MessageCircle, Loader2, UserCheck, UserX, Clock } from "lucide-react"
import { userApi } from '@/api/user.api'
import type { OtherUserProfile } from '@/api/user.api'
import { useNavigate } from "react-router-dom"
import { useFriendRequest } from '../../friends/hooks/useFriendRequest.tsx'
import { useConversations } from '../../messages/hook/useConversations'
import { toast } from 'sonner'

interface OtherUserProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId?: string // ID của user cần hiển thị profile
  profileData?: OtherUserProfile | null // Có thể nhận sẵn data từ parent
  shouldNavigateOnClose?: boolean // Có navigate khi đóng dialog không
}

export function OtherUserProfileDialog({
  open,
  onOpenChange,
  userId,
  profileData,
  shouldNavigateOnClose = false
}: OtherUserProfileDialogProps) {
  const [profile, setProfile] = useState<OtherUserProfile | null>(profileData || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [requestSent, setRequestSent] = useState(false)
  const navigate = useNavigate()

  // Friend request hook
  const { sendFriendRequest, loading: friendRequestLoading } = useFriendRequest()

  // Conversations hook
  const { createDirectConversation } = useConversations()

  // Fetch profile data when dialog opens and userId is provided
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return

      try {
        setLoading(true)
        setError(null)
        const response = await userApi.getUserProfile(userId)

        if (response.code === 200 && response.result) {
          setProfile(response.result)
        } else {
          setError(response.message || 'Failed to load user profile')
          alert(`❌ ${response.message || 'Failed to load user profile'}`)
        }
      } catch {
        setError('Network error occurred')
        alert('❌ Network error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (open && userId && !profileData) {
      fetchProfile()
    } else if (profileData) {
      setProfile(profileData)
      setError(null)
    }
  }, [open, userId, profileData])

  const refetchProfile = async () => {
    if (!userId) return

    try {
      setLoading(true)
      setError(null)
      const response = await userApi.getUserProfile(userId)

      if (response.code === 200 && response.result) {
        setProfile(response.result)
      } else {
        setError(response.message || 'Failed to load user profile')
        alert(`❌ ${response.message || 'Failed to load user profile'}`)
      }
    } catch {
      setError('Network error occurred')
      alert('❌ Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Reset state when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setError(null)
      if (!profileData) {
        // Only clear profile if it wasn't passed from parent
        setProfile(null)
      }

      // Navigate back nếu cần thiết (chỉ khi được gọi từ route page)
      if (shouldNavigateOnClose) {
        setTimeout(() => {
          navigate(-1)
        }, 100)
      }
    }
    onOpenChange(newOpen)
  }

  const handleSendFriendRequest = async () => {
    if (!profile) return

    const result = await sendFriendRequest(
      profile.userId,
      `Xin chào ${profile.username}! Hãy kết bạn với tôi nhé!`
    )

    if (result.success) {
      // Update local state to show request sent
      setRequestSent(true)
    }
  }

  const handleSendMessage = async () => {
    if (!profile) return

    try {
      console.log('🔄 Creating conversation with user:', profile.userId);
      const conversation = await createDirectConversation(profile.userId);

      if (conversation) {
        console.log('✅ Conversation created, navigating to messages...');
        toast.success('Đã tạo cuộc trò chuyện!');
      } else {
        console.log('ℹ️ Conversation already exists or error occurred');
        // Vẫn navigate vì conversation có thể đã tồn tại
      }

      // Navigate to messages page với user info
      navigate('/messages', {
        state: {
          targetUser: {
            userId: profile.userId,
            username: profile.username,
            email: profile.email,
            avatarUrl: profile.avatarUrl
          }
        }
      })

      // Chỉ đóng dialog, không trigger navigation back
      onOpenChange(false)
    } catch (error) {
      console.error('❌ Error creating conversation:', error);
      toast.error('Không thể tạo cuộc trò chuyện');
    }
  }

  const getRelationshipStatus = () => {
    if (!profile) return null

    if (profile.blocked) {
      return (
        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
          <UserX className="h-4 w-4 text-red-500" />
          <span className="text-sm text-red-700 dark:text-red-400">Đã chặn</span>
        </div>
      )
    }

    if (profile.friend) {
      return (
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md">
          <UserCheck className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-700 dark:text-green-400">Đã kết bạn</span>
        </div>
      )
    }

    if (requestSent) {
      return (
        <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-md">
          <Clock className="h-4 w-4 text-orange-500" />
          <span className="text-sm text-orange-700 dark:text-orange-400">Đã gửi lời mời</span>
        </div>
      )
    }

    return null
  }

  if (loading && !profile) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thông tin người dùng</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Đang tải...</span>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (error) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thông tin người dùng</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center py-8 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={refetchProfile} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Thử lại
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thông tin người dùng</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-4">
          {/* Avatar */}
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile.avatarUrl} alt={profile.username} />
            <AvatarFallback className="text-xl">
              {profile.username?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>

          {/* User Info */}
          <h2 className="mt-4 text-xl font-semibold">{profile.username}</h2>
          <p className="text-sm text-gray-500">{profile.email}</p>

          {/* Relationship Status */}
          <div className="mt-3">
            {getRelationshipStatus()}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          {!profile.blocked && (
            <>
              {/* Friend Request Button */}
              {!profile.friend && !requestSent && (
                <Button
                  onClick={handleSendFriendRequest}
                  disabled={friendRequestLoading}
                  className="flex-1"
                  variant="default"
                >
                  {friendRequestLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <UserPlus className="h-4 w-4 mr-2" />
                  )}
                  Kết bạn
                </Button>
              )}

              {/* Message Button */}
              <Button
                onClick={handleSendMessage}
                variant="outline"
                className={profile.friend ? "flex-1" : "flex-1"}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Nhắn tin
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default OtherUserProfileDialog
