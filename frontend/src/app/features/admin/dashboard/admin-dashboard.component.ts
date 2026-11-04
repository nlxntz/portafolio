import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ProjectService, Project } from '../../../core/services/project.service';
import { ContactService, ContactMessage } from '../../../core/services/contact.service';
import { DashboardService, DashboardStats } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-dark-950 text-gray-200">
      <!-- Barra superior -->
      <header class="h-16 border-b border-white/5 bg-dark-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <div class="flex items-center gap-4">
          <a routerLink="/" class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors">
            ← Ver Sitio Público
          </a>
          <span class="text-sm font-bold text-white">Panel CMS — Portafolio</span>
        </div>

        <div class="flex items-center gap-4">
          <span class="text-xs text-gray-400 font-mono hidden sm:inline">{{ authService.currentUser()?.email }}</span>
          <button (click)="logout()" class="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/20 transition-colors">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main class="max-w-6xl mx-auto p-6 space-y-8">
        <!-- Métricas Rápidas -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="card-glow p-5">
            <span class="text-xs font-mono text-purple-400">Proyectos Totales</span>
            <div class="text-3xl font-extrabold text-white mt-1">{{ stats()?.total_projects ?? 0 }}</div>
          </div>
          <div class="card-glow p-5">
            <span class="text-xs font-mono text-indigo-400">Proyectos Destacados</span>
            <div class="text-3xl font-extrabold text-white mt-1">{{ stats()?.featured_projects ?? 0 }}</div>
          </div>
          <div class="card-glow p-5">
            <span class="text-xs font-mono text-cyan-400">Total Mensajes</span>
            <div class="text-3xl font-extrabold text-white mt-1">{{ stats()?.total_messages ?? 0 }}</div>
          </div>
          <div class="card-glow p-5">
            <span class="text-xs font-mono text-amber-400">Mensajes sin Leer</span>
            <div class="text-3xl font-extrabold text-amber-300 mt-1">{{ stats()?.unread_messages ?? 0 }}</div>
          </div>
        </div>

        <!-- Navegación de pestañas -->
        <div class="flex border-b border-white/10 gap-6">
          <button
            (click)="currentTab.set('projects')"
            [class]="currentTab() === 'projects' ? 'border-b-2 border-brand-purple text-white font-bold' : 'text-gray-400 hover:text-white'"
            class="pb-3 text-sm transition-colors flex items-center gap-2">
            <span>Gestor de Proyectos</span>
            <span class="text-xs px-2 py-0.5 rounded-full bg-white/10">{{ projects().length }}</span>
          </button>
          <button
            (click)="currentTab.set('messages')"
            [class]="currentTab() === 'messages' ? 'border-b-2 border-brand-purple text-white font-bold' : 'text-gray-400 hover:text-white'"
            class="pb-3 text-sm transition-colors flex items-center gap-2">
            <span>Bandeja de Contacto</span>
            @if (stats()?.unread_messages) {
              <span class="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {{ stats()?.unread_messages }} nuevos
              </span>
            }
          </button>
        </div>

        <!-- ========================================== -->
        <!-- TAB 1: PROYECTOS -->
        <!-- ========================================== -->
        @if (currentTab() === 'projects') {
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-bold text-white">Listado de Proyectos</h3>
                <p class="text-xs text-gray-400">Administra los casos de estudio publicados en tu portafolio</p>
              </div>
              <button
                (click)="openProjectModal()"
                class="px-4 py-2.5 rounded-xl text-xs font-semibold bg-brand-purple hover:bg-purple-500 text-white shadow-glow-purple transition-all flex items-center gap-2">
                <span>+</span> Nuevo Proyecto
              </button>
            </div>

            <div class="card-glow overflow-hidden">
              <table class="w-full text-left text-xs text-gray-300">
                <thead class="bg-white/[0.03] text-gray-400 font-mono uppercase text-[11px] border-b border-white/5">
                  <tr>
                    <th class="p-4">Título</th>
                    <th class="p-4">Categoría</th>
                    <th class="p-4">Tecnologías</th>
                    <th class="p-4 text-center">Destacado</th>
                    <th class="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                  @for (p of projects(); track p.id) {
                    <tr class="hover:bg-white/[0.02] transition-colors">
                      <td class="p-4 font-semibold text-white">{{ p.title }}</td>
                      <td class="p-4 font-mono text-purple-400">{{ p.category }}</td>
                      <td class="p-4 max-w-xs truncate">{{ p.tech_stack }}</td>
                      <td class="p-4 text-center">
                        <span [class]="p.is_featured ? 'text-emerald-400' : 'text-gray-600'">
                          {{ p.is_featured ? '✓ Sí' : '— No' }}
                        </span>
                      </td>
                      <td class="p-4 text-right space-x-2">
                        <button (click)="openProjectModal(p)" class="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white transition-colors">
                          Editar
                        </button>
                        <button (click)="deleteProject(p.id!)" class="px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors">
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="5" class="p-8 text-center text-gray-500">
                        No hay proyectos registrados en la base de datos.
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        <!-- ========================================== -->
        <!-- TAB 2: MENSAJES DE CONTACTO -->
        <!-- ========================================== -->
        @if (currentTab() === 'messages') {
          <div class="space-y-4">
            <h3 class="text-lg font-bold text-white">Mensajes Recibidos</h3>

            <div class="space-y-3">
              @for (msg of messages(); track msg.id) {
                <div class="card-glow p-5 flex flex-col sm:flex-row justify-between gap-4" [class.border-purple-500]="!msg.is_read">
                  <div class="space-y-1.5 flex-1">
                    <div class="flex items-center gap-3">
                      <span class="font-bold text-white text-sm">{{ msg.name }}</span>
                      <a [href]="'mailto:' + msg.email" class="text-xs text-purple-400 font-mono hover:underline">{{ msg.email }}</a>
                      <span class="text-xs text-gray-500 font-mono">{{ msg.created_at }}</span>
                      @if (!msg.is_read) {
                        <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">NUEVO</span>
                      }
                    </div>
                    @if (msg.subject) {
                      <div class="text-xs font-semibold text-gray-300">Asunto: {{ msg.subject }}</div>
                    }
                    <p class="text-xs text-gray-400 leading-relaxed bg-white/[0.02] p-3 rounded-lg border border-white/5">
                      {{ msg.message }}
                    </p>
                  </div>

                  <div class="flex sm:flex-col justify-end gap-2 shrink-0">
                    <button
                      (click)="toggleMessageRead(msg.id!)"
                      class="px-3 py-1.5 rounded-lg text-xs bg-white/5 hover:bg-white/10 text-gray-300 transition-colors">
                      {{ msg.is_read ? 'Marcar no leído' : 'Marcar leído' }}
                    </button>
                    <button
                      (click)="deleteMessage(msg.id!)"
                      class="px-3 py-1.5 rounded-lg text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors">
                      Eliminar
                    </button>
                  </div>
                </div>
              } @empty {
                <div class="card-glow p-12 text-center text-gray-500 text-sm">
                  No hay mensajes de contacto todavía.
                </div>
              }
            </div>
          </div>
        }

        <!-- ========================================== -->
        <!-- MODAL: CREAR / EDITAR PROYECTO -->
        <!-- ========================================== -->
        @if (isProjectModalOpen()) {
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md">
            <div class="card-glow max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto border-purple-500/40">
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-bold text-white">{{ editingProject?.id ? 'Editar Proyecto' : 'Nuevo Proyecto' }}</h3>
                <button (click)="closeProjectModal()" class="text-gray-400 hover:text-white">✕</button>
              </div>

              <form (ngSubmit)="saveProject()" class="space-y-4 text-xs">
                <div class="space-y-1">
                  <label class="text-gray-400 font-mono">TÍTULO *</label>
                  <input type="text" required [(ngModel)]="editingProject.title" name="title" class="w-full px-3 py-2 rounded-lg bg-dark-900 border border-white/10 text-white text-sm">
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div class="space-y-1">
                    <label class="text-gray-400 font-mono">CATEGORÍA</label>
                    <input type="text" [(ngModel)]="editingProject.category" name="category" placeholder="Full Stack, ERP & Gestión..." class="w-full px-3 py-2 rounded-lg bg-dark-900 border border-white/10 text-white">
                  </div>
                  <div class="space-y-1">
                    <label class="text-gray-400 font-mono">SLUG (URL)</label>
                    <input type="text" [(ngModel)]="editingProject.slug" name="slug" placeholder="mi-proyecto-web" class="w-full px-3 py-2 rounded-lg bg-dark-900 border border-white/10 text-white">
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-gray-400 font-mono">TECNOLOGÍAS (separadas por coma)</label>
                  <input type="text" [(ngModel)]="editingProject.tech_stack" name="tech_stack" placeholder="PHP 8, CodeIgniter 4, Angular, MySQL" class="w-full px-3 py-2 rounded-lg bg-dark-900 border border-white/10 text-white">
                </div>

                <div class="space-y-1">
                  <label class="text-gray-400 font-mono">RESUMEN CORTO</label>
                  <input type="text" [(ngModel)]="editingProject.summary" name="summary" class="w-full px-3 py-2 rounded-lg bg-dark-900 border border-white/10 text-white">
                </div>

                <div class="space-y-1">
                  <label class="text-gray-400 font-mono">DESCRIPCIÓN COMPLETA / CASO DE ESTUDIO</label>
                  <textarea rows="4" [(ngModel)]="editingProject.description" name="description" class="w-full px-3 py-2 rounded-lg bg-dark-900 border border-white/10 text-white"></textarea>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div class="space-y-1">
                    <label class="text-gray-400 font-mono">URL REPOSITORIO GITHUB</label>
                    <input type="url" [(ngModel)]="editingProject.github_url" name="github_url" placeholder="https://github.com/..." class="w-full px-3 py-2 rounded-lg bg-dark-900 border border-white/10 text-white">
                  </div>
                  <div class="space-y-1">
                    <label class="text-gray-400 font-mono">URL DEMO EN VIVO</label>
                    <input type="url" [(ngModel)]="editingProject.live_url" name="live_url" placeholder="https://..." class="w-full px-3 py-2 rounded-lg bg-dark-900 border border-white/10 text-white">
                  </div>
                </div>

                <div class="flex items-center gap-6 pt-2">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" [(ngModel)]="editingProject.is_featured" name="is_featured" class="rounded bg-dark-900 border-white/10">
                    <span class="text-gray-300">Marcar como Proyecto Destacado</span>
                  </label>
                </div>

                <div class="pt-4 border-t border-white/10 flex justify-end gap-3">
                  <button type="button" (click)="closeProjectModal()" class="px-4 py-2 rounded-lg text-gray-400 hover:text-white">
                    Cancelar
                  </button>
                  <button type="submit" class="px-5 py-2 rounded-lg font-bold bg-brand-purple hover:bg-purple-500 text-white shadow-glow-purple">
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        }

      </main>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  currentTab = signal<'projects' | 'messages'>('projects');
  stats = signal<DashboardStats | null>(null);
  projects = signal<Project[]>([]);
  messages = signal<ContactMessage[]>([]);

  isProjectModalOpen = signal<boolean>(false);
  editingProject: Partial<Project> = {};

  constructor(
    public authService: AuthService,
    private projectService: ProjectService,
    private contactService: ContactService,
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.dashboardService.getStats().subscribe({
      next: (res) => this.stats.set(res.data)
    });

    this.projectService.getProjects().subscribe({
      next: (res) => this.projects.set(res.data)
    });

    this.contactService.getAdminMessages().subscribe({
      next: (res) => this.messages.set(res.data)
    });
  }

  openProjectModal(project?: Project): void {
    this.editingProject = project ? { ...project } : {
      title: '',
      slug: '',
      category: 'Full Stack',
      summary: '',
      description: '',
      tech_stack: '',
      github_url: '',
      live_url: '',
      is_featured: 1,
      sort_order: 0
    };
    this.isProjectModalOpen.set(true);
  }

  closeProjectModal(): void {
    this.isProjectModalOpen.set(false);
  }

  saveProject(): void {
    if (this.editingProject.id) {
      this.projectService.updateProject(this.editingProject.id, this.editingProject).subscribe({
        next: () => {
          this.closeProjectModal();
          this.loadData();
        }
      });
    } else {
      this.projectService.createProject(this.editingProject).subscribe({
        next: () => {
          this.closeProjectModal();
          this.loadData();
        }
      });
    }
  }

  deleteProject(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este proyecto?')) {
      this.projectService.deleteProject(id).subscribe({
        next: () => this.loadData()
      });
    }
  }

  toggleMessageRead(id: number): void {
    this.contactService.toggleRead(id).subscribe({
      next: () => this.loadData()
    });
  }

  deleteMessage(id: number): void {
    if (confirm('¿Eliminar este mensaje?')) {
      this.contactService.deleteMessage(id).subscribe({
        next: () => this.loadData()
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
