import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Project {
  id?: number;
  title: string;
  slug: string;
  category: string;
  summary: string;
  description: string;
  tech_stack: string;
  tech_list?: string[];
  image_url?: string;
  github_url?: string;
  live_url?: string;
  is_featured: number | boolean;
  sort_order: number;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Métodos Públicos
  getProjects(category?: string, featured?: boolean): Observable<{ status: string; data: Project[] }> {
    let params = new HttpParams();
    if (category && category !== 'all') {
      params = params.set('category', category);
    }
    if (featured !== undefined) {
      params = params.set('featured', featured ? '1' : '0');
    }

    return this.http.get<{ status: string; data: Project[] }>(`${this.apiUrl}/projects`, { params });
  }

  getProject(slugOrId: string | number): Observable<{ status: string; data: Project }> {
    return this.http.get<{ status: string; data: Project }>(`${this.apiUrl}/projects/${slugOrId}`);
  }

  // Métodos Administrativos (Protegidos con JWT vía Interceptor)
  createProject(project: Partial<Project>): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/projects`, project);
  }

  updateProject(id: number, project: Partial<Project>): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/projects/${id}`, project);
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/projects/${id}`);
  }

  uploadImage(file: File): Observable<{ status: string; image_url: string; filename: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<{ status: string; image_url: string; filename: string }>(
      `${this.apiUrl}/admin/projects/upload`,
      formData
    );
  }
}
