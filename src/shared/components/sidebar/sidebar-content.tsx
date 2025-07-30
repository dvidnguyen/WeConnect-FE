import { MessageCircle, Users, UserPlus } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible"
import { NavLink } from "react-router-dom"
import { cn } from "@/shared/utils/cn.utils"

const navItems = [
  {
    title: "Messages",
    icon: MessageCircle,
    href: "/messages",
  },
  {
    title: "Friends",
    icon: Users,
    href: "/friends",
    children: [
      {
        title: "Contacts",
        href: "/friends/contacts",
        icon: Users,
      },
      {
        title: "Requests",
        href: "/friends/requests",
        icon: UserPlus,
      },
    ],
  },
]

export function SidebarContent() {
  return (
    <div className="flex-1 overflow-auto">
      <nav className="space-y-1 p-4">
        {navItems.map((item) => (
          item.children ? (
            <Collapsible key={item.href}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-4 space-y-1">
                {item.children.map((child) => (
                  <NavLink
                    key={child.href}
                    to={child.href}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                        isActive && "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50"
                      )
                    }
                  >
                    <child.icon className="h-4 w-4" />
                    {child.title}
                  </NavLink>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                  isActive && "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </NavLink>
          )
        ))}
      </nav>
    </div>
  )
}
