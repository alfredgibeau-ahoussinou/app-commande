document.addEventListener('DOMContentLoaded', () => {
    // Menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Gestion du modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    document.body.appendChild(modal);

    // Fonction pour ouvrir le modal
    function openModal(content) {
        modal.innerHTML = content;
        modal.style.display = 'flex';
    }

    // Fonction pour fermer le modal
    function closeModal() {
        modal.style.display = 'none';
        modal.innerHTML = '';
    }

    // Fermer le modal en cliquant en dehors
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Gestionnaire pour le bouton "Devenir livreur"
    const deliverButton = document.querySelector('.deliver');
    if (deliverButton) {
        deliverButton.addEventListener('click', () => {
            window.location.href = 'verification.html';
        });
    }

    // Gestionnaire pour le bouton "Envoyer un colis"
    const sendButton = document.querySelector('.send');
    if (sendButton) {
        sendButton.addEventListener('click', () => {
            window.location.href = 'send-package.html';
        });
    }

    // Gestion des soumissions de formulaire
    document.addEventListener('submit', (e) => {
        if (e.target.id === 'deliverForm' || e.target.id === 'sendForm') {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            console.log('Formulaire soumis:', Object.fromEntries(formData));
            
            // Afficher le message de succès
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.innerHTML = `
                    <div class="success-message">
                        <h3>Demande envoyée avec succès !</h3>
                        <p>Nous vous contacterons rapidement.</p>
                    </div>
                `;
                
                // Fermer le modal après 2 secondes
                setTimeout(closeModal, 2000);
            }
        }
    });

    // Animation des cartes au scroll
    const cards = document.querySelectorAll('.card');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        { threshold: 0.1 }
    );

    cards.forEach(card => observer.observe(card));

    // Ajout des particules
    function createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        
        // Créer 30 particules (moins pour de meilleures performances)
        for (let i = 0; i < 30; i++) {
            createParticle(particlesContainer);
        }
        
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.appendChild(particlesContainer);
        }
    }

    function createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Taille aléatoire entre 3 et 8 pixels
        const size = Math.random() * 5 + 3;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Position initiale aléatoire
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Définir la direction du mouvement
        const moveX = (Math.random() - 0.5) * 200;
        const moveY = (Math.random() - 0.5) * 200;
        particle.style.setProperty('--moveX', `${moveX}px`);
        particle.style.setProperty('--moveY', `${moveY}px`);
        
        // Durée et délai d'animation aléatoires
        particle.style.animation = `particleFloat ${Math.random() * 4 + 3}s ease-in-out infinite`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(particle);
        
        // Recréer la particule après son animation
        particle.addEventListener('animationend', () => {
            particle.remove();
            createParticle(container);
        });
    }

    // Fonction pour mettre à jour l'animation du fond
    function updateGradient() {
        const hero = document.querySelector('.hero');
        if (hero) {
            const scroll = window.pageYOffset;
            const heroHeight = hero.offsetHeight;
            const scrollPercentage = (scroll / heroHeight) * 100;
            
            hero.style.setProperty('--scroll', `${scrollPercentage}%`);
        }
    }

    // Animation des particules interactives
    function createInteractiveParticles() {
        const hero = document.querySelector('.hero');
        const particles = [];
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'interactive-particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 2}s`;
            hero.appendChild(particle);
            particles.push(particle);
        }

        // Interaction avec la souris
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            particles.forEach(particle => {
                const particleRect = particle.getBoundingClientRect();
                const particleX = particleRect.left - rect.left + particleRect.width / 2;
                const particleY = particleRect.top - rect.top + particleRect.height / 2;

                const deltaX = mouseX - particleX;
                const deltaY = mouseY - particleY;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

                if (distance < 100) {
                    const angle = Math.atan2(deltaY, deltaX);
                    const force = (100 - distance) / 100;
                    particle.style.transform = `translate(${Math.cos(angle) * force * 50}px, ${Math.sin(angle) * force * 50}px)`;
                } else {
                    particle.style.transform = '';
                }
            });
        });
    }

    // Animation des boutons
    const buttons = document.querySelectorAll('.cta-button');
    buttons.forEach(button => {
        button.addEventListener('mouseover', (e) => {
            const x = e.pageX - button.offsetLeft;
            const y = e.pageY - button.offsetTop;
            
            button.style.setProperty('--xPos', `${x}px`);
            button.style.setProperty('--yPos', `${y}px`);
        });
    });

    // Animation du titre
    const title = document.querySelector('.hero h1');
    title.innerHTML = title.textContent.split('').map(char => 
        `<span class="char">${char}</span>`
    ).join('');

    const chars = document.querySelectorAll('.char');
    chars.forEach((char, i) => {
        char.style.animationDelay = `${i * 0.1}s`;
    });

    // Initialisation
    document.addEventListener('DOMContentLoaded', () => {
        createParticles();
        window.addEventListener('scroll', updateGradient);
        createInteractiveParticles();
    });
});