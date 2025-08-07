import { Outlet } from 'react-router-dom'
import { Sidebar } from "@/shared/components/Sidebar";
const FriendRequestLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default FriendRequestLayout