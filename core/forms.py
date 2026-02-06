from django import forms

class ContactForm(forms.Form):
    name = forms.CharField(
        max_length=100,
        widget=forms.TextInput(attrs={
            'placeholder': 'Tu nombre',
            'class': 'w-full rounded-lg bg-[#2c0b5f]/60 border border-purple-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-custom-purple focus:border-custom-purple transition-all duration-300'
        })
    )
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'placeholder': 'Tu correo electrónico',
            'class': 'w-full rounded-lg bg-[#2c0b5f]/60 border border-purple-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-custom-purple focus:border-custom-purple transition-all duration-300'
        })
    )
    message = forms.CharField(
        widget=forms.Textarea(attrs={
            'placeholder': 'Escribe tu mensaje aquí...',
            'rows': 5,
            'class': 'w-full rounded-lg bg-[#2c0b5f]/60 border border-purple-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-custom-purple focus:border-custom-purple transition-all duration-300'
        })
    )