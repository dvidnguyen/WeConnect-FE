import { useParams, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { OtherUserProfileDialog } from '../components/OtherUserProfileDialog'
import type { OtherUserProfile } from '@/api/user.api'

export const UserProfilePage = () => {
  const { userId } = useParams<{ userId: string }>()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(true)

  // Get profile data from navigation state if available
  const profileData = location.state?.profileData as OtherUserProfile | undefined

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
  }

  return (
    <div>
      <OtherUserProfileDialog
        open={isOpen}
        onOpenChange={handleOpenChange}
        userId={userId}
        profileData={profileData}
        shouldNavigateOnClose={true}
      />
    </div>
  )
}

export default UserProfilePage
