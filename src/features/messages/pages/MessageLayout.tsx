import { Outlet } from 'react-router-dom'
import { Sidebar } from "@/shared/components/Sidebar"
import { UserSearch } from '@/features/user/components'

const MessageLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-0">
        {/* Search bar at top */}
        <UserSearch />
        {/* Main content area */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default MessageLayout