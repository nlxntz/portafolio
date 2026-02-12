document.addEventListener('DOMContentLoaded', () => {
    const reveals = document.querySelectorAll('.reveal');
    const homeContent = document.querySelector('#home .max-w-3xl');

    function handleScroll() {
        const scrollPos = window.scrollY;

        reveals.forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });

        if (homeContent) {
            homeContent.style.transform = `translateY(${scrollPos * 0.15}px)`;
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Llamada inicial
});