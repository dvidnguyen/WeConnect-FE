import { Outlet } from 'react-router-dom'
import { Sidebar } from "@/shared/components/Sidebar";
import SearchLSidebar from '@/shared/components/SearchLSidebar';
import Notification from '@/features/notification/pages/Notification';
const FriendRequestLayout = () => {
  return (
    <div className="relative min-h-screen">
      <div className="flex min-h-screen">
        <Sidebar />
        <SearchLSidebar />
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
      {/* Fixed notification at top-right corner */}
      <div className="fixed top-4 right-4 z-50">
        <Notification />
      </div>
    </div>
  )
}

export default FriendRequestLayout