import { MessageCircle, Users } from "lucide-react"
import { NavLink } from "react-router-dom"

export function AppSidebar() {
  return (
    <nav className="space-y-2 px-4">
      <NavLink
        to="/messages"
        className={({ isActive }) =>
          `flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${isActive ? "bg-gray-100 dark:bg-gray-800" : ""
          }`
        }
      >
        <MessageCircle className="h-5 w-5" />
        Messages
      </NavLink>
      <NavLink
        to="/friends"
        className={({ isActive }) =>
          `flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${isActive ? "bg-gray-100 dark:bg-gray-800" : ""
          }`
        }
      >
        <Users className="h-5 w-5" />
        Friends
      </NavLink>
    </nav>
  )
}
