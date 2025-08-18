import { UserRoundSearch, UserPlus, UserCheck } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { Button } from '@/shared/components/ui/button'
import type { User } from '@/api/user.api'

interface UserCardProps {
  user: User
  onViewProfile: (userId: string) => void
  onSendFriendRequest: (userId: string) => void
}

export const UserCard = ({ user, onViewProfile, onSendFriendRequest }: UserCardProps) => {
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
        {user.isFriend ? (
          <Button
            variant='outline'
            className='h-7 px-3 py-1 text-xs'
            disabled
          >
            <UserCheck className="h-3 w-3 mr-1" />
            Friends
          </Button>
        ) : (
          <Button
            variant='outline'
            className='h-7 px-3 py-1 text-xs'
            onClick={() => onSendFriendRequest(user.userId)}
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
