document.addEventListener('DOMContentLoaded', function() {
    // Fonction réutilisable pour la transition
    function handleTransition(targetUrl) {
        const transitionElement = document.querySelector('.page-transition');
        if (transitionElement) {
            transitionElement.classList.add('active');
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 500);
        } else {
            window.location.href = targetUrl;
        }
    }

    // Gestion du bouton "Demander un service"
    const sendButton = document.querySelector('.cta-button.send');
    if (sendButton) {
        sendButton.addEventListener('click', function(e) {
            e.preventDefault();
            handleTransition('send-check.html');
        });
    }

    // Gestion du bouton "Rendre un service"
    const deliverButton = document.querySelector('.cta-button.deliver');
    if (deliverButton) {
        deliverButton.addEventListener('click', function(e) {
            e.preventDefault();
            handleTransition('account-check.html');
        });
    }

    // Gestion des liens de navigation
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && !link.hasAttribute('data-no-transition')) {
            e.preventDefault();
            handleTransition(link.href);
        }
    });
});