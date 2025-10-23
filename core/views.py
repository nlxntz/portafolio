from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.core.mail import EmailMessage
from django.contrib import messages
from core.models import Project
from .forms import ContactForm

def home(request):
    return render(request, 'core/home.html')

def about(request):
    return render(request, 'core/about.html')

def projects(request):
    projects = Project.objects.all().order_by('-created_at')
    return render(request, 'core/projects.html', {'projects': projects})

def contact(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            name = form.cleaned_data['name']
            email = form.cleaned_data['email']
            message = form.cleaned_data['message']

            email_message = EmailMessage(
                subject=f"Nuevo mensaje de contacto de {name}",
                body=f"Nombre: {name}\nCorreo: {email}\n\nMensaje:\n{message}",
                from_email=email,
                to=['lintznicolas2@gmail.com'],
                reply_to=[email]
            )
            email_message.send()

            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({'status': 'ok', 'message': '¡Tu mensaje fue enviado correctamente!'})
        else:
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({'status': 'error', 'message': 'Por favor completa todos los campos correctamente.'})
    
    return render(request, 'core/contact.html', {'form': ContactForm()})