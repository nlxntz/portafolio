document.addEventListener('DOMContentLoaded', () => {
    const form          = document.getElementById('contactForm');
    const btn           = document.getElementById('submitBtn');
    const btnText       = document.getElementById('btnText');
    const toastContainer = document.getElementById('toastContainer');

    if (!form) return;

    // ── Submit ────────────────────────────────────────────────
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(form);
        const url      = form.dataset.url;

        try {
            const res    = await fetch(url, {
                method:  'POST',
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
                body:    formData,
            });
            const result = await res.json();

            if (result.status === 'ok') {
                showToast('Mensaje enviado correctamente', 'success');
                form.reset();
            } else {
                showToast(result.message || 'Error al enviar el mensaje', 'error');
            }
        } catch {
            showToast('Hubo un error. Intenta de nuevo.', 'error');
        }

        setLoading(false);
    });

    // ── Estado del botón ─────────────────────────────────────
    function setLoading(loading) {
        btn.disabled = loading;
        if (loading) {
            btnText.innerHTML = `
                <svg class="spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                Enviando...
            `;
        } else {
            btnText.innerHTML = `
                Enviar mensaje
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
            `;
        }
    }

    // ── Toast ────────────────────────────────────────────────
    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} toast-enter`;

        const dot = document.createElement('span');
        dot.className = 'toast-icon';

        const text = document.createElement('span');
        text.textContent = message;

        toast.appendChild(dot);
        toast.appendChild(text);
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.replace('toast-enter', 'toast-exit');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }
});