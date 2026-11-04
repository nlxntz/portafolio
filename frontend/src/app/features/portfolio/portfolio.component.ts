import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProjectService, Project } from '../../core/services/project.service';
import { ContactService, ContactMessage } from '../../core/services/contact.service';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './portfolio.component.html'
})
export class PortfolioComponent implements OnInit {
  // Estado reactivo con Signals
  projects = signal<Project[]>([]);
  activeCategory = signal<string>('all');
  searchQuery = signal<string>('');
  selectedProject = signal<Project | null>(null);
  isLoadingProjects = signal<boolean>(true);

  // Categorías de filtrado
  categories = [
    { id: 'all', label: 'Todos' },
    { id: 'Full Stack', label: 'Full Stack' },
    { id: 'ERP & Gestión', label: 'ERP & Gestión' },
    { id: 'Inteligencia Artificial', label: 'Inteligencia Artificial' },
    { id: 'Visión Artificial', label: 'Visión Artificial' }
  ];

  // Proyectos filtrados reactivamente por categoría Y búsqueda
  filteredProjects = computed(() => {
    const cat = this.activeCategory().toLowerCase();
    const query = this.searchQuery().trim().toLowerCase();
    const list = this.projects();

    return list.filter(p => {
      const matchesCat = cat === 'all' || p.category?.toLowerCase() === cat;
      const matchesQuery = !query ||
        p.title.toLowerCase().includes(query) ||
        p.summary?.toLowerCase().includes(query) ||
        p.tech_stack?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query);

      return matchesCat && matchesQuery;
    });
  });

  // Estado del formulario de contacto
  contactForm: ContactMessage = {
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '' // honeypot
  };
  isSubmitting = signal<boolean>(false);
  submitSuccess = signal<string | null>(null);
  submitError = signal<string | null>(null);

  // Toast Notification Flotante
  toast = signal<{ text: string; type: 'success' | 'error' } | null>(null);

  // Animación Typewriter con su rol actual en el Hospital Base de Valdivia
  typewriterTitles = [
    'Desarrollador en Hospital Base de Valdivia',
    'Full Stack Engineer (PHP & Angular)',
    'Especialista en Sistemas Críticos & ERPs',
    'Ingeniero en Informática'
  ];
  currentTypewriterText = signal<string>('Desarrollador en Hospital Base de Valdivia');
  private typeIndex = 0;
  private charIndex = 0;
  private isDeleting = false;

  constructor(
    private projectService: ProjectService,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
    this.startTypewriter();
  }

  loadProjects(): void {
    this.isLoadingProjects.set(true);
    this.projectService.getProjects().subscribe({
      next: (res) => {
        this.projects.set(res.data);
        this.isLoadingProjects.set(false);
      },
      error: () => {
        this.isLoadingProjects.set(false);
      }
    });
  }

  setCategory(cat: string): void {
    this.activeCategory.set(cat);
  }

  onSearchChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
  }

  openProjectModal(project: Project): void {
    this.selectedProject.set(project);
  }

  closeProjectModal(): void {
    this.selectedProject.set(null);
  }

  showToast(text: string, type: 'success' | 'error'): void {
    this.toast.set({ text, type });
    setTimeout(() => {
      this.toast.set(null);
    }, 4500);
  }

  submitContact(): void {
    if (!this.contactForm.name || !this.contactForm.email || !this.contactForm.message) {
      this.submitError.set('Por favor completa todos los campos obligatorios.');
      this.showToast('Por favor completa todos los campos obligatorios.', 'error');
      return;
    }

    this.isSubmitting.set(true);
    this.submitSuccess.set(null);
    this.submitError.set(null);

    this.contactService.sendMessage(this.contactForm).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        const msg = res.message || '¡Gracias! Tu mensaje fue recibido correctamente.';
        this.submitSuccess.set(msg);
        this.showToast(msg, 'success');
        this.contactForm = { name: '', email: '', subject: '', message: '', website: '' };
      },
      error: (err) => {
        this.isSubmitting.set(false);
        const errorMsg = err.error?.message || 'Hubo un error al enviar tu mensaje. Inténtalo de nuevo.';
        this.submitError.set(errorMsg);
        this.showToast(errorMsg, 'error');
      }
    });
  }

  private startTypewriter(): void {
    const typeSpeed = () => {
      const currentFullText = this.typewriterTitles[this.typeIndex];

      if (this.isDeleting) {
        this.charIndex--;
        this.currentTypewriterText.set(currentFullText.substring(0, this.charIndex));
      } else {
        this.charIndex++;
        this.currentTypewriterText.set(currentFullText.substring(0, this.charIndex));
      }

      let speed = this.isDeleting ? 35 : 75;

      if (!this.isDeleting && this.charIndex === currentFullText.length) {
        speed = 2200; // pausa al terminar la frase
        this.isDeleting = true;
      } else if (this.isDeleting && this.charIndex === 0) {
        this.isDeleting = false;
        this.typeIndex = (this.typeIndex + 1) % this.typewriterTitles.length;
        speed = 400;
      }

      setTimeout(typeSpeed, speed);
    };

    setTimeout(typeSpeed, 800);
  }
}
