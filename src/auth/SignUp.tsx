import { Link } from 'react-router-dom'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Định nghĩa schema validation
const formSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  phone: z.string().min(10, { message: "Số điện thoại phải có ít nhất 10 số" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
})

const SignUp = () => {
  // Khởi tạo form với react-hook-form và zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      phone: "",
      password: "",
    },
  })

  // Xử lý khi submit form
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // TODO: Gửi dữ liệu đăng ký lên bằng api    
    alert(`Đăng ký thành công với email: ${values.email}`)
    // Navigate("/login", { replace: true }) // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
  }

  return (
    <>
      <Card className="w-full max-w-sm m-auto">
        <CardHeader>
          <CardTitle className='m-min-w-[120px] flex justify-start'>Create an account</CardTitle>
          <CardDescription className="text-left w-[210px]">
            Enter your email below to create a new account
          </CardDescription>
          <CardAction>
            <Link to="/login">
              <Button variant="link">Login</Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="123-456-7890"
                  {...form.register("phone")}
                />
                {form.formState.errors.phone && (
                  <p className="text-red-500 text-sm">{form.formState.errors.phone.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
                )}
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <Button type="submit" className="w-full loading">
                Sign Up
              </Button>
              <Button type="button" variant="outline" className="w-full">
                Sign Up with Google
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
        </CardFooter>
      </Card>
      <div>
        <Link to="/">Back Home</Link>
      </div>
    </>
  )
}

export default SignUp