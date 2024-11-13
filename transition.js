function initPageTransitions() {
    const transitionElement = document.createElement('div');
    transitionElement.className = 'page-transition';
    document.body.appendChild(transitionElement);

    function startTransition(href) {
        transitionElement.classList.add('active');
        setTimeout(() => {
            window.location.href = href;
        }, 500); // Durée de l'animation
    }

    // Intercepter tous les clics sur les liens
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link) {
            e.preventDefault();
            startTransition(link.href);
        }
    });

    // Intercepter les redirections JavaScript
    const originalPushState = history.pushState;
    history.pushState = function() {
        startTransition(arguments[2]);
        return originalPushState.apply(this, arguments);
    };
}

// Ajouter l'animation de sortie quand l'utilisateur quitte la page
window.addEventListener('pageshow', function(event) {
    const transitionElement = document.querySelector('.page-transition');
    if (transitionElement) {
        transitionElement.classList.remove('active');
    }
});

document.addEventListener('DOMContentLoaded', initPageTransitions); 