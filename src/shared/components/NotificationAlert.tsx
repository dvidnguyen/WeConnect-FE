import { CircleAlertIcon, CheckCircleIcon, XCircleIcon, AlertTriangleIcon } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from '@/shared/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { cn } from '@/shared/utils/cn.utils'

interface NotificationAlertProps {
  title: string
  description?: string
  avatar?: string
  avatarFallback?: string
  type?: "default" | "success" | "error" | "warning"
  className?: string
}

function NotificationAlert({
  title,
  description,
  avatar,
  avatarFallback = "U",
  type = "default",
  className
}: NotificationAlertProps) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircleIcon className="text-green-600" />
      case "error":
        return <XCircleIcon className="text-red-600" />
      case "warning":
        return <AlertTriangleIcon className="text-yellow-600" />
      default:
        return <CircleAlertIcon className="text-blue-600" />
    }
  }

  const getAlertVariant = () => {
    switch (type) {
      case "error":
        return "destructive"
      default:
        return "default"
    }
  }

  const getAlertStyles = () => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
      case "error":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
      case "warning":
        return "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20"
      default:
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
    }
  }

  return (
    <Alert
      variant={getAlertVariant()}
      className={cn(
        'flex items-center justify-between gap-3 p-4',
        getAlertStyles(),
        className
      )}
    >
      {avatar && (
        <Avatar className='rounded-sm h-10 w-10 flex-shrink-0'>
          <AvatarImage
            src={avatar}
            alt={title}
            className='rounded-sm'
          />
          <AvatarFallback className='text-xs rounded-sm'>
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      )}

      <div className='flex-1 flex flex-col justify-center gap-1 min-w-0'>
        <AlertTitle className='flex-1 text-sm font-medium line-clamp-2'>
          {title}
        </AlertTitle>
        {description && (
          <AlertDescription className='text-xs text-muted-foreground line-clamp-2'>
            {description}
          </AlertDescription>
        )}
      </div>

      <div className='flex-shrink-0'>
        {getIcon()}
      </div>
    </Alert>
  )
}

export default NotificationAlert
