import { useEffect, useId, useState } from 'react'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/shared/components/ui/input-otp'
import { ModeToggle } from '@/shared/components/Mode-toggle'
import Threads from '../../../../LOGINPAGE.TSX/Threads/Threads'
import { ChartNetwork } from 'lucide-react';

interface CodeOtpFormProps {
  email?: string;
}

const CodeOtpForm = ({ email = "william@example.com" }: CodeOtpFormProps) => {
  const [timeLeft, setTimeLeft] = useState(300)
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const id = useId()

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60

    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleVerifyOtp = async (otpValue: string) => {
    try {
      setIsLoading(true)
      // Gọi API verify OTP 
      console.log('Verifying OTP:', otpValue, 'for email:', email)

      // Mô phỏng call API
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Sau khi verify thành công, bạn có thể:
      // 1. Redirect user
      // 2. Show success message
      // 3. Update user state
      console.log('OTP verified successfully')

    } catch (error) {
      console.error('Failed to verify OTP:', error)
      // Xử lý error ở đây
    } finally {
      setIsLoading(false)
    }
  }

  const handleComplete = (value: string) => {
    setOtp(value)
    handleVerifyOtp(value)
  }

  const handleResend = async () => {
    try {
      setIsLoading(true)
      // Gọi API resend OTP ở đây
      console.log('Resending OTP to:', email)

      // Mô phỏng call API
      await new Promise(resolve => setTimeout(resolve, 1000))

      setTimeLeft(60)
      console.log('OTP resent successfully')

    } catch (error) {
      console.error('Failed to resend OTP:', error)
      // Xử lý error ở đây
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-svh">
      {/* Background with Threads effect */}
      <div className="fixed inset-0 z-0">
        <Threads
          amplitude={2}
          distance={0.5}
          enableMouseInteraction={false}
          color={[0.4, 0.8, 1]}
        />
      </div>

      {/* Mode Toggle */}
      <div className="absolute right-4 top-4 md:right-8 md:top-8 cursor-pointer z-1100">
        <ModeToggle />
      </div>

      {/* Main Content */}
      <div className="relative flex min-h-svh flex-col items-center justify-center px-4 z-10">
        <div className="w-full max-w-2xl space-y-8 backdrop-blur-md bg-background/30 p-12 rounded-xl shadow-2xl">
          <div className="space-y-8 text-center">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="bg-primary/10 text-primary flex size-14 items-center justify-center rounded-full">
                <div className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-md">
                  <ChartNetwork className="size-8" />
                </div>
              </div>
            </div>

            {/* Title and Subtitle */}
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
              <p className="text-sm text-muted-foreground">
                Enter the code sent to
              </p>
              <p className="text-sm font-medium">{email}</p>
            </div>

            {/* OTP Input */}
            <div className="space-y-6 flex items-center justify-center flex-col">
              <InputOTP
                id={id}
                maxLength={6}
                value={otp}
                onChange={setOtp}
                onComplete={handleComplete}
                disabled={isLoading}
              >
                <InputOTPGroup className='gap-2 *:data-[active=true]:ring-0 *:data-[slot=input-otp-slot]:rounded-none *:data-[slot=input-otp-slot]:border-0 *:data-[slot=input-otp-slot]:border-b-2 *:data-[slot=input-otp-slot]:shadow-none *:dark:data-[slot=input-otp-slot]:bg-transparent'>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              {/* Can't find email note */}
              <p className="text-xs text-muted-foreground">
                Can't find the email? Check your spam folder.
              </p>

              {/* Resend Timer */}
              <p className="text-muted-foreground text-xs">
                {timeLeft > 0 ? (
                  `Resend available in ${formatTime(timeLeft)}`
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      handleResend()
                    }}
                    disabled={isLoading}
                    className="text-primary hover:underline focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Resend code
                  </button>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CodeOtpForm;