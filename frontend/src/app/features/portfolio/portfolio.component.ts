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
  selectedProject = signal<Project | null>(null);
  isLoadingProjects = signal<boolean>(true);

  // Categorías de filtrado
  categories = [
    { id: 'all', label: 'Todos' },
    { id: 'Full Stack', label: 'Full Stack' },
    { id: 'ERP & Gestión', label: 'ERP & Gestión' },
    { id: 'Inteligencia Artificial', label: 'Inteligencia Artificial' }
  ];

  // Proyectos filtrados de forma reactiva
  filteredProjects = computed(() => {
    const cat = this.activeCategory();
    const list = this.projects();
    if (cat === 'all') return list;
    return list.filter(p => p.category?.toLowerCase() === cat.toLowerCase());
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

  // Animación Typewriter
  typewriterTitles = ['Full Stack Developer', 'Ingeniero en Informática', 'Especialista en Backend & APIs', 'Arquitectura de Software'];
  currentTypewriterText = signal<string>('Full Stack Developer');
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

  openProjectModal(project: Project): void {
    this.selectedProject.set(project);
  }

  closeProjectModal(): void {
    this.selectedProject.set(null);
  }

  submitContact(): void {
    if (!this.contactForm.name || !this.contactForm.email || !this.contactForm.message) {
      this.submitError.set('Por favor completa los campos requeridos.');
      return;
    }

    this.isSubmitting.set(true);
    this.submitSuccess.set(null);
    this.submitError.set(null);

    this.contactService.sendMessage(this.contactForm).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.submitSuccess.set(res.message || '¡Mensaje enviado con éxito!');
        this.contactForm = { name: '', email: '', subject: '', message: '', website: '' };
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.submitError.set(err.error?.message || 'Hubo un error al enviar tu mensaje. Inténtalo de nuevo.');
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

      let speed = this.isDeleting ? 40 : 80;

      if (!this.isDeleting && this.charIndex === currentFullText.length) {
        speed = 2000; // pausa al terminar la palabra
        this.isDeleting = true;
      } else if (this.isDeleting && this.charIndex === 0) {
        this.isDeleting = false;
        this.typeIndex = (this.typeIndex + 1) % this.typewriterTitles.length;
        speed = 500;
      }

      setTimeout(typeSpeed, speed);
    };

    setTimeout(typeSpeed, 800);
  }
}
