import { socketService } from './socket.service';

// Call event types
export interface CallRingEvent {
  conversationId: string;
  fromUserId: string;
  media: string;
}

export interface SimpleConvEvent {
  conversationId: string;
  userId: string;
}

export interface SdpPayload {
  conversationId: string;
  toUserId: string;
  fromUserId?: string;
  sdp: string;
}

export interface IcePayload {
  conversationId: string;
  toUserId: string;
  fromUserId?: string;
  candidate: Record<string, unknown>;
}

class CallService {
  // Callback handlers cho call events
  private callRingCallback?: (data: CallRingEvent) => void;
  private callAcceptedCallback?: (data: SimpleConvEvent) => void;
  private callRejectedCallback?: (data: SimpleConvEvent) => void;
  private callEndedCallback?: (data: SimpleConvEvent) => void;
  private webRTCOfferCallback?: (data: SdpPayload) => void;
  private webRTCAnswerCallback?: (data: SdpPayload) => void;
  private webRTCCandidateCallback?: (data: IcePayload) => void;

  constructor() {
    this.setupCallListeners();
  }

  private setupCallListeners() {
    socketService.on('call:ring', (data: CallRingEvent) => {
      console.log('📞 Incoming call:', data);
      this.callRingCallback?.(data);
    });
    
    socketService.on('call:accepted', (data: SimpleConvEvent) => {
      console.log('✅ Call accepted:', data);
      this.callAcceptedCallback?.(data);
    });
    
    socketService.on('call:rejected', (data: SimpleConvEvent) => {
      console.log('❌ Call rejected:', data);
      this.callRejectedCallback?.(data);
    });
    
    socketService.on('call:ended', (data: SimpleConvEvent) => {
      console.log('🔚 Call ended:', data);
      this.callEndedCallback?.(data);
    });
    
    socketService.on('webrtc:offer', (data: SdpPayload) => {
      this.webRTCOfferCallback?.(data);
    });
    
    socketService.on('webrtc:answer', (data: SdpPayload) => {
      this.webRTCAnswerCallback?.(data);
    });
    
    socketService.on('webrtc:candidate', (data: IcePayload) => {
      this.webRTCCandidateCallback?.(data);
    });
  }

  // Methods để register callbacks cho call events
  onCallRing(callback: (data: CallRingEvent) => void) {
    this.callRingCallback = callback;
  }
  offCallRing() {
    this.callRingCallback = undefined;
  }

  onCallAccepted(callback: (data: SimpleConvEvent) => void) {
    this.callAcceptedCallback = callback;
  }
  offCallAccepted() {
    this.callAcceptedCallback = undefined;
  }

  onCallRejected(callback: (data: SimpleConvEvent) => void) {
    this.callRejectedCallback = callback;
  }
  offCallRejected() {
    this.callRejectedCallback = undefined;
  }

  onCallEnded(callback: (data: SimpleConvEvent) => void) {
    this.callEndedCallback = callback;
  }
  offCallEnded() {
    this.callEndedCallback = undefined;
  }

  onWebRTCOffer(callback: (data: SdpPayload) => void) {
    this.webRTCOfferCallback = callback;
  }
  offWebRTCOffer() {
    this.webRTCOfferCallback = undefined;
  }

  onWebRTCAnswer(callback: (data: SdpPayload) => void) {
    this.webRTCAnswerCallback = callback;
  }
  offWebRTCAnswer() {
    this.webRTCAnswerCallback = undefined;
  }

  onWebRTCCandidate(callback: (data: IcePayload) => void) {
    this.webRTCCandidateCallback = callback;
  }
  offWebRTCCandidate() {
    this.webRTCCandidateCallback = undefined;
  }

  // Call event methods
  inviteCall(conversationId: string, media: 'video' | 'audio') {
    socketService.emit('call:invite', { conversationId, media });
  }

  acceptCall(conversationId: string) {
    socketService.emit('call:accept', { conversationId });
  }

  rejectCall(conversationId: string) {
    socketService.emit('call:reject', { conversationId });
  }

  endCall(conversationId: string) {
    socketService.emit('call:end', { conversationId });
  }

  sendWebRTCOffer(conversationId: string, toUserId: string, sdp: string) {
    socketService.emit('webrtc:offer', { conversationId, toUserId, sdp });
  }

  sendWebRTCAnswer(conversationId: string, toUserId: string, sdp: string) {
    socketService.emit('webrtc:answer', { conversationId, toUserId, sdp });
  }

  sendWebRTCCandidate(conversationId: string, toUserId: string, candidate: Record<string, unknown>) {
    socketService.emit('webrtc:candidate', { conversationId, toUserId, candidate });
  }
}

export const callService = new CallService();
