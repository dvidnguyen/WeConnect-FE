import { useEffect, useId, useState, useRef } from 'react'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/shared/components/ui/input-otp'
import { ModeToggle } from '@/shared/components/Mode-toggle'
import Threads from '../../../../LOGINPAGE.TSX/Threads/Threads'
import { ChartNetwork } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/utils/cn.utils'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { authApi } from '@/api/auth.api'
import { useAppSelector } from '@/app/store/hooks'

const CodeOtpForm = () => {
  const navigate = useNavigate()
  const email = useAppSelector((state) => state.auth.tempEmail)
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const timerRef = useRef<{ timeLeft: number, timerId: NodeJS.Timeout | null }>({ timeLeft: 300, timerId: null })
  const timerDisplayRef = useRef<HTMLSpanElement>(null)
  const id = useId()

  const startTimer = () => {
    // Clear any existing timer
    if (timerRef.current.timerId) {
      clearInterval(timerRef.current.timerId)
    }

    // Start new timer if time is remaining
    if (timerRef.current.timeLeft > 0) {
      timerRef.current.timerId = setInterval(() => {
        timerRef.current.timeLeft -= 1
        updateResendButton()

        if (timerRef.current.timeLeft <= 0) {
          if (timerRef.current.timerId) {
            clearInterval(timerRef.current.timerId)
          }
          updateResendButton()
        }
      }, 1000)
    }
  }

  useEffect(() => {
    if (!email) {
      toast.error('Please sign up first')
      navigate('/signup')
    }
  }, [email, navigate])

  useEffect(() => {
    startTimer()
    updateResendButton()

    return () => {
      if (timerRef.current.timerId) {
        clearInterval(timerRef.current.timerId)
      }
    }
  }, [])  
    const updateResendButton = () => {
    if (timerDisplayRef.current) {
      if (timerRef.current.timeLeft > 0) {
        const mins = Math.floor(timerRef.current.timeLeft / 60)
        const secs = timerRef.current.timeLeft % 60
        timerDisplayRef.current.textContent = `Resend available in ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      } else {
        timerDisplayRef.current.textContent = 'Resend code'
      }
    }
  }

  const handleVerifyOtp = async (otpValue: string) => {
    try {
      setIsLoading(true)

      if (!email) {
        toast.error('Email not found, please sign up first')
        navigate('/signup')
        return
      }

      const response = await authApi.verifyOtp({
        email: email,
        otp: otpValue
      });

      if (response?.code === 200) {
        // Lưu JWT token vào localStorage hoặc state management
        localStorage.setItem('token', response.result.token);

        toast.success('Email verified successfully!');

        // Đợi 1s để người dùng thấy toast message
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Redirect to messages page
        navigate('/messages');
      }

    } catch (error) {
      console.error('Failed to verify OTP:', error)
      setIsError(true)
      toast.error('Invalid verification code. Please try again.');
      setTimeout(() => setIsError(false), 820)
    } finally {
      setIsLoading(false)
    }
  }

  // Auto submit when OTP is complete
  const handleComplete = (value: string) => {
    setOtp(value)
    if (value.length === 6) {
      handleVerifyOtp(value)
    }
  }

  const handleResend = async () => {
    try {
      if (!email) {
        toast.error('Email not found, please sign up first')
        navigate('/signup')
        return
      }

      setIsLoading(true)
      // Call resend OTP API
      await authApi.sendOtp(email)

      toast.success('Verification code resent!')
      timerRef.current.timeLeft = 60
      startTimer()

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
              <div className={cn("space-y-6", { "animate-shake": isError })}>
                <InputOTP
                  id={id}
                  maxLength={6}
                  value={otp}
                  onChange={(value) => {
                    const numericValue = value.replace(/[^0-9]/g, "")
                    setOtp(numericValue)
                  }}
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

                <Button
                  className="w-full"
                  onClick={() => handleVerifyOtp(otp)}
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? 'Verifying...' : 'Verify Email'}
                </Button>
              </div>

              {/* Can't find email note */}
              <p className="text-xs text-muted-foreground">
                Can't find the email? Check your spam folder.
              </p>

              {/* Resend Timer */}
              <p className="text-muted-foreground text-xs">
                <span ref={timerDisplayRef}>Resend available in 05:00</span>
                {timerRef.current.timeLeft <= 0 && (
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