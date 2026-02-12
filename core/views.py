import logging

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.http import JsonResponse
from django.shortcuts import render
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from core.models import Project
from .forms import ContactForm

logger = logging.getLogger(__name__)

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

            context = {
                'name': name,
                'email': email,
                'message': message,
            }
            html_content = render_to_string('core/emails/contact_email.html', context)
            text_content = strip_tags(html_content)

            email_message = EmailMultiAlternatives(
                subject=f"Nuevo mensaje de contacto de {name}",
                body=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[settings.DEFAULT_FROM_EMAIL],
                reply_to=[email],
            )
            email_message.attach_alternative(html_content, "text/html")

            try:
                email_message.send()
            except Exception:
                logger.exception("No se pudo enviar el mensaje de contacto.")
                if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                    return JsonResponse({'status': 'error', 'message': 'No se pudo enviar el mensaje. Intenta más tarde.'})

            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({'status': 'ok', 'message': '¡Tu mensaje fue enviado correctamente!'})
        else:
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({'status': 'error', 'message': 'Por favor completa todos los campos correctamente.'})
    
    return render(request, 'core/contact.html', {'form': ContactForm()})