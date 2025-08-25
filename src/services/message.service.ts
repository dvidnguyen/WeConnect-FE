import { socketService } from './socket.service';

class MessageService {
  private messageReceivedCallback?: (data: unknown) => void;

  constructor() {
    this.setupMessageListeners();
  }

  private setupMessageListeners() {
    socketService.on('message', (data: unknown) => {
      this.messageReceivedCallback?.(data);
    });
  }

  onMessageReceived(callback: (data: unknown) => void) {
    this.messageReceivedCallback = callback;
  }
}

export const messageService = new MessageService();