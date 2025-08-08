import { Outlet } from 'react-router-dom'
import { Sidebar } from "@/shared/components/Sidebar";
const FriendContactLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default FriendContactLayout