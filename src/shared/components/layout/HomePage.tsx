import { Link } from 'react-router-dom'
import { toast } from "sonner"
import { Button } from "@/shared/components/ui/button"
const HomePage = () => {
  return (
    <>
      <div className='text-2xl font-bold '>HomePage</div>
      <div>
        <Link to="/login">Go to Login</Link>
      </div>
      <div>
        <Link to="/signup">Go to Sign Up</Link>
      </div>
      <div>
        <Link to="/messages">Go to Messages</Link>
      </div>
      <Button
        variant="outline"
        className="mt-4 loading"
        onClick={() =>
          toast("Event has been created", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          })
        }
      >
        Show Toast
      </Button >
    </>
  )
}

export default HomePage