import { SignUpForm } from "../components/SignUpForm"
import { ModeToggle } from "@/shared/components/Mode-toggle"
import Threads from '../../../../LOGINPAGE.TSX/Threads/Threads';
import { ChartNetwork } from 'lucide-react';

export default function SignUpPage() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background with Threads effect */}
      <div className="fixed inset-0 z-0">
        <Threads
          amplitude={2}
          distance={0.5}
          enableMouseInteraction={true}
          color={[0.4, 0.8, 1]} // Light blue color
        />
      </div>

      {/* Mode Toggle */}
      <div className="absolute right-1 top-1 sm:right-2 sm:top-2 md:right-4 md:top-4 z-50">
        <ModeToggle />
      </div>

      {/* Main Content */}
      <div className="relative flex h-full items-center justify-center p-1 sm:p-2 md:p-4 z-10">
        <div className="w-full max-w-sm sm:max-w-md backdrop-blur-md bg-background/30 rounded-xl shadow-2xl p-2 sm:p-4 md:p-6 max-h-[98vh] overflow-y-auto">
          {/* Logo - Compact on mobile */}
          <div className="text-center mb-2 sm:mb-4">
            <a href="#" className="inline-flex items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-4 py-1 sm:py-2 font-medium">
              <div className="bg-primary text-primary-foreground flex size-8 sm:size-10 md:size-12 items-center justify-center rounded-md">
                <ChartNetwork className="size-5 sm:size-6 md:size-8" />
              </div>
              <span className="text-lg sm:text-2xl md:text-3xl font-bold">WeConnect</span>
            </a>
          </div>
          <SignUpForm />
        </div>
      </div>
    </div>
  )
}