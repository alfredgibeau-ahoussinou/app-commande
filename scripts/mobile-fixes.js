// Gestion des problèmes mobiles courants
const MobileFixes = {
    // Correction du viewport sur iOS
    fixViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        window.addEventListener('resize', () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        });
    },

    // Correction du scroll lors de l'ouverture du clavier
    fixKeyboardScroll() {
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                setTimeout(() => {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });
        });
    },

    // Désactiver le zoom sur les inputs
    preventInputZoom() {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1, maximum-scale=1';
        document.head.appendChild(meta);
    },

    // Correction des événements tactiles
    fixTouchEvents() {
        document.addEventListener('touchstart', function() {}, {passive: true});
    },

    // Correction des problèmes de défilement
    fixScrolling() {
        document.body.addEventListener('touchmove', function(e) {
            if (e.target.closest('.scrollable')) return;
            e.preventDefault();
        }, { passive: false });
    },

    // Initialisation
    init() {
        this.fixViewportHeight();
        this.fixKeyboardScroll();
        this.preventInputZoom();
        this.fixTouchEvents();
        this.fixScrolling();
    }
};

// Initialiser les corrections
document.addEventListener('DOMContentLoaded', () => {
    MobileFixes.init();
}); 