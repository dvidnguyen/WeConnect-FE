import { UserRoundSearch, UserPlus, UserCheck, Clock } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { Button } from '@/shared/components/ui/button'
import type { User } from '@/api/user.api'
import { useFriendRequest } from '../../friends/hooks/useFriendRequest.tsx'
import { useState, useEffect } from 'react'

interface UserCardProps {
  user: User
  onViewProfile: (userId: string) => void
}

export const UserCard = ({ user, onViewProfile }: UserCardProps) => {
  const { sendFriendRequest, friendRequests } = useFriendRequest()
  const [requestSent, setRequestSent] = useState(false)
  // Check both isFriend and friend fields from API response
  const [isFriend, setIsFriend] = useState(user.isFriend || user.friend || false)

  // Debug log to check user data
  // console.log('UserCard user data:', { userId: user.userId, isFriend: user.isFriend, friend: user.friend, final: user.isFriend || user.friend || false })

  // Listen for friend request updates
  useEffect(() => {
    // Check if this user is now a friend based on friend requests updates
    const isNowFriend = friendRequests.some(req =>
      req.from.userId === user.userId && req.status === 'accepted'
    )

    if (isNowFriend) {
      setIsFriend(true)
      setRequestSent(false)
    }
  }, [friendRequests, user.userId])

  // Reset states when user prop changes
  useEffect(() => {
    setIsFriend(user.isFriend || user.friend || false)
    setRequestSent(false)
  }, [user.isFriend, user.friend, user.userId])

  const handleSendFriendRequest = async () => {
    const result = await sendFriendRequest(user.userId, 'Xin chào! Hãy kết bạn với tôi nhé!')

    if (result?.success) {
      setRequestSent(true)
    }
  }
  return (
    <li className='flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors cursor-pointer'>
      <Avatar className='size-8'>
        <AvatarImage src={user.avatarUrl} alt={user.username} />
        <AvatarFallback className='text-xs'>
          {user.username?.charAt(0)?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className='flex-1 min-w-0'>
        <div className='text-sm font-medium truncate'>{user.username}</div>
        <div className='text-xs text-muted-foreground truncate'>{user.email}</div>
        {user.phoneNumber && (
          <div className='text-xs text-muted-foreground truncate'>{user.phoneNumber}</div>
        )}
      </div>
      <div className='flex items-center gap-2'>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewProfile(user.userId)}
          className="h-8 w-8 p-0"
        >
          <UserRoundSearch className="h-4 w-4" />
        </Button>
        {isFriend ? (
          <Button
            variant='outline'
            className='h-7 px-3 py-1 text-xs border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-800 dark:bg-green-950/20 dark:text-green-400'
            disabled
          >
            <UserCheck className="h-3 w-3 mr-1" />
           
          </Button>
        ) : requestSent ? (
          <Button
            variant='outline'
            className='h-7 px-3 py-1 text-xs border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-950/20 dark:text-orange-400'
            disabled
          >
            <Clock className="h-3 w-3 mr-1" />
            Sent
          </Button>
        ) : (
          <Button
            variant='outline'
            className='h-7 px-3 py-1 text-xs'
            onClick={handleSendFriendRequest}
          >
            <UserPlus className="h-3 w-3 mr-1" />
            Add
          </Button>
        )}
      </div>
    </li>
  )
}

export default UserCard
