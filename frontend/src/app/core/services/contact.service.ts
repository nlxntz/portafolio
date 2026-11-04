import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  website?: string; // Honeypot antispam
  is_read?: number;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  sendMessage(message: ContactMessage): Observable<any> {
    return this.http.post(`${this.apiUrl}/contact`, message);
  }

  getAdminMessages(): Observable<{ status: string; data: ContactMessage[] }> {
    return this.http.get<{ status: string; data: ContactMessage[] }>(`${this.apiUrl}/admin/messages`);
  }

  toggleRead(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/admin/messages/${id}/toggle-read`, {});
  }

  deleteMessage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/messages/${id}`);
  }
}
