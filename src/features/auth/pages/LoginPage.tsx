import { LoginForm } from "../components/LoginForm"
import { ModeToggle } from "@/shared/components/Mode-toggle"
import { ChartNetwork } from 'lucide-react';
import Threads from '../../../../LOGINPAGE.TSX/Threads/Threads';

export default function LoginPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background with Threads effect */}
      <div className="fixed inset-0 z-0">
        <Threads
          amplitude={1.3}
          distance={0.8}
          enableMouseInteraction={false}
          color={[0.4, 0.8, 1]} // Light blue color
        />
      </div>

      {/* Mode Toggle */}
      <div className="absolute right-1 top-1 sm:right-2 sm:top-2 md:right-4 md:top-4 cursor-pointer z-50">
        <ModeToggle />
      </div>

      {/* Main Content */}
      <div className="relative flex min-h-screen flex-col items-center justify-center px-1 sm:px-2 md:px-4 z-10">
        <div className="w-full max-w-sm sm:max-w-md backdrop-blur-md bg-background/30 p-2 sm:p-4 md:p-6 rounded-xl shadow-2xl">
          {/* Logo - Compact on mobile */}
          <div className="text-center mb-2 sm:mb-4 md:mb-6">
            <a href="#" className="inline-flex items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-4 py-1 sm:py-2 font-medium">
              <div className="bg-primary text-primary-foreground flex size-8 sm:size-10 md:size-12 items-center justify-center rounded-md">
                <ChartNetwork className="size-5 sm:size-6 md:size-8" />
              </div>
              <span className="text-lg sm:text-2xl md:text-3xl font-bold">WeConnect</span>
            </a>
          </div>

          {/* Form */}
          <LoginForm />
        </div>
      </div>
    </div>
  )
}