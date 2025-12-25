// src/js/animations.js
export function initAnimations() {
    
    // 1. ANIMACIÓN DE APARICIÓN (Scroll)
    const elementosAnimados = document.querySelectorAll(".animate-on-scroll");
    const observador = new IntersectionObserver(entradas => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("is-visible");
                observador.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.1 });
    elementosAnimados.forEach(el => observador.observe(el));

    // 2. LIGHTBOX CON DELEGACIÓN
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");

    document.addEventListener("click", (e) => {
        // Detectar clic en cualquier imagen
        if (e.target.classList.contains("imagen")) {
            if (lightbox && lightboxImg) {
                lightboxImg.src = e.target.src;
                lightbox.classList.add("active");
                document.body.style.overflow = "hidden"; 

                lightboxImg.classList.remove("efecto-abrir");
                void lightboxImg.offsetWidth; 
                lightboxImg.classList.add("efecto-abrir");
            }
        }

        // Cerrar al hacer clic en el fondo del lightbox
        if (e.target.id === "lightbox") {
            lightbox.classList.remove("active");
            document.body.style.overflow = ""; 
        }
    });
}

// Mantener el reproductor global
window.togglePlay = function(id, btn) {
    const audio = document.getElementById(id);
    if (!audio) return;

    const icon = btn.querySelector('.icon');
    const progressBar = btn.parentElement.querySelector('.progress-bar');

    if (audio.paused) {
        audio.play();
        icon.textContent = '⏸';
    } else {
        audio.pause();
        icon.textContent = '▶';
    }

    audio.ontimeupdate = () => {
        const percentage = (audio.currentTime / audio.duration) * 100;
        if (progressBar) progressBar.style.width = percentage + '%';
    };
    
    audio.onended = () => {
        icon.textContent = '▶';
        if (progressBar) progressBar.style.width = '0%';
    };
}; 

