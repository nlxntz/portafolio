import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-dark-950 flex items-center justify-center p-6 relative overflow-hidden">
      <!-- Glow decorativo -->
      <div class="absolute w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div class="card-glow max-w-md w-full p-8 space-y-6 relative z-10 border-purple-500/30 shadow-glow-purple">
        <div class="text-center space-y-2">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-indigo mx-auto flex items-center justify-center font-bold text-white shadow-glow-purple text-lg">
            NL
          </div>
          <h2 class="text-2xl font-bold text-white">Panel Administrativo</h2>
          <p class="text-xs text-gray-400">Inicia sesión para gestionar proyectos y mensajes</p>
        </div>

        @if (errorMessage()) {
          <div class="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center">
            {{ errorMessage() }}
          </div>
        }

        <form (ngSubmit)="onLogin()" class="space-y-4">
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-gray-300 font-mono">USUARIO O EMAIL</label>
            <input
              type="text"
              required
              [(ngModel)]="loginInput"
              name="login"
              placeholder="admin o lintznicolas2@gmail.com"
              class="w-full px-4 py-3 rounded-xl bg-dark-900 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 text-sm">
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-gray-300 font-mono">CONTRASEÑA</label>
            <input
              type="password"
              required
              [(ngModel)]="passwordInput"
              name="password"
              placeholder="••••••••"
              class="w-full px-4 py-3 rounded-xl bg-dark-900 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 text-sm">
          </div>

          <button
            type="submit"
            [disabled]="isLoading()"
            class="w-full py-3.5 rounded-xl font-bold text-sm bg-brand-purple hover:bg-purple-500 text-white transition-all shadow-glow-purple disabled:opacity-50 mt-2">
            @if (isLoading()) {
              Iniciando sesión...
            } @else {
              Entrar al Panel
            }
          </button>
        </form>

        <div class="text-center pt-2">
          <a routerLink="/" class="text-xs text-gray-500 hover:text-purple-400 transition-colors">
            ← Volver al sitio público
          </a>
        </div>
      </div>
    </div>
  `
})
export class AdminLoginComponent {
  loginInput = 'admin';
  passwordInput = '';
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    if (!this.loginInput || !this.passwordInput) {
      this.errorMessage.set('Ingresa tu usuario y contraseña.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login({ login: this.loginInput, password: this.passwordInput }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Usuario o contraseña incorrectos.');
      }
    });
  }
}
