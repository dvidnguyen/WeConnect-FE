import { Dialog, DialogContent } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/components/ui/avatar';
import { Phone, Video, PhoneOff } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CallDialogProps {
  open: boolean;
  media: 'video' | 'audio';
  callerName?: string;
  callerAvatar?: string;
  onAccept: () => void;
  onReject: () => void;
}

const CallDialog: React.FC<CallDialogProps> = ({
  open,
  media,
  callerName,
  callerAvatar,
  onAccept,
  onReject,
}) => {
  const [callDuration, setCallDuration] = useState(0);
  const [isRinging, setIsRinging] = useState(true);

  // Hiệu ứng chuông rung
  useEffect(() => {
    if (open) {
      setIsRinging(true);
      const timer = setInterval(() => {
        setIsRinging(prev => !prev);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setIsRinging(false);
    }
  }, [open]);

  // Đếm thời gian cuộc gọi
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (open) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }

    return () => clearInterval(interval);
  }, [open]);

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onReject()}>
      <DialogContent className="max-w-sm p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" hideClose>
        <div className="flex flex-col items-center gap-6">
          {/* Avatar và thông tin người gọi */}
          <div className="flex flex-col items-center gap-4">
            <div className={`relative ${isRinging ? 'animate-ring' : ''}`}>
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarImage src={callerAvatar} alt={callerName} />
                <AvatarFallback className="text-2xl">
                  {callerName?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 rounded-full bg-primary p-2">
                {media === 'audio' ? (
                  <Phone className="h-5 w-5 text-primary-foreground" />
                ) : (
                  <Video className="h-5 w-5 text-primary-foreground" />
                )}
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="font-semibold text-lg">{callerName || 'Người gọi'}</h3>
              <p className="text-muted-foreground">
                {callDuration > 0 
                  ? formatCallDuration(callDuration)
                  : media === 'audio' ? 'Cuộc gọi thoại...' : 'Cuộc gọi video...'
                }
              </p>
            </div>
          </div>

          {/* Nút điều khiển cuộc gọi */}
          <div className="flex gap-4 w-full justify-center">
            <Button
              onClick={onAccept}
              className="h-14 w-14 rounded-full bg-green-600 hover:bg-green-700"
              size="icon"
            >
              <Phone className="h-6 w-6" />
            </Button>
            
            <Button
              onClick={onReject}
              className="h-14 w-14 rounded-full bg-red-600 hover:bg-red-700"
              size="icon"
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
          </div>

          {/* Thông báo trạng thái */}
          {callDuration === 0 && (
            <p className="text-sm text-muted-foreground animate-pulse">
              Đang kết nối cuộc gọi...
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallDialog;
