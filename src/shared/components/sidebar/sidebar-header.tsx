import { ModeToggle } from "../Mode-toggle"
import { ChartNetwork } from 'lucide-react';
export function SidebarHeader() {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
          <ChartNetwork />
        </div>
        <span className="text-xl font-semibold">WeConnect</span>
      </div>
      <ModeToggle />
    </div>
  )
}
