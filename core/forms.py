from django import forms

class ContactForm(forms.Form):
    name = forms.CharField(
        widget=forms.TextInput(attrs={
            "class": "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-300",
            "placeholder": "Tu nombre"
        })
    )

    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            "class": "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-300",
            "placeholder": "Tu email"
        })
    )

    message = forms.CharField(
        widget=forms.Textarea(attrs={
            "class": "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-300 resize-none",
            "rows": 4,
            "placeholder": "Tu mensaje"
        })
    )