document.addEventListener("DOMContentLoaded", () => {
    const reveals = document.querySelectorAll(
        ".reveal, .reveal-left, .reveal-right, .reveal-stagger"
    );

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                }
            });
        },
        {
            threshold: 0.15,
        }
    );

    reveals.forEach((el) => observer.observe(el));
});