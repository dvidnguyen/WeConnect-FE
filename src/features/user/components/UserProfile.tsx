import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Button } from "@/shared/components/ui/button"
import { useState, useEffect } from "react"
import { Pencil, Camera, Loader2 } from "lucide-react"
import { userApi } from '@/api/user.api';
import type { UserProfile } from '@/api/user.api';
import { toast } from "sonner";
interface UserProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profileData?: UserProfile | null // Nhận data từ parent component
  onProfileUpdate?: (updatedProfile: UserProfile) => void // Callback khi profile được update
}

export function UserProfileDialog({ open, onOpenChange, profileData, onProfileUpdate }: UserProfileDialogProps) {
  const [profile, setProfile] = useState<UserProfile | null>(profileData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Temporary edit state
  const [editData, setEditData] = useState({
    username: '',
    phone: '',
    birthDate: ''
  });

  // Update profile when profileData changes
  useEffect(() => {
    if (profileData) {
      setProfile(profileData);
      setEditData({
        username: profileData.username,
        phone: profileData.phone || '',
        birthDate: profileData.birthDate || ''
      });
      setError(null);
    }
  }, [profileData]);

  // Fallback: Fetch profile data if no profileData provided
  useEffect(() => {
    if (open && !profileData && !profile) {
      fetchProfile();
    }
  }, [open, profileData, profile]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userApi.getProfile();

      if (response.code === 200 && response.result) {
        setProfile(response.result);
        // Initialize edit data
        setEditData({
          username: response.result.username,
          phone: response.result.phone || '',
          birthDate: response.result.birthDate || ''
        });
        toast.success('Profile loaded successfully');
        return response.result; // Return the profile data
      } else if (response.code === 401 || response.code === 402) {
        setError(response.message || 'Unauthenticated');
        toast.error(`Authentication required: ${response.message || 'Unauthorized'}`);
      } else {
        setError(`Failed to load profile: ${response.message || 'Unknown error'}`);
        toast.error(`Failed to load profile: ${response.message || 'Unknown error'}`);
      }
    } catch {
      setError('Network error occurred');
      toast.error('Network error occurred');
    } finally {
      setLoading(false);
    }
    return null;
  };

  // Reset isEditing state when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setIsEditing(false);
      setError(null);
      // Clear profile data to ensure fresh data on next open
      setProfile(null);
    }
    onOpenChange(newOpen);
  };

  const handleSave = async () => {
    if (!profile) return;

    try {
      setLoading(true);

      // Call the update API
      const response = await userApi.updateProfile({
        username: editData.username,
        phone: editData.phone || null,
        birthDate: editData.birthDate || null
      });

      if (response.code === 200) {
        toast.success('Cập nhật profile thành công!');
        setIsEditing(false);
        // Gọi lại getProfile để lấy data mới nhất từ backend
        const updatedProfile = await fetchProfile();
        // Notify parent component about profile update
        if (updatedProfile && onProfileUpdate) {
          onProfileUpdate(updatedProfile);
        }
      } else {
        // Handle specific error codes from backend
        switch (response.code) {
          case 409: // Phone already exists (assuming this error code)
            toast.error('Số điện thoại này đã được sử dụng bởi người khác');
            break;
          case 400:
            toast.error('Dữ liệu không hợp lệ, vui lòng kiểm tra lại');
            break;
          case 401:
          case 402:
            toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
            break;
          default:
            toast.error(response.message || 'Cập nhật profile thất bại');
        }
        setError(response.message || 'Update failed');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      setError('Lỗi kết nối mạng');
      toast.error('Lỗi kết nối mạng, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      // Reset edit data to original values
      setEditData({
        username: profile.username,
        phone: profile.phone || '',
        birthDate: profile.birthDate || ''
      });
    }
    setIsEditing(false);
  };

  if (loading && !profile) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thông tin tài khoản</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Đang tải...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thông tin tài khoản</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center py-8 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchProfile} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Thử lại
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!profile) {
    return null;
  }

  const renderViewMode = () => (
    <>
      <div className="flex flex-col items-center py-4">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile.avatarUrl || undefined} />
            <AvatarFallback>
              {profile.username?.charAt(0).toUpperCase() || profile.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
        <h2 className="mt-4 text-xl font-semibold">{profile.username}</h2>
        <p className="text-sm text-gray-500">{profile.email}</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Thông tin cá nhân</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-blue-500 hover:text-blue-600 gap-2"
            >
              <Pencil className="h-4 w-4" />
              Chỉnh sửa
            </Button>
          </div>
          <div className="grid grid-cols-[100px_1fr] gap-2 text-sm p-4 rounded-lg border border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
            <span className="text-gray-500">Username</span>
            <span>{profile.username}</span>
            <span className="text-gray-500">Ngày sinh</span>
            <span>{profile.birthDate || 'Chưa cập nhật'}</span>
            <span className="text-gray-500">Điện thoại</span>
            <span>{profile.phone || 'Chưa cập nhật'}</span>
          </div>
        </div>
      </div>
    </>
  );

  const renderEditMode = () => (
    <>
      <div className="flex flex-col items-center py-4">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile.avatarUrl || undefined} />
            <AvatarFallback>
              {profile.username?.charAt(0).toUpperCase() || profile.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Camera className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        <div className="mt-4 text-xl font-semibold flex items-center gap-2">
          <input
            type="text"
            value={editData.username}
            onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
            className="border-b border-gray-300 dark:border-gray-600 bg-transparent text-center focus:outline-none focus:border-blue-500"
          />
        </div>
        <p className="text-sm text-gray-500">{profile.email}</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Thông tin cá nhân</h3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Lưu thay đổi
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-[100px_1fr] gap-2 text-sm p-4 rounded-lg border border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
            <span className="text-gray-500">Username</span>
            <input
              type="text"
              value={editData.username}
              onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
              className="border-b border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:border-blue-500"
            />
            <span className="text-gray-500">Ngày sinh</span>
            <input
              type="date"
              value={editData.birthDate}
              onChange={(e) => setEditData(prev => ({ ...prev, birthDate: e.target.value }))}
              className="border-b border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:border-blue-500"
            />
            <span className="text-gray-500">Điện thoại</span>
            <input
              type="tel"
              value={editData.phone}
              onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
              className="border-b border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thông tin tài khoản</DialogTitle>
        </DialogHeader>
        {isEditing ? renderEditMode() : renderViewMode()}
      </DialogContent>
    </Dialog>
  )
}
