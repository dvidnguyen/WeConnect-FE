import { Sheet, SheetContent, SheetTrigger } from "@/shared/components/ui/sheet"
import { Button } from "@/shared/components/ui/button"
import { Menu } from "lucide-react"
import { SidebarHeader } from "./sidebar/sidebar-header"
import { SidebarContent } from "./sidebar/sidebar-content"
import { SidebarFooter } from "./sidebar/sidebar-footer"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] p-0">
          <div className="flex h-full flex-col">
            <SidebarHeader />
            <SidebarContent />
            <SidebarFooter />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden w-[300px] flex-col border-r md:flex">
        <SidebarHeader />
        <SidebarContent />
        <SidebarFooter />
      </div>
    </>
  )
}
