import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardStats {
  total_projects: number;
  featured_projects: number;
  total_messages: number;
  unread_messages: number;
  latest_messages: any[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getStats(): Observable<{ status: string; data: DashboardStats }> {
    return this.http.get<{ status: string; data: DashboardStats }>(`${this.apiUrl}/admin/dashboard`);
  }
}
