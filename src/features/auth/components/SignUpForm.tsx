import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/shared/components/ui/button"
import { useAppDispatch } from "@/app/store/hooks"
import { toast } from "sonner"
import { useId, useMemo, useState } from 'react'
import { CheckIcon, XIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { cn } from "@/shared/utils/cn.utils"
import { Link, useNavigate } from "react-router-dom"
import { authApi } from "@/api/auth.api"

const requirements = [
  { regex: /.{8,}/, text: 'At least 8 characters' },
  { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
  { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
  { regex: /[0-9]/, text: 'At least 1 number' },
  {
    regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/,
    text: 'At least 1 special character'
  }
]

const signUpSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(/[0-9]/, "Password must contain at least 1 number")
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/, "Password must contain at least 1 special character")
})

type SignUpFormData = z.infer<typeof signUpSchema>

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [isVisible, setIsVisible] = useState(false)
  const [password, setPassword] = useState('')
  const id = useId()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

  const currentPassword = watch('password')

  const strength = useMemo(() => requirements.map(req => ({
    met: req.regex.test(currentPassword || ''),
    text: req.text
  })), [currentPassword])

  const strengthScore = useMemo(() => {
    return strength.filter(req => req.met).length
  }, [strength])

  const getColor = (score: number) => {
    if (score === 0) return 'bg-border'
    if (score <= 1) return 'bg-destructive'
    if (score <= 2) return 'bg-orange-500'
    if (score <= 3) return 'bg-amber-500'
    if (score === 4) return 'bg-yellow-400'
    return 'bg-green-500'
  }

  const getText = (score: number) => {
    if (score === 0) return 'Enter a password'
    if (score <= 2) return 'Weak password'
    if (score <= 3) return 'Medium password'
    if (score === 4) return 'Strong password'
    return 'Very strong password'
  }

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await toast.promise(
        async () => {
          // Chuẩn bị payload cho form api yêu cầu 
          const registerPayload = {
            username: data.fullName,
            password: data.password,
            email: data.email
          };

          // Gọi API đăng ký và chờ response
          const response = await authApi.register(registerPayload);

          console.log('Register response:', response);

          // Nếu đăng ký thành công và valid = true
          if (response?.code === 200 && response?.result?.valid === true) {
            // Dispatch response vào Redux store
            dispatch(setRegisterResponse(response));

            // Gọi API gửi OTP
            await authApi.sendOtp(response.result.email);

            // Đợi 1.5s để hiển thị loading
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Chuyển hướng sang trang OTP
            navigate('/otp', {
              state: {
                email: response.result.email,
                message: "Please check your email for verification code"
              }
            });

            return response;
          }

          // Nếu không thành công, không throw error mà return response để toast.promise có thể hiển thị
          return response;
        },
        {
          loading: 'Creating your account...',
          success: 'Account created successfully! Check your email for verification.',
          error: (err: Error) => err.message || 'An error occurred during registration.'
        }
      );
    } catch (error) {
      console.error("Registration error:", error);
      throw error; // Re-throw để react-hook-form có thể xử lý lỗi
    }
  }
  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <Card>
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-lg">Create an account</CardTitle>
          <CardDescription>
            Sign up with your Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="flex flex-col gap-3">

                <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Sign up with Google
                </Button>
              </div>
              <div className="after:border-border relative text-center text-xs after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName" className="text-sm">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    {...register("fullName")}
                    aria-invalid={!!errors.fullName}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-destructive">{errors.fullName.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-sm">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...register("email")}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-sm">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={isVisible ? "text" : "password"}
                      {...register("password")}
                      aria-invalid={!!errors.password}
                      className="pe-9"
                      autoComplete="new-password"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive flex flex-wrap gap-2">{errors.password.message}</p>
                  )}

                  <div className="mb-2 flex h-1 w-full gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span
                        key={index}
                        className={cn(
                          "h-full flex-1 rounded-full transition-all duration-500 ease-out",
                          index < strengthScore ? getColor(strengthScore) : "bg-border"
                        )}
                      />
                    ))}
                  </div>

                  <p className="text-foreground text-sm font-medium">{getText(strengthScore)}. Must contain:</p>

                  <ul className="space-y-1.5">
                    {strength.map((req, index) => (
                      <li key={index} className="flex items-center gap-2">
                        {req.met ? (
                          <CheckIcon className="size-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <XIcon className="text-muted-foreground size-4" />
                        )}
                        <span className={cn("text-xs", req.met ? "text-green-600 dark:text-green-400" : "text-muted-foreground")}>
                          {req.text}
                          <span className="sr-only">{req.met ? " - Requirement met" : " - Requirement not met"}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                  {isSubmitting ? "Creating account..." : "Create account"}
                </Button>

              </div>
              <div className="text-center text-xs">
                Already have an account?{" "}
                <Link to="/login" className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
