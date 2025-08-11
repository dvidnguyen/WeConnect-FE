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
      <div className="absolute right-2 top-2 sm:right-4 sm:top-4 md:right-8 md:top-8 z-50">
        <ModeToggle />
      </div>

      {/* Main Content */}
      <div className="relative flex h-full items-center justify-center p-4 z-10">
        <div className="w-[90%] md:w-[85%] lg:w-[75%] max-w-3xl mx-auto backdrop-blur-md bg-background/30 rounded-xl shadow-2xl p-4 md:p-8 max-h-[95vh] overflow-y-auto space-y-8">
          {/* Logo */}
          <div className="text-center">
            <a href="#" className="inline-flex items-center gap-3 rounded-lg px-4 py-2 font-medium">
              <div className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-md">
                <ChartNetwork className="size-8" />
              </div>
              <span className="text-3xl font-bold">WeConnect</span>
            </a>
          </div>
          <SignUpForm />
        </div>
      </div>
    </div>
  )
}