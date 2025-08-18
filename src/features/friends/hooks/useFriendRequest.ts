import { useState, useCallback, useEffect } from 'react'
import { friendApi, type FriendRequest, type FriendRequestFromAPI } from '../../../api/friend.api'
import { socketService } from '../../../services/socket.service'

// Type cho NotificationResponse từ BE (copy từ socket service)
interface NotificationResponse {
  id: string;
  body: string;
  title: string;
  type: string;
  isRead: boolean;
  senderId: string;
  senderName: string;
  senderAvatarUrl?: string;
  relatedId?: string;
  createdAt: string;
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

export const useFriendRequest = () => {
  const [loading, setLoading] = useState(false)
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])

  // Lấy danh sách friend requests (define trước để useEffect có thể dùng)
  const getFriendRequests = useCallback(async (showAlert = false) => {
    setLoading(true)
    try {
      console.log('🔄 Getting friend requests...')
      const response = await friendApi.getFriendRequests()

      if (response.code === 200 && response.result) {
        // Transform API data sang UI format
        const transformedRequests = response.result.map(transformFriendRequest)
        setFriendRequests(transformedRequests)
        console.log('✅ Found', response.result.length, 'friend requests')
        // if (showAlert && response.result.length > 0) {
        //   alert(`✅ Có ${response.result.length} lời mời kết bạn!`)
        // }
        return { success: true, data: transformedRequests }
      } else {
        console.error('Failed to get friend requests:', response.message)
        if (showAlert) {
          alert(`❌ ${response.message || 'Không thể tải lời mời kết bạn'}`)
        }
        return { success: false, message: response.message }
      }
    } catch (error) {
      console.error('Error getting friend requests:', error)
      if (showAlert) {
        alert('❌ Đã xảy ra lỗi khi tải lời mời kết bạn')
      }
      return { success: false, message: 'Network error' }
    } finally {
      setLoading(false)
    }
  }, [])

  // Setup socket listeners for real-time friend requests
  useEffect(() => {
    // Handler cho khi nhận friend request mới từ BE
    const handleFriendRequest = (notificationData: NotificationResponse) => {
      console.log('🔥 Real-time friend request received:', notificationData)
      alert(`🔥 ${notificationData.senderName} gửi lời mời kết bạn: "${notificationData.body}"`)

      // Refresh friend requests để lấy data mới nhất
      getFriendRequests(false) // không alert vì đã có alert ở trên
    }

    // Handler cho khi friend request được accept
    const handleFriendAccepted = (notificationData: NotificationResponse) => {
      console.log('✅ Friend request accepted (real-time):', notificationData)
      alert(`✅ ${notificationData.senderName} đã chấp nhận lời mời kết bạn của bạn!`)
    }

    // Handler cho khi friend request bị reject  
    const handleFriendRejected = (notificationData: NotificationResponse) => {
      console.log('❌ Friend request rejected (real-time):', notificationData)
      alert(`❌ ${notificationData.senderName} đã từ chối lời mời kết bạn của bạn!`)
    }

    // Đăng ký callback với socket service
    socketService.onFriendRequest(handleFriendRequest)
    socketService.onFriendAccepted(handleFriendAccepted)
    socketService.onFriendRejected(handleFriendRejected)

    // Cleanup khi component unmount
    return () => {
      // Không cần cleanup vì socket service tự quản lý callbacks
    }
  }, [getFriendRequests])  // Gửi friend request qua HTTP API (và socket notification sẽ auto trigger)
  const sendFriendRequest = useCallback(async (userId: string, message?: string) => {
    setLoading(true)
    try {
      console.log('🚀 Sending friend request via HTTP API to:', userId, 'with message:', message)

      // Gửi qua HTTP API
      const response = await friendApi.sendFriendRequest({ to: userId })

      if (response.code === 200) {
        console.log('✅ Friend request sent successfully!')
        alert('✅ Đã gửi lời mời kết bạn thành công!')
        return { success: true }
      } else {
        console.error('❌ Failed to send friend request:', response.message)
        alert(`❌ Gửi lời mời thất bại: ${response.message}`)
        return { success: false, message: response.message }
      }
    } catch (error) {
      console.error('❌ Error sending friend request via HTTP API:', error)
      alert('❌ Đã xảy ra lỗi khi gửi lời mời kết bạn')
      return { success: false, message: 'API error' }
    } finally {
      setLoading(false)
    }
  }, [])

  // Accept friend request qua HTTP API (và socket notification sẽ auto trigger)
  const acceptFriendRequest = useCallback(async (requestId: string) => {
    setLoading(true)
    try {
      console.log('✅ Accepting friend request via HTTP API:', requestId)

      // Accept qua HTTP API
      const response = await friendApi.acceptFriendRequest(requestId)

      if (response.code === 200) {
        console.log('✅ Friend request accepted successfully!')

        // Remove from local state ngay lập tức để UX mượt mà
        setFriendRequests(prev => prev.filter(req => req.id !== requestId))

        alert('✅ Đã chấp nhận lời mời kết bạn!')
        return { success: true }
      } else {
        console.error('❌ Failed to accept friend request:', response.message)
        alert(`❌ Chấp nhận lời mời thất bại: ${response.message}`)
        return { success: false, message: response.message }
      }
    } catch (error) {
      console.error('❌ Error accepting friend request via HTTP API:', error)
      alert('❌ Đã xảy ra lỗi khi chấp nhận lời mời kết bạn')
      return { success: false, message: 'API error' }
    } finally {
      setLoading(false)
    }
  }, [])

  // Reject friend request qua HTTP API (và socket notification sẽ auto trigger) 
  const rejectFriendRequest = useCallback(async (requestId: string) => {
    setLoading(true)
    try {
      console.log('❌ Rejecting friend request via HTTP API:', requestId)

      // Reject qua HTTP API
      const response = await friendApi.rejectFriendRequest(requestId)

      if (response.code === 200) {
        console.log('✅ Friend request rejected successfully!')

        // Remove from local state ngay lập tức để UX mượt mà
        setFriendRequests(prev => prev.filter(req => req.id !== requestId))

        alert('✅ Đã từ chối lời mời kết bạn!')
        return { success: true }
      } else {
        console.error('❌ Failed to reject friend request:', response.message)
        alert(`❌ Từ chối lời mời thất bại: ${response.message}`)
        return { success: false, message: response.message }
      }
    } catch (error) {
      console.error('❌ Error rejecting friend request via HTTP API:', error)
      alert('❌ Đã xảy ra lỗi khi từ chối lời mời kết bạn')
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

export default useFriendRequest
