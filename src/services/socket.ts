class SocketService {
  private ws: WebSocket | null = null;
  private url: string = "ws://20.75.167.214:8080";
  private conversationId: string | null = null;
  private token: string | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;

  constructor() {
    this.listeners = new Map();
  }

  /**
   * Connect to WebSocket server for a specific conversation
   * @param conversationId - The conversation ID to connect to
   * @param token - JWT token for authentication
   */
  connect(conversationId: string, token: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      return;
    }

    if (this.isConnecting) {
      console.log("WebSocket connection in progress...");
      return;
    }

    this.isConnecting = true;
    this.conversationId = conversationId;
    this.token = token;

    const wsUrl = `${this.url}/ws/messages/conversations/${conversationId}`;
    console.log(`Connecting to WebSocket: ${wsUrl}`);

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log("WebSocket connected ✅");
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.emit("connect", { conversationId });

        // Send auth token
        if (this.token) {
          this.sendMessage("auth", { token: this.token });
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("WebSocket message received:", data);

          // Forward to listeners
          if (data.type) {
            this.emit(data.type, data.payload);
          } else {
            this.emit("message", data);
          }
        } catch (e) {
          console.error("Failed to parse WebSocket message:", event.data);
        }
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.isConnecting = false;
        this.emit("error", error);
      };

      this.ws.onclose = () => {
        console.log("WebSocket disconnected");
        this.isConnecting = false;
        this.emit("disconnect", { conversationId });
        this.attemptReconnect();
      };
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
      this.isConnecting = false;
      this.attemptReconnect();
    }
  }

  /**
   * Attempt to reconnect with exponential backoff
   */
  private attemptReconnect() {
    if (
      this.reconnectAttempts < this.maxReconnectAttempts &&
      this.conversationId &&
      this.token
    ) {
      this.reconnectAttempts++;
      const delay =
        this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1);
      console.log(
        `Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
      );

      setTimeout(() => {
        this.connect(this.conversationId!, this.token!);
      }, delay);
    }
  }

  /**
   * Send a message through WebSocket
   */
  sendMessage(type: string, payload: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ type, payload, timestamp: Date.now() });
      console.log("Sending WebSocket message:", message);
      this.ws.send(message);
    } else {
      console.warn("WebSocket not connected. Message not sent:", {
        type,
        payload,
      });
    }
  }

  /**
   * Emit event to all listeners
   */
  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  /**
   * Register event listener
   */
  on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.off(event, callback);
    };
  }

  /**
   * Remove event listener
   */
  off(event: string, callback?: (data: any) => void) {
    if (!callback) {
      this.listeners.delete(event);
    } else {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        callbacks.delete(callback);
      }
    }
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.conversationId = null;
    this.token = null;
    this.reconnectAttempts = 0;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Get connection status
   */
  getStatus() {
    return {
      connected: this.isConnected(),
      conversationId: this.conversationId,
      reconnectAttempts: this.reconnectAttempts,
      readyState: this.ws?.readyState,
    };
  }
}

export default new SocketService();
