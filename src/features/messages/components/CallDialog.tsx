import { Dialog, DialogContent } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/components/ui/avatar';
import { Phone, Video, PhoneOff, Loader2, Mic, MicOff, VideoOff } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface CallDialogProps {
  open: boolean;
  mode: 'idle' | 'outgoing' | 'incoming' | 'in-call';
  media: 'video' | 'audio';
  callerName?: string;
  callerAvatar?: string;
  calleeName?: string;
  calleeAvatar?: string;
  onAccept?: () => void;
  onReject?: () => void;
  onCancelOutgoing?: () => void;
  onEndCall?: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
  onToggleCamera?: () => void;
  isCameraOn?: boolean;
  localStream?: MediaStream | null;
  remoteStream?: MediaStream | null;
  callDuration?: number;
}

const DEFAULT_AVATAR = 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png';

const formatDuration = (seconds = 0) => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

const CallDialog: React.FC<CallDialogProps> = ({
  open,
  mode,
  media,
  callerName,
  callerAvatar,
  calleeName,
  calleeAvatar,
  onAccept,
  onReject,
  onCancelOutgoing,
  onEndCall,
  isMuted,
  onToggleMute,
  onToggleCamera,
  isCameraOn,
  localStream,
  remoteStream,
  callDuration = 0,
}) => {
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  const remoteHasActiveVideo = (stream?: MediaStream | null) => {
    if (!stream) return false;
    const vtracks = stream.getVideoTracks();
    if (!vtracks || vtracks.length === 0) return false;
    return vtracks.some(t => t.enabled !== false && t.readyState !== 'ended');
  };

  // Attach remote stream (if active video) to main video element
  useEffect(() => {
    const v = remoteVideoRef.current;
    if (!v) return;
    if (remoteHasActiveVideo(remoteStream)) {
      try {
        // @ts-ignore
        v.srcObject = remoteStream;
        v.play().catch(() => { });
      } catch {
        // silent fail — UI falls back to avatar automatically
      }
    } else {
      try {
        // detach if no active video
        // @ts-ignore
        v.srcObject = null;
      } catch { }
    }
    return () => {
      if (v) {
        try { // @ts-ignore
          v.srcObject = null;
        } catch { }
      }
    };
  }, [remoteStream]);

  // Attach local stream for preview (muted)
  useEffect(() => {
    const lv = localVideoRef.current;
    if (!lv) return;
    try {
      // @ts-ignore
      lv.srcObject = localStream ?? null;
      if (localStream) lv.play().catch(() => { });
    } catch { }
    return () => {
      if (lv) {
        try { // @ts-ignore
          lv.srcObject = null;
        } catch { }
      }
    };
  }, [localStream]);

  const remoteVideoActive = remoteHasActiveVideo(remoteStream);
  const showRemote = remoteVideoActive;
  const showLocalFull = !remoteVideoActive && media === 'video' && !!localStream;
  const showAvatar = !showRemote && !showLocalFull;

  const otherAvatar = mode === 'incoming' ? (callerAvatar || calleeAvatar) : (calleeAvatar || callerAvatar);
  const otherName = mode === 'incoming' ? (callerName || calleeName) : (calleeName || callerName);

  // Wider dialog for video mode to match Zalo/Message look
  const dialogWidthClass = (media === 'video' || isCameraOn || !!remoteStream) ? 'max-w-2xl w-full sm:max-w-3xl' : 'max-w-sm';

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen && mode === 'incoming') onReject && onReject();
    }}>
      <DialogContent
        className={`${dialogWidthClass} p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60`}
        hideClose
        style={{ zIndex: 999999 }}
      >
        <div className="flex flex-col items-center gap-6 relative">
          <div className="flex flex-col items-center gap-4 w-full">
            {showRemote && (
              <div className="rounded-lg overflow-hidden w-full flex justify-center bg-black">
                <video
                  ref={remoteVideoRef}
                  className="rounded-md max-h-[420px] object-cover w-full"
                  autoPlay
                  playsInline
                />
              </div>
            )}

            {showLocalFull && (
              <div className="rounded-lg overflow-hidden w-full flex justify-center bg-black">
                <video
                  ref={localVideoRef}
                  className="rounded-md max-h-[420px] object-cover w-full"
                  autoPlay
                  playsInline
                  muted
                />
              </div>
            )}

            {showAvatar && (
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="relative w-full rounded-md bg-neutral-800/80 flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-36 w-36 border-4 border-primary/20">
                      <AvatarImage src={otherAvatar || DEFAULT_AVATAR} alt={otherName} />
                      <AvatarFallback className="text-3xl">
                        {otherName?.split(' ').map(word => word[0]).join('').toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">{otherName || 'Người dùng'}</h3>
                      <p className="text-muted-foreground">
                        {media === 'audio' ? 'Cuộc gọi thoại' : 'Camera tạm đóng — hiển thị ảnh đại diện'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center">
              <h3 className="font-semibold text-lg">
                {mode === 'incoming' ? (callerName || 'Người gọi') :
                  mode === 'outgoing' ? (calleeName || 'Đang gọi...') :
                    mode === 'in-call' ? (calleeName || callerName || 'Đang gọi') :
                      'Cuộc gọi'}
              </h3>

              <p className="text-muted-foreground">
                {mode === 'incoming' && (media === 'audio' ? 'Cuộc gọi thoại...' : 'Cuộc gọi video...')}
                {mode === 'outgoing' && (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Đang kết nối...
                  </span>
                )}
                {mode === 'in-call' && (
                  <span>{formatDuration(callDuration)}</span>
                )}
              </p>
            </div>
          </div>

          {(localStream && (showRemote || (mode !== 'idle' && media === 'video'))) && (
            <div className="absolute right-4 bottom-28 w-28 h-20 rounded-md overflow-hidden ring-1 ring-neutral-200/40 shadow-md">
              <video
                ref={localVideoRef}
                className="object-cover w-full h-full"
                autoPlay
                playsInline
                muted
              />
            </div>
          )}

          <div className="flex gap-4 w-full justify-center">
            {mode === 'incoming' && (
              <>
                <Button onClick={onAccept} className="h-14 w-14 rounded-full bg-green-600 hover:bg-green-700" size="icon">
                  <Phone className="h-6 w-6" />
                </Button>

                <Button onClick={onReject} className="h-14 w-14 rounded-full bg-red-600 hover:bg-red-700" size="icon">
                  <PhoneOff className="h-6 w-6" />
                </Button>
              </>
            )}

            {mode === 'outgoing' && (
              <Button onClick={onCancelOutgoing} className="h-14 w-32 rounded-full bg-red-600 hover:bg-red-700" size="sm">
                Hủy gọi
              </Button>
            )}

            {mode === 'in-call' && (
              <>
                <Button onClick={onToggleMute} className="h-12 w-12 rounded-full bg-muted/10 hover:bg-muted/20" size="icon">
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>

                <Button onClick={onToggleCamera} className="h-12 w-12 rounded-full bg-muted/10 hover:bg-muted/20" size="icon">
                  {isCameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>

                <Button onClick={onEndCall} className="h-14 w-14 rounded-full bg-red-600 hover:bg-red-700" size="icon">
                  <PhoneOff className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>

          <div className="mt-2">
            {mode === 'outgoing' && (
              <p className="text-sm text-muted-foreground">Đang chờ người nhận...</p>
            )}
            {mode === 'incoming' && (
              <p className="text-sm text-muted-foreground">Nhận cuộc gọi hoặc từ chối</p>
            )}
            {mode === 'in-call' && (
              <p className="text-sm text-muted-foreground">Kết nối — {formatDuration(callDuration)}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallDialog;
