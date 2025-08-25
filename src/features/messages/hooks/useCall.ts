import { useSocket } from '@/app/providers/SocketProvider';

export const useCall = () => {
  const { socket } = useSocket();

  const inviteCall = (conversationId: string, media: 'video' | 'audio') => {
    socket.emit('call:invite', { conversationId, media });
  };

  const acceptCall = (conversationId: string) => {
    socket.emit('call:accept', { conversationId });
  };

  const rejectCall = (conversationId: string) => {
    socket.emit('call:reject', { conversationId });
  };

  const endCall = (conversationId: string) => {
    socket.emit('call:end', { conversationId });
  };

  const sendWebRTCOffer = (conversationId: string, toUserId: string, sdp: string) => {
    socket.emit('webrtc:offer', { conversationId, toUserId, sdp });
  };

  const sendWebRTCAnswer = (conversationId: string, toUserId: string, sdp: string) => {
    socket.emit('webrtc:answer', { conversationId, toUserId, sdp });
  };

  const sendWebRTCCandidate = (conversationId: string, toUserId: string, candidate: object) => {
    socket.emit('webrtc:candidate', { conversationId, toUserId, candidate });
  };

  return {
    inviteCall,
    acceptCall,
    rejectCall,
    endCall,
    sendWebRTCOffer,
    sendWebRTCAnswer,
    sendWebRTCCandidate,
  };
};

export default useCall;
