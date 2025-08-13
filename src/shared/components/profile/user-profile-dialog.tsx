import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ProfileUser"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Button } from "@/shared/components/ui/button"
import { useState } from "react"
import { Pencil, Camera } from "lucide-react"

interface UserProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface UserInfo {
  name: string
  avatar: string
  gender: string
  birthday: string
  phone: string
}

// Mock data - replace with real data later
const userInfo: UserInfo = {
  name: "Văn Thành",
  avatar: "https://github.com/shadcn.png",
  gender: "Nam",
  birthday: "10 tháng 11, 2005",
  phone: "+84 899 501 067"
}

export function UserProfileDialog({ open, onOpenChange }: UserProfileDialogProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Reset isEditing state when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setIsEditing(false);
    }
    onOpenChange(newOpen);
  };

  const renderViewMode = () => (
    <>
      <div className="flex flex-col items-center py-4">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src={userInfo.avatar} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <h2 className="mt-4 text-xl font-semibold">{userInfo.name}</h2>
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
            <span className="text-gray-500">Giới tính</span>
            <span>{userInfo.gender}</span>
            <span className="text-gray-500">Ngày sinh</span>
            <span>{userInfo.birthday}</span>
            <span className="text-gray-500">Điện thoại</span>
            <span>{userInfo.phone}</span>
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
            <AvatarImage src={userInfo.avatar} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Camera className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        <div className="mt-4 text-xl font-semibold flex items-center gap-2">
          <input
            type="text"
            value={userInfo.name}
            className="border-b border-gray-300 dark:border-gray-600 bg-transparent text-center focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Thông tin cá nhân</h3>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Hủy
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Lưu thay đổi
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-[100px_1fr] gap-2 text-sm p-4 rounded-lg border border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
            <span className="text-gray-500">Giới tính</span>
            <select
              value={userInfo.gender}
              onChange={(e) => console.log(e.target.value)}
              className="border-b border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:border-blue-500"
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
            <span className="text-gray-500">Ngày sinh</span>
            <input
              type="text"
              value={userInfo.birthday}
              className="border-b border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:border-blue-500"
            />
            <span className="text-gray-500">Điện thoại</span>
            <input
              type="text"
              value={userInfo.phone}
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
