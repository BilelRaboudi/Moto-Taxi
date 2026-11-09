import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface WebSocketMessage {
  event: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private ws: WebSocket | null = null;
  private messages$ = new Subject<WebSocketMessage>();
  private reconnectTimeout: any;
  private isConnecting = false;

  connect(token?: string): void {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.isConnecting = true;
    
    // Auto-detect host for phone and desktop (uses current hostname if available)
    let wsEndpoint = environment.wsUrl;
    if (typeof window !== 'undefined' && window.location) {
      const host = window.location.hostname || 'localhost';
      wsEndpoint = `ws://${host}:8080/ws/realtime`;
    }

    try {
      this.ws = new WebSocket(wsEndpoint);

      this.ws.onopen = () => {
        console.log('[WebSocket Spring Boot] Connecté à', wsEndpoint);
        this.isConnecting = false;

        // Auto identify user if logged in
        const stored = localStorage.getItem('mototaxi_user');
        if (stored) {
          try {
            const user = JSON.parse(stored);
            this.emit('user:identify', { userId: String(user.id), role: user.role });
          } catch {}
        }
      };

      this.ws.onmessage = (event: MessageEvent) => {
        try {
          const parsed: WebSocketMessage = JSON.parse(event.data);
          this.messages$.next(parsed);
        } catch (e) {
          console.warn('[WebSocket] Message non-JSON reçu:', event.data);
        }
      };

      this.ws.onclose = () => {
        console.log('[WebSocket Spring Boot] Déconnecté');
        this.isConnecting = false;
        this.ws = null;
        // Auto-reconnect after 3s
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = setTimeout(() => this.connect(), 3000);
      };

      this.ws.onerror = (err) => {
        console.warn('[WebSocket Spring Boot] Erreur de connexion');
        this.ws?.close();
      };
    } catch (e) {
      console.error('[WebSocket] Impossible de se connecter:', e);
      this.isConnecting = false;
    }
  }

  disconnect(): void {
    clearTimeout(this.reconnectTimeout);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  emit(eventName: string, data: any): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.connect();
      // Retry send once open
      setTimeout(() => this.emit(eventName, data), 250);
      return;
    }

    const payload: WebSocketMessage = { event: eventName, data };
    this.ws.send(JSON.stringify(payload));
  }

  listen<T>(eventName: string): Observable<T> {
    this.connect();
    return this.messages$.pipe(
      filter((msg) => msg.event === eventName),
      map((msg) => msg.data as T)
    );
  }
}
