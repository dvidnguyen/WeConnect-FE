import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"
import { BadgeCheckIcon } from 'lucide-react'
import { useAppSelector } from "@/app/store/hooks"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Button } from "@/shared/components/ui/button"
import { LogOut, Settings, User } from "lucide-react"
import { useState } from "react"
import { UserProfileDialog } from "../profile/user-profile-dialog"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { authApi } from "@/api/auth.api"
import { useAppDispatch } from "@/app/store/hooks"
import { logout } from "@/features/auth/slices/auth.slice"

export function SidebarFooter() {
  const [showProfile, setShowProfile] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { email, username } = useAppSelector(state => state.auth);

  const getAvatarLetters = (username: string | null): string => {
    if (!username) return 'U';

    // Tách username thành các từ
    const words = username.split(/[-_\s+]/).filter(word => word.length > 0);

    if (words.length >= 2) {
      // Nếu có 2 từ trở lên, lấy chữ cái đầu của 2 từ đầu tiên
      return (words[0][0] + words[1][0]).toUpperCase();
    } else {
      // Nếu chỉ có 1 từ, lấy 2 chữ cái đầu của từ đó
      return username.slice(0, 2).toUpperCase();
    }
  };
  const handleLogout = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('No authentication token found')
        navigate('/login')
        return
      }

      await toast.promise(
        async () => {
          await authApi.logout(token)
          // Clear local storage
          localStorage.removeItem('token')
          // Clear cookie with all necessary flags
          document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; max-age=0; secure'
          // Clear user data in Redux store
          dispatch(logout())
          // Redirect to login page
          navigate('/login')
        },
        {
          loading: 'Logging out...',
          success: 'Logged out successfully',
          error: 'Failed to logout'
        }
      )
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="border-t p-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarFallback className='text-xs'>{getAvatarLetters(username)}</AvatarFallback>
              </Avatar>
              <span className='absolute -end-1.5 -top-1.5'>
                <span className='sr-only'>Verified</span>
                <BadgeCheckIcon className='text-background size-4 fill-sky-500' />
              </span>
            </div>
            <div className="flex flex-col items-start text-sm">
              <span className="font-medium">{username || 'Unknown'}</span>
              <span className="text-xs text-gray-500">{email || 'm@example.com'}</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" side="top">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setShowProfile(true)}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled={isLoading} onSelect={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            {isLoading ? 'Logging out...' : 'Log out'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UserProfileDialog open={showProfile} onOpenChange={setShowProfile} />
    </div>
  )
}
