import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket | null = null;

  connect(token?: string): void {
    if (this.socket && this.socket.connected) return;

    this.socket = io(environment.socketUrl, {
      auth: { token: token || localStorage.getItem('mototaxi_token') },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Socket connected with ID:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(eventName: string, data: any): void {
    if (!this.socket) this.connect();
    this.socket?.emit(eventName, data);
  }

  listen<T>(eventName: string): Observable<T> {
    if (!this.socket) this.connect();
    return new Observable<T>((observer) => {
      this.socket?.on(eventName, (data: T) => {
        observer.next(data);
      });
      return () => {
        this.socket?.off(eventName);
      };
    });
  }
}
