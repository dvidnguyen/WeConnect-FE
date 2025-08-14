import { Outlet } from 'react-router-dom'
import { Sidebar } from "@/shared/components/Sidebar";
import { UserSearch } from '@/features/user/components';

const MessageLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <UserSearch />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default MessageLayout