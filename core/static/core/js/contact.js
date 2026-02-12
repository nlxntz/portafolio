document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const btn = document.getElementById('submitBtn');
    const toastContainer = document.getElementById('toastContainer');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        btn.disabled = true;
        btn.innerHTML = `
            <span class="flex items-center gap-2">
                <svg class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z">
                    </path>
                </svg>
                Enviando...
            </span>
        `;

        const formData = new FormData(form);
        const url = form.dataset.url;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
                body: formData
            });
            const result = await response.json();

            if (result.status === 'ok') {
                showToast('Mensaje enviado correctamente', 'success');
                form.reset();
            } else {
                showToast(result.message || 'Error al enviar el mensaje', 'error');
            }
        } catch (error) {
                showToast('Hubo un error al enviar el mensaje.', 'error');
        }

        btn.disabled = false;
        btn.innerHTML = "Enviar Mensaje";
    });

    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `
            toast-enter
            grid grid-cols-[auto_1fr_auto]
            items-center
            min-w-[340px] max-w-[380px]
            px-6 py-4 rounded-lg shadow-lg
            text-white font-semibold
            ${type === 'success'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                : 'bg-gradient-to-r from-red-500 to-rose-600'}
        `;

        const icon = document.createElement('span');
        icon.className = 'text-xl';
        icon.textContent = type === 'success' ? '✅' : '❌';

        const text = document.createElement('span');
        text.className = 'text-center leading-snug';
        text.textContent = message;

        const spacer = document.createElement('span');
        spacer.className = 'text-xl opacity-0';
        spacer.textContent = icon.textContent;

        toast.appendChild(icon);
        toast.appendChild(text);
        toast.appendChild(spacer);

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.replace('toast-enter', 'toast-exit');
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    }
});