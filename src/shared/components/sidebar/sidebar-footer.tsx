import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"
import { BadgeCheckIcon } from 'lucide-react'
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
import { useState, useEffect } from "react"
import { UserProfileDialog } from "../../../features/user/components/UserProfile"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { authApi } from "@/api/auth.api"
import { userApi } from "@/api/user.api"
import type { UserProfile } from "@/api/user.api"
import { useAppDispatch } from "@/app/store/hooks"
import { logout } from "@/features/auth/slices/auth.slice"

export function SidebarFooter() {
  const [showProfile, setShowProfile] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [profileData, setProfileData] = useState<UserProfile | null>(null)
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  // Fetch profile data on component mount
  useEffect(() => {
    fetchCurrentProfile()
  }, [])

  const fetchCurrentProfile = async () => {
    try {
      const response = await userApi.getProfile()
      if (response.code === 200 && response.result) {
        setCurrentProfile(response.result)
      }
    } catch (error) {
      console.error('Failed to fetch current profile:', error)
      // Don't show error toast here, just silently fail
    }
  }

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    // Cập nhật currentProfile khi user edit profile thành công
    setCurrentProfile(updatedProfile)
  }

  const handleProfileClick = async () => {
    try {
      setIsLoadingProfile(true)

      // Debug token comparison với Postman

      // Gọi API profile ngay khi click
      const response = await userApi.getProfile();
      console.log('Profile API Response:', response); // Debug log

      await toast.promise(
        Promise.resolve(response),
        {
          loading: 'Đang tải thông tin profile...',
          success: (response) => {
            if (response.code === 200 && response.result) {
              // Lưu profile data và mở dialog
              setProfileData(response.result)
              setShowProfile(true)
              return 'Đã tải thông tin profile thành công!'
            } else if (response.code === 401 || response.code === 402) {
              throw new Error(response.message || 'Bạn cần đăng nhập lại')
            } else {
              throw new Error(`Lỗi: ${response.message || 'Không thể tải thông tin profile'}`)
            }
          },
          error: 'Lỗi khi tải thông tin profile'
        }
      )
    } catch {
      // Nếu có lỗi, vẫn mở dialog để user thấy thông báo lỗi
      setProfileData(null)
      setShowProfile(true)
    } finally {
      setIsLoadingProfile(false)
    }
  }

  const getAvatarLetters = (username: string | null): string => {
    if (!username) return 'W';

    // Lấy ký tự đầu tiên của username và chuyển thành chữ hoa
    return username.charAt(0).toUpperCase();
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
          success: () => {
            toast.success('Logged out successfully', {
              style: {
                '--normal-bg': 'var(--background)',
                '--normal-text': 'light-dark(var(--color-green-600), var(--color-green-400))',
                '--normal-border': 'light-dark(var(--color-green-600), var(--color-green-400))'
              } as React.CSSProperties
            });
            return 'Logout completed';
          },
          error: 'Failed to logout'
        }
      )
    } catch {
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
                <AvatarFallback className='text-xs'>{getAvatarLetters(currentProfile?.username || null)}</AvatarFallback>
              </Avatar>
              <span className='absolute -end-1.5 -top-1.5'>
                <span className='sr-only'>Verified</span>
                <BadgeCheckIcon className='text-background size-4 fill-sky-500' />
              </span>
            </div>
            <div className="flex flex-col items-start text-sm">
              <span className="font-medium">{currentProfile?.username || 'Loading...'}</span>
              <span className="text-xs text-gray-500">{currentProfile?.email || 'Loading...'}</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" side="top">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleProfileClick} disabled={isLoadingProfile}>
            <User className="mr-2 h-4 w-4" />
            {isLoadingProfile ? 'Đang tải...' : 'Profile'}
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
      <UserProfileDialog
        open={showProfile}
        onOpenChange={setShowProfile}
        profileData={profileData}
        onProfileUpdate={handleProfileUpdate}
      />
    </div>
  )
}
