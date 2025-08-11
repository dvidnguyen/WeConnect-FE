import { Outlet } from 'react-router-dom'
import { Sidebar } from "@/shared/components/Sidebar";
import SearchLSidebar from '@/shared/components/SearchLSidebar';

const MessageLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <SearchLSidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default MessageLayout