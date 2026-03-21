from django import forms

class ContactForm(forms.Form):
    name = forms.CharField(
        max_length=100,
        widget=forms.TextInput(attrs={
            'placeholder': 'Tu nombre',
            'autocomplete': 'name',
        })
    )
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'placeholder': 'tu@email.com',
            'autocomplete': 'email',
        })
    )
    message = forms.CharField(
        widget=forms.Textarea(attrs={
            'placeholder': '¿En qué puedo ayudarte?',
            'rows': 5,
        })
    )