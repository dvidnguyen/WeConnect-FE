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
  // signaling callbacks (external)
  private callRingCallback?: (data: CallRingEvent) => void;
  private callAcceptedCallback?: (data: SimpleConvEvent) => void;
  private callRejectedCallback?: (data: SimpleConvEvent) => void;
  private callEndedCallback?: (data: SimpleConvEvent) => void;
  private webRTCOfferCallback?: (data: SdpPayload) => void;
  private webRTCAnswerCallback?: (data: SdpPayload) => void;
  private webRTCCandidateCallback?: (data: IcePayload) => void;

  // WebRTC internal state (support single active call for simplicity)
  private pc: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private currentConversationId: string | null = null;
  private currentPeerUserId: string | null = null;
  private isCaller = false;

  // pending remote candidates queue (to avoid addIceCandidate when remoteDesc not ready)
  private pendingRemoteCandidates: RTCIceCandidateInit[] = [];

  // callback for UI to get remote stream
  private remoteStreamCallback?: (stream: MediaStream | null) => void;

  constructor() {
    this.setupCallListeners();
  }

  /********** Setup socket listeners (also call external callbacks) **********/
  private setupCallListeners() {
    socketService.on('call:ring', (data: CallRingEvent) => {
      console.log('📞 Incoming call:', data);
      this.callRingCallback?.(data);
    });

    socketService.on('call:accepted', (data: SimpleConvEvent) => {
      console.log('✅ Call accepted:', data);
      this.callAcceptedCallback?.(data);

      // --- FIX: ensure we create offer regardless of whether currentPeerUserId was set earlier.
      // Use server-provided userId (data.userId) if available, otherwise fall back to stored peer id or empty string.
      if (this.isCaller && this.currentConversationId === data.conversationId) {
        const toUser = data.userId || this.currentPeerUserId || '';
        // update internal peer id (so future candidates use correct target if available)
        this.currentPeerUserId = toUser;

        console.debug('[callService] call accepted -> creating offer', { conversationId: this.currentConversationId, toUser });
        // createAndSendOffer will attach local tracks (if set) and send offer (server should route by toUser or conversationId)
        this.createAndSendOffer(this.currentConversationId!, toUser).catch(e => {
          console.error('[callService] createAndSendOffer failed', e);
        });
      }
    });

    socketService.on('call:rejected', (data: SimpleConvEvent) => {
      console.log('❌ Call rejected:', data);
      this.callRejectedCallback?.(data);
      // cleanup
      this.cleanupPeer();
    });

    socketService.on('call:ended', (data: SimpleConvEvent) => {
      console.log('🔚 Call ended:', data);
      this.callEndedCallback?.(data);
      this.cleanupPeer();
    });

    // WebRTC signalling messages from server (forward to internal handlers + external callbacks)
    socketService.on('webrtc:offer', (data: SdpPayload) => {
      console.log('[callService] recv webrtc:offer', data);
      this.webRTCOfferCallback?.(data);
      // internal handling: create pc, setRemoteDescription, createAnswer, send it
      this.handleRemoteOffer(data).catch(e => console.error('[callService] handleRemoteOffer error', e));
    });

    socketService.on('webrtc:answer', (data: SdpPayload) => {
      console.log('[callService] recv webrtc:answer', data);
      this.webRTCAnswerCallback?.(data);
      this.handleRemoteAnswer(data).catch(e => console.error('[callService] handleRemoteAnswer error', e));
    });

    socketService.on('webrtc:candidate', (data: IcePayload) => {
      console.log('[callService] recv webrtc:candidate', data);
      // external callback
      this.webRTCCandidateCallback?.(data);
      this.handleRemoteCandidate(data).catch(e => console.error('[callService] handleRemoteCandidate error', e));
    });
  }

  /********** External callback registration (unchanged) **********/
  onCallRing(callback: (data: CallRingEvent) => void) { this.callRingCallback = callback; }
  offCallRing() { this.callRingCallback = undefined; }

  onCallAccepted(callback: (data: SimpleConvEvent) => void) { this.callAcceptedCallback = callback; }
  offCallAccepted() { this.callAcceptedCallback = undefined; }

  onCallRejected(callback: (data: SimpleConvEvent) => void) { this.callRejectedCallback = callback; }
  offCallRejected() { this.callRejectedCallback = undefined; }

  onCallEnded(callback: (data: SimpleConvEvent) => void) { this.callEndedCallback = callback; }
  offCallEnded() { this.callEndedCallback = undefined; }

  onWebRTCOffer(callback: (data: SdpPayload) => void) { this.webRTCOfferCallback = callback; }
  offWebRTCOffer() { this.webRTCOfferCallback = undefined; }

  onWebRTCAnswer(callback: (data: SdpPayload) => void) { this.webRTCAnswerCallback = callback; }
  offWebRTCAnswer() { this.webRTCAnswerCallback = undefined; }

  onWebRTCCandidate(callback: (data: IcePayload) => void) { this.webRTCCandidateCallback = callback; }
  offWebRTCCandidate() { this.webRTCCandidateCallback = undefined; }

  // UI can register to receive remote stream
  onRemoteStream(callback: (stream: MediaStream | null) => void) {
    this.remoteStreamCallback = callback;
    // immediately notify if remote already exists
    if (this.remoteStream) this.remoteStreamCallback(this.remoteStream);
  }
  offRemoteStream() { this.remoteStreamCallback = undefined; }

  /********** Basic signaling emitters (unchanged behavior, keep for compatibility) **********/
  inviteCall(conversationId: string, media: 'video' | 'audio') {
    if (!socketService.isConnected()) {
      console.warn('[callService] inviteCall aborted: socket not connected', { conversationId, media });
      return;
    }
    console.log('[callService] inviteCall ->', { conversationId, media });
    (socketService as any).emit('call:invite', { conversationId, media }, (ack: any) => {
      console.log('[callService] inviteCall ack:', ack);
    });
  }

  acceptCall(conversationId: string) {
    if (!socketService.isConnected()) {
      console.warn('[callService] acceptCall aborted: socket not connected', conversationId);
      return;
    }
    (socketService as any).emit('call:accept', { conversationId }, (ack: any) => {
      console.log('[callService] acceptCall ack:', ack);
    });
  }

  rejectCall(conversationId: string) {
    if (!socketService.isConnected()) {
      console.warn('[callService] rejectCall aborted: socket not connected', conversationId);
      return;
    }
    (socketService as any).emit('call:reject', { conversationId }, (ack: any) => {
      console.log('[callService] rejectCall ack:', ack);
    });
  }

  endCall(conversationId: string) {
    if (!socketService.isConnected()) {
      console.warn('[callService] endCall aborted: socket not connected', conversationId);
      // still cleanup local state
      this.cleanupPeer();
      return;
    }
    (socketService as any).emit('call:end', { conversationId }, (ack: any) => {
      console.log('[callService] endCall ack:', ack);
    });
    this.cleanupPeer();
  }

  sendWebRTCOffer(conversationId: string, toUserId: string, sdp: string) {
    if (!socketService.isConnected()) {
      console.warn('[callService] sendWebRTCOffer aborted: socket not connected');
      return;
    }
    (socketService as any).emit('webrtc:offer', { conversationId, toUserId, sdp }, (ack: any) => {
      console.log('[callService] webrtc:offer ack:', ack);
    });
  }

  sendWebRTCAnswer(conversationId: string, toUserId: string, sdp: string) {
    if (!socketService.isConnected()) {
      console.warn('[callService] sendWebRTCAnswer aborted: socket not connected');
      return;
    }
    (socketService as any).emit('webrtc:answer', { conversationId, toUserId, sdp }, (ack: any) => {
      console.log('[callService] webrtc:answer ack:', ack);
    });
  }

  sendWebRTCCandidate(conversationId: string, toUserId: string, candidate: Record<string, unknown>) {
    // log very clearly so we can see in console whether we are emitting
    console.debug('[callService] sendWebRTCCandidate ->', { conversationId, toUserId, candidate });
    try {
      (socketService as any).emit('webrtc:candidate', { conversationId, toUserId, candidate }, (ack: any) => {
        // optional ack log
      });
    } catch (e) {
      console.warn('[callService] emit candidate failed', e);
    }
  }

  /********** WebRTC helpers **********/

  // Create RTCPeerConnection and wire events
  private createPeerConnection(conversationId: string, peerUserId: string) {
    console.debug('[callService] createPeerConnection called', { conversationId, peerUserId });
    if (this.pc) {
      console.warn('[callService] pc already exists, will reuse it');
      return this.pc;
    }

    // reset pending candidates for new pc
    this.pendingRemoteCandidates = [];

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    });

    // log ICE gathering state changes
    pc.addEventListener('icegatheringstatechange', () => {
      console.debug('[callService] iceGatheringState ->', pc.iceGatheringState);
    });

    pc.onicecandidate = (ev) => {
      // ev.candidate can be null when gathering finished
      console.debug('[callService] onicecandidate fired', {
        candidate: ev.candidate ? (ev.candidate.toJSON ? ev.candidate.toJSON() : ev.candidate) : null,
        iceGatheringState: pc.iceGatheringState,
        signalingState: pc.signalingState
      });
      if (ev.candidate) {
        this.sendWebRTCCandidate(conversationId, peerUserId, ev.candidate.toJSON ? ev.candidate.toJSON() : ev.candidate);
      }
    };

    pc.ontrack = (ev) => {
      console.debug('[callService] ontrack event', {
        streams: ev.streams,
        stream0Tracks: ev.streams && ev.streams[0] ? ev.streams[0].getTracks().map(t => ({ kind: t.kind, id: t.id, enabled: t.enabled, readyState: t.readyState })) : null
      });
      this.remoteStream = ev.streams && ev.streams[0] ? ev.streams[0] : null;
      if (this.remoteStreamCallback) this.remoteStreamCallback(this.remoteStream);
    };

    pc.onconnectionstatechange = () => {
      console.debug('[callService] pc connectionState=', pc.connectionState, {
        iceConnectionState: (pc as any).iceConnectionState,
        signalingState: pc.signalingState,
        senders: pc.getSenders().map(s => ({ id: s.track?.id, kind: s.track?.kind, enabled: s.track?.enabled }))
      });
    };

    this.pc = pc;
    this.currentConversationId = conversationId;
    this.currentPeerUserId = peerUserId;
    return pc;
  }

  // Add local tracks (if any) to pc
  private addLocalTracksToPC(pc: RTCPeerConnection, stream: MediaStream | null) {
    if (!stream) return;
    stream.getTracks().forEach(track => {
      try {
        // If we already have a sender for this kind, try replaceTrack, else addTrack
        const existingSender = pc.getSenders().find(s => s.track && s.track.kind === track.kind);
        if (existingSender && existingSender.replaceTrack) {
          existingSender.replaceTrack(track);
          console.debug('[callService] replaced existing sender track', { kind: track.kind, id: track.id });
        } else {
          pc.addTrack(track, stream);
          console.debug('[callService] added track to pc', { kind: track.kind, id: track.id });
        }
      } catch (e) {
        console.warn('[callService] addTrack/replaceTrack error', e);
      }
    });
  }

  // Caller: create offer and send
  private async createAndSendOffer(conversationId: string, toUserId: string) {
    if (!this.pc) this.createPeerConnection(conversationId, toUserId);
    if (!this.pc) throw new Error('pc not created');

    // ensure local tracks are attached BEFORE createOffer
    if (this.localStream) {
      this.addLocalTracksToPC(this.pc, this.localStream);
    } else {
      console.debug('[callService] createAndSendOffer: no localStream present');
    }

    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);

    console.debug('[callService] created offer (localDescription set).', {
      hasVideo: (offer.sdp || '').includes('m=video'),
      sdpSnippet: (offer.sdp || '').split('\n').slice(0, 30).join('\n'),
      iceGatheringState: this.pc.iceGatheringState
    });

    // Wait for ICE gathering complete in dev to ensure candidates flow (optional)
    if (this.pc.iceGatheringState !== 'complete') {
      await new Promise<void>((resolve) => {
        const check = () => {
          if (!this.pc) return resolve();
          if (this.pc.iceGatheringState === 'complete') {
            this.pc.removeEventListener('icegatheringstatechange', check);
            return resolve();
          }
        };
        this.pc.addEventListener('icegatheringstatechange', check);
        // fallback resolve after 2s
        setTimeout(() => resolve(), 2000);
      });
    }

    // Finally send offer over signaling
    this.sendWebRTCOffer(conversationId, toUserId, offer.sdp || '');
    console.debug('[callService] offer sent to signaling', { conversationId, toUserId });
  }

  // Callee: handle incoming offer (SDP), create answer and send
  private async handleRemoteOffer(data: SdpPayload) {
    const { conversationId, fromUserId, sdp } = data;
    console.debug('[callService] handleRemoteOffer start', { conversationId, fromUserId });
    // create pc if needed
    if (!this.pc) this.createPeerConnection(conversationId, fromUserId || '');
    if (!this.pc) throw new Error('pc not created in handleRemoteOffer');

    // If localStream exists, add tracks so answer includes our m= lines
    if (this.localStream) {
      this.addLocalTracksToPC(this.pc, this.localStream);
    } else {
      console.debug('[callService] handleRemoteOffer: localStream not present, answer will be audio-only / no outgoing tracks');
    }

    // set remote desc
    await this.pc.setRemoteDescription({ type: 'offer', sdp: sdp as string });
    console.debug('[callService] setRemoteDescription(offer) done');

    // Drain any queued candidates that arrived earlier
    if (this.pendingRemoteCandidates.length) {
      console.debug('[callService] draining pendingRemoteCandidates count=', this.pendingRemoteCandidates.length);
      for (const c of this.pendingRemoteCandidates) {
        try {
          await this.pc.addIceCandidate(c);
        } catch (e) {
          console.warn('[callService] addIceCandidate from pending failed', e);
        }
      }
      this.pendingRemoteCandidates = [];
    }

    // create answer
    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);

    console.debug('[callService] created answer', {
      hasVideo: (answer.sdp || '').includes('m=video'),
      iceGatheringState: this.pc.iceGatheringState
    });

    // optional wait for ICE gather
    if (this.pc.iceGatheringState !== 'complete') {
      await new Promise<void>(resolve => {
        const check = () => {
          if (!this.pc) return resolve();
          if (this.pc.iceGatheringState === 'complete') {
            this.pc.removeEventListener('icegatheringstatechange', check);
            return resolve();
          }
        };
        this.pc.addEventListener('icegatheringstatechange', check);
        setTimeout(resolve, 2000);
      });
    }

    // send answer
    this.sendWebRTCAnswer(conversationId, fromUserId || '', answer.sdp || '');
    console.debug('[callService] answer sent to signaling', { conversationId, toUserId: fromUserId });
  }

  // Caller: handle remote answer
  private async handleRemoteAnswer(data: SdpPayload) {
    const { conversationId, fromUserId, sdp } = data;
    console.debug('[callService] handleRemoteAnswer', data);
    if (!this.pc) {
      console.warn('[callService] handleRemoteAnswer: no pc exists');
      return;
    }

    // Only set remote answer if we have a local offer (proper state)
    try {
      if (this.pc.signalingState === 'have-local-offer' || this.pc.signalingState === 'have-remote-offer' || this.pc.signalingState === 'have-local-pranswer') {
        await this.pc.setRemoteDescription({ type: 'answer', sdp: sdp as string });
        console.debug('[callService] setRemoteDescription(answer) done');
      } else if (!this.pc.remoteDescription || !this.pc.remoteDescription.type) {
        // fallback attempt (rare)
        try {
          await this.pc.setRemoteDescription({ type: 'answer', sdp: sdp as string });
          console.debug('[callService] setRemoteDescription(answer) done via fallback');
        } catch (e) {
          console.warn('[callService] setRemoteDescription(answer) skipped (state)', e);
        }
      } else {
        console.debug('[callService] skip setRemoteDescription(answer) because signalingState=', this.pc.signalingState);
      }

      // Drain pending candidates now that remote desc likely set
      if (this.pendingRemoteCandidates.length) {
        console.debug('[callService] draining pendingRemoteCandidates after answer count=', this.pendingRemoteCandidates.length);
        for (const c of this.pendingRemoteCandidates) {
          try {
            await this.pc.addIceCandidate(c);
          } catch (e) {
            console.warn('[callService] addIceCandidate from pending after answer failed', e);
          }
        }
        this.pendingRemoteCandidates = [];
      }
    } catch (e) {
      console.warn('[callService] handleRemoteAnswer error', e);
    }
  }

  // handle remote candidate
  private async handleRemoteCandidate(data: IcePayload) {
    console.debug('[callService] handleRemoteCandidate ->', data);
    if (!this.pc) {
      // No pc yet: push into pending queue
      console.warn('[callService] no pc yet - queueing candidate', data.candidate);
      this.pendingRemoteCandidates.push(data.candidate as RTCIceCandidateInit);
      return;
    }

    // If remote description not set yet, queue candidate
    if (!this.pc.remoteDescription || !this.pc.remoteDescription.type) {
      console.warn('[callService] remoteDescription not set yet - queueing candidate', data.candidate);
      this.pendingRemoteCandidates.push(data.candidate as RTCIceCandidateInit);
      return;
    }

    try {
      await this.pc.addIceCandidate(data.candidate as RTCIceCandidateInit);
      console.debug('[callService] addIceCandidate succeeded immediately');
    } catch (e) {
      console.warn('[callService] addIceCandidate failed', e);
    }
  }

  /********** Public helpers to integrate with UI (must call with localStream when available) **********/

  /**
   * Provide local stream to service. Service keeps reference and will attach tracks
   * into PeerConnection when creating offer/answer. If pc already exists, replace/add tracks immediately.
   */
  async setLocalStream(stream: MediaStream | null) {
    console.debug('[callService] setLocalStream called', { hasStream: !!stream });
    this.localStream = stream;

    // If pc exists, ensure tracks are added or replaced so subsequent createOffer/answer includes them
    if (this.pc && stream) {
      try {
        this.addLocalTracksToPC(this.pc, stream);
      } catch (e) {
        console.warn('[callService] error adding local tracks to existing pc', e);
      }
    }
  }

  /**
   * Start peer connection flow as caller. This will create PC and if already accepted by callee,
   * will createOffer and send it (but server usually forwards only after accepted event).
   *
   * Use when you are the caller and you have localStream (or null).
   */
  async startCallAsCaller(conversationId: string, toUserId: string, localStream: MediaStream | null, media: 'audio' | 'video') {
    this.isCaller = true;
    this.currentConversationId = conversationId;
    this.currentPeerUserId = toUserId;
    this.localStream = localStream;
    // create PC now (tracks will be added in createAndSendOffer or via setLocalStream)
    this.createPeerConnection(conversationId, toUserId);
    // Note: we do NOT automatically createOffer here; we wait for call:accepted by default.
  }

  /**
   * When callee accepts, call this to ensure localStream is set and pc created.
   * Usually you call setLocalStream(localStream) earlier (onAccept) and then server emits webrtc:offer from caller.
   */
  async startCallAsCallee(conversationId: string, fromUserId: string, localStream: MediaStream | null) {
    this.isCaller = false;
    this.currentConversationId = conversationId;
    this.currentPeerUserId = fromUserId;
    this.localStream = localStream;
    // create pc so handleRemoteOffer can attach tracks and createAnswer
    this.createPeerConnection(conversationId, fromUserId);
    // if localStream exists, immediately add tracks so later remote offer sees our m-lines (we also add on handleRemoteOffer just before setRemoteDescription)
    if (this.pc && this.localStream) {
      this.addLocalTracksToPC(this.pc, this.localStream);
    }
  }

  // cleanup peer + streams references
  private cleanupPeer() {
    try {
      if (this.pc) {
        try { this.pc.getSenders().forEach(s => { /* nothing */ }); } catch (e) { }
        this.pc.close();
      }
    } catch (e) { console.warn(e) }
    this.pc = null;
    this.remoteStream = null;
    if (this.remoteStreamCallback) this.remoteStreamCallback(null);
    this.localStream = null;
    this.pendingRemoteCandidates = []; // CLEAR queued candidates
    this.currentConversationId = null;
    this.currentPeerUserId = null;
    this.isCaller = false;
  }
}

export const callService = new CallService();
