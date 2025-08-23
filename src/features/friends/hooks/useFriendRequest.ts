import { useState, useCallback, useEffect } from 'react'
import { friendApi, type FriendRequest, type FriendRequestFromAPI } from '../../../api/friend.api'
import { useSocket } from '../../../app/hooks/useSocket'
import { useConversations } from '../../messages/hook/useConversations'
import { toast } from 'sonner'

// Type cho NotificationResponse từ BE
interface NotificationResponse {
  id: string
  body: string
  title: string
  type: string
  isRead: boolean
  senderId: string
  senderName: string
  senderAvatarUrl?: string
  relatedId?: string
  createdAt: string
}

// Transform API response sang UI format
const transformFriendRequest = (apiData: FriendRequestFromAPI): FriendRequest => {
  return {
    id: apiData.id,
    from: {
      userId: apiData.requesterId,
      username: apiData.requesterName,
      email: undefined,
      avatar: undefined
    },
    to: {
      userId: '', // Không có trong API response
      username: '',
      email: undefined
    },
    body: '', // Không có trong API response, sẽ lấy từ socket notification
    status: 'pending',
    createdAt: apiData.sentAt,
    updatedAt: apiData.sentAt
  }
}

export function useFriendRequest() {
  const socket = useSocket()
  const { createDirectConversation } = useConversations()
  const [loading, setLoading] = useState(false)
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])

  // Lấy danh sách friend requests
  const getFriendRequests = useCallback(async (showAlert = false) => {
    setLoading(true)
    try {
      console.log('🔄 Getting friend requests...')
      const response = await friendApi.getFriendRequests()

      if (response.code === 200 && response.result) {
        const transformedRequests = response.result.map(transformFriendRequest)
        setFriendRequests(transformedRequests)
        console.log('✅ Found', response.result.length, 'friend requests')

        return { success: true, data: transformedRequests }
      } else {
        console.error('Failed to get friend requests:', response.message)
        if (showAlert) {
          toast.error(response.message || 'Không thể tải lời mời kết bạn')
        }
        return { success: false, message: response.message }
      }
    } catch (error) {
      console.error('Error getting friend requests:', error)
      if (showAlert) {
        toast.error('Đã xảy ra lỗi khi tải lời mời kết bạn')
      }
      return { success: false, message: 'Network error' }
    } finally {
      setLoading(false)
    }
  }, [])

  // Xử lý real-time friend requests
  useEffect(() => {
    const handleFriendRequest = (notificationData: NotificationResponse) => {

      toast.info(`${notificationData.senderName} muốn kết bạn với bạn`, {
        duration: 4000,
        dismissible: true,
        position: 'top-right'
      })

      getFriendRequests(false)
    }

    const handleFriendAccepted = (notificationData: NotificationResponse) => {
      console.log('✅ Friend request accepted (real-time):', notificationData)

      toast.success(`${notificationData.senderName} đã chấp nhận lời mời kết bạn`, {
        duration: 3000,
        dismissible: true,
        position: 'top-right'
      })
    }

    const handleFriendRejected = (notificationData: NotificationResponse) => {
      console.log('❌ Friend request rejected (real-time):', notificationData)

      toast.warning(`${notificationData.senderName} đã từ chối lời mời kết bạn`, {
        duration: 3000,
        dismissible: true,
        position: 'top-right'
      })
    }

    socket.onFriendRequestReceived(handleFriendRequest)
    socket.onFriendRequestAccepted(handleFriendAccepted)
    socket.onFriendRequestRejected(handleFriendRejected)

    return () => {
      socket.removeAllListeners('friend')
      socket.removeAllListeners('friend-accepted')
      socket.removeAllListeners('friend-rejected')
    }
  }, [socket, getFriendRequests])

  // Gửi friend request
  const sendFriendRequest = useCallback(async (userId: string, message?: string) => {
    setLoading(true)
    try {
      console.log('🚀 Sending friend request to:', userId, 'with message:', message)
      const response = await friendApi.sendFriendRequest({ to: userId })

      if (response.code === 200) {
        console.log('✅ Friend request sent successfully!')
        socket.sendFriendRequest(userId, message)

        toast.success('Đã gửi lời mời kết bạn thành công!', {
          duration: 3000,
          dismissible: true,
          position: 'top-right'
        })
        return { success: true }
      } else {
        console.error('❌ Failed to send friend request:', response.message)
        toast.error(`Gửi lời mời thất bại: ${response.message}`)
        return { success: false, message: response.message }
      }
    } catch (error) {
      console.error('❌ Error sending friend request:', error)
      toast.error('Đã xảy ra lỗi khi gửi lời mời kết bạn')
      return { success: false, message: 'API error' }
    } finally {
      setLoading(false)
    }
  }, [socket])

  // Chấp nhận friend request
  const acceptFriendRequest = useCallback(async (requestId: string) => {
    setLoading(true)
    try {
      console.log('✅ Accepting friend request:', requestId)

      // Tìm friend request để lấy userId của người gửi
      const friendRequest = friendRequests.find(req => req.id === requestId)
      if (!friendRequest) {
        console.error('❌ Friend request not found:', requestId)
        toast.error('Không tìm thấy lời mời kết bạn')
        return { success: false, message: 'Friend request not found' }
      }

      const response = await friendApi.acceptFriendRequest(requestId)

      if (response.code === 200) {
        console.log('✅ Friend request accepted successfully!')

        // Xóa friend request khỏi danh sách
        setFriendRequests(prev => prev.filter(req => req.id !== requestId))

        // Tạo conversation với người bạn mới
        console.log('🔄 Creating conversation with user:', friendRequest.from.userId)
        try {
          await createDirectConversation(friendRequest.from.userId)
          console.log('✅ Conversation created successfully!')
        } catch (conversationError) {
          console.error('❌ Failed to create conversation:', conversationError)
          // Không show error toast cho conversation vì không ảnh hưởng đến việc kết bạn
        }

        toast.success('Đã chấp nhận lời mời kết bạn!', {
          duration: 3000,
          dismissible: true,
          position: 'top-right'
        })
        return { success: true }
      } else {
        console.error('❌ Failed to accept friend request:', response.message)
        toast.error(`Chấp nhận lời mời thất bại: ${response.message}`)
        return { success: false, message: response.message }
      }
    } catch (error) {
      console.error('❌ Error accepting friend request:', error)
      toast.error('Đã xảy ra lỗi khi chấp nhận lời mời kết bạn')
      return { success: false, message: 'API error' }
    } finally {
      setLoading(false)
    }
  }, [friendRequests, createDirectConversation])

  // Từ chối friend request
  const rejectFriendRequest = useCallback(async (requestId: string) => {
    setLoading(true)
    try {
      console.log('❌ Rejecting friend request:', requestId)
      const response = await friendApi.rejectFriendRequest(requestId)

      if (response.code === 200) {
        setFriendRequests(prev => prev.filter(req => req.id !== requestId))

        toast.success('Đã từ chối lời mời kết bạn!', {
          duration: 3000,
          dismissible: true,
          position: 'top-right'
        })
        return { success: true }
      } else {
        console.error('❌ Failed to reject friend request:', response.message)
        toast.error(`Từ chối lời mời thất bại: ${response.message}`)
        return { success: false, message: response.message }
      }
    } catch (error) {
      console.error('❌ Error rejecting friend request:', error)
      toast.error('Đã xảy ra lỗi khi từ chối lời mời kết bạn')
      return { success: false, message: 'API error' }
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    friendRequests,
    sendFriendRequest,
    getFriendRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    setFriendRequests
  }
}