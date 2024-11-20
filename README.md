# ExpressDelivery - Plateforme de Livraison

## 📦 À propos
ExpressDelivery est une plateforme web moderne qui connecte les utilisateurs avec des livreurs de confiance pour des services de livraison rapide et sécurisée. Notre solution offre une expérience utilisateur fluide et sécurisée, enrichie d'animations soignées.

## 🎨 Animations et Interactions

### Animations d'interface
- **Transitions de page**
  ```javascript
  // Exemple d'animation de transition
  gsap.to('.page-transition', {
    duration: 0.6,
    scaleY: 0,
    transformOrigin: 'top',
    ease: 'power4.inOut'
  });
  ```

- **Animations des boutons**
  ```css
  .button {
    transition: transform 0.3s ease;
  }
  .button:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
  ```

- **Animations de chargement**
  ```css
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  .loading {
    animation: pulse 1.5s infinite;
  }
  ```

### Effets visuels
- Parallax sur la page d'accueil
- Transitions fluides entre les étapes
- Animations des notifications
- Effets hover élaborés
- Micro-interactions

### Animations GSAP

### Animations GSAP
```javascript
// Animation du logo et du texte d'accueil
gsap.timeline()
    .from('.hero-logo', {
        duration: 1.2,
        y: -100,
        opacity: 0,
        ease: 'elastic.out'
    })
    .from('.logo-text', {
        duration: 0.8,
        opacity: 0,
        y: 20,
        stagger: 0.2
    })
    .from('.cta-buttons button', {
        duration: 0.6,
        opacity: 0,
        y: 30,
        stagger: 0.2,
        ease: 'back.out'
    });

// Animation du menu de navigation
const menuAnimation = gsap.timeline({ paused: true });
menuAnimation
    .to('.menu-overlay', {
        duration: 0.4,
        opacity: 1,
        visibility: 'visible'
    })
    .from('.menu-items li', {
        duration: 0.4,
        opacity: 0,
        y: 20,
        stagger: 0.1
    });
```

### Effets de scroll
```javascript
// Parallax sur la page d'accueil
gsap.to('.hero-background', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    },
    y: 200,
    ease: 'none'
});

// Apparition des éléments au scroll
ScrollTrigger.batch('.fade-in', {
    onEnter: batch => gsap.to(batch, {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.8
    }),
    start: 'top 80%'
});
```

### Micro-interactions
```css
/* Animation du bouton de suivi */
.tracking-button {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tracking-button:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Animation du chatbot */
.chatbot-toggle {
    animation: bounce 2s infinite;
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}
```

### Transitions de page
```javascript
// Transition fluide entre les pages
const pageTransition = {
    duration: 0.6,
    ease: 'power2.inOut',
    opacity: 0,
    scale: 0.98
};

barba.init({
    transitions: [{
        leave: data => gsap.to(data.current.container, pageTransition),
        enter: data => gsap.from(data.next.container, pageTransition)
    }]
});
```

## 🎯 Nouvelles fonctionnalités

### Mode sombre
```javascript
// Système de thème
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', 
        document.body.classList.contains('dark-mode') ? 'dark' : 'light'
    );
});
```

### Système de notifications
```javascript
class NotificationSystem {
    static async requestPermission() {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    static async sendNotification(title, options = {}) {
        if (await this.requestPermission()) {
            return new Notification(title, {
                icon: '/assets/icon.png',
                badge: '/assets/badge.png',
                ...options
            });
        }
    }
}
```

### Système de géolocalisation avancé
```javascript
class LocationTracker {
    constructor() {
        this.watchId = null;
        this.currentPosition = null;
    }

    startTracking() {
        if ("geolocation" in navigator) {
            this.watchId = navigator.geolocation.watchPosition(
                position => this.updatePosition(position),
                error => this.handleError(error),
                {
                    enableHighAccuracy: true,
                    maximumAge: 30000,
                    timeout: 27000
                }
            );
        }
    }

    updatePosition(position) {
        this.currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
        };
        this.emitPositionUpdate();
    }
}
```

## 🔄 Mises à jour à venir

### Version 2.0 (Q2 2024)
- Intelligence artificielle pour l'optimisation des itinéraires
- Système de récompenses et fidélité
- Application mobile native (iOS/Android)
- Support multilingue complet
- Intégration de la réalité augmentée pour la visualisation des colis

### Version 2.1 (Q3 2024)
- Paiement en cryptomonnaies
- Assistant vocal
- Mode hors ligne amélioré
- Système de parrainage
- Analytics avancés pour les livreurs

## 🚀 Fonctionnalités principales

### Pour les clients
- **Envoi de colis**
  - Interface intuitive en 4 étapes
  - Estimation des prix en temps réel
  - Choix des options de livraison
  - Photos et description du colis
  - Instructions spéciales pour la livraison

- **Suivi de livraison**
  - Carte interactive en temps réel
  - Notifications par SMS et email
  - Historique des statuts
  - ETA (temps estimé d'arrivée)
  - Partage du lien de suivi

- **Système de paiement**
  - Paiement sécurisé par carte
  - Support PayPal
  - Factures automatiques
  - Remboursement automatisé
  - Protection des achats

- **Communication**
  - Chat en direct avec le livreur
  - Notifications push
  - Assistance chatbot 24/7
  - Support client intégré
  - Système de réclamation

### Pour les livreurs
- **Processus de vérification**
  - Vérification du numéro de téléphone
  - Validation des documents d'identité
  - Vérification du véhicule
  - Assurance professionnelle
  - Formation en ligne

- **Gestion des livraisons**
  - Tableau de bord personnalisé
  - Optimisation des itinéraires
  - Gestion des disponibilités
  - Statistiques de performance
  - Système de rémunération transparent

## 🛠 Technologies utilisées

### Frontend
- **HTML5 / CSS3**
  - Flexbox et Grid pour la mise en page
  - Animations CSS
  - Media queries pour le responsive
  - Variables CSS pour la personnalisation
  - Optimisation des performances

- **JavaScript (ES6+)**
  - Modules ES6
  - Async/Await
  - Classes
  - Promises
  - Local Storage

### Sécurité
- **API Web Crypto**
  - Chiffrement AES-GCM
  - Hachage sécurisé
  - Génération de clés
  - Stockage sécurisé
  - Protection des données sensibles

### Cartographie
- **Leaflet.js**
  - Cartes interactives
  - Marqueurs personnalisés
  - Calcul d'itinéraires
  - Géocodage
  - Clusters de marqueurs

### Animations
- **GSAP (GreenSock)**
  - Animations fluides
  - Timeline
  - ScrollTrigger
  - Morphing
  - Transitions de page

## 🔒 Sécurité

### Protection des données
- Chiffrement end-to-end
- Stockage sécurisé des données sensibles
- Validation côté serveur
- Protection contre les injections SQL
- Sanitization des entrées utilisateur

### Authentification
- Rate limiting
- Protection contre la force brute
- Tokens JWT
- Sessions sécurisées
- 2FA (Authentification à deux facteurs)

### Audit et monitoring
- Journalisation des erreurs
- Alertes de sécurité
- Monitoring des performances
- Analyse des logs
- Détection des anomalies

## 📱 Responsive Design

### Desktop (>1024px)
- Interface complète
- Multitâche
- Tableaux de bord avancés
- Visualisations détaillées
- Fonctionnalités administrateur

### Tablette (768px-1024px)
- Navigation adaptée
- Mise en page fluide
- Touch-friendly
- Contenu réorganisé
- Performance optimisée

### Mobile (<768px)
- Interface simplifiée
- Navigation par gestes
- Chargement optimisé
- Composants adaptés
- Focus sur les actions principales

## 📂 Structure du projet

### Animations avancées GSAP

#### Animation de la page d'accueil
```javascript
// Animation séquentielle de l'accueil
const homeAnimation = gsap.timeline({
    defaults: { ease: "power3.out" }
});

homeAnimation
    .from('.hero-background', {
        duration: 1.5,
        scale: 1.1,
        opacity: 0
    })
    .from('.hero-logo', {
        duration: 1,
        y: -50,
        opacity: 0,
        rotation: -5
    }, "-=0.5")
    .from('.hero p', {
        duration: 0.8,
        y: 30,
        opacity: 0,
        stagger: 0.2
    }, "-=0.3")
    .from('.cta-buttons button', {
        duration: 0.6,
        scale: 0.8,
        opacity: 0,
        stagger: 0.2,
        ease: "back.out(1.7)"
    }, "-=0.2");
```

#### Animations des formulaires
```javascript
// Animation des champs de formulaire
const formAnimation = gsap.timeline({
    scrollTrigger: {
        trigger: ".form-container",
        start: "top center+=100",
        toggleActions: "play none none reverse"
    }
});

formAnimation
    .from('.input-group', {
        duration: 0.5,
        y: 20,
        opacity: 0,
        stagger: 0.1
    })
    .from('.form-title', {
        duration: 0.8,
        x: -30,
        opacity: 0
    }, 0);
```

### Micro-animations avancées

#### Animation du loader
```css
.loader {
    width: 48px;
    height: 48px;
    border: 5px solid #FFF;
    border-bottom-color: var(--primary-color);
    border-radius: 50%;
    animation: rotation 1s linear infinite;
}

@keyframes rotation {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Effet de brillance */
.shine-effect {
    position: relative;
    overflow: hidden;
}

.shine-effect::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
        to right,
        rgba(255,255,255,0) 0%,
        rgba(255,255,255,0.3) 50%,
        rgba(255,255,255,0) 100%
    );
    transform: rotate(30deg);
    animation: shine 3s infinite;
}

@keyframes shine {
    from { transform: translateX(-100%) rotate(30deg); }
    to { transform: translateX(100%) rotate(30deg); }
}
```

#### Animations des notifications
```javascript
class NotificationManager {
    static show(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-icon">${this.getIcon(type)}</div>
            <div class="notification-message">${message}</div>
        `;

        document.body.appendChild(notification);

        gsap.fromTo(notification,
            {
                x: 50,
                opacity: 0
            },
            {
                x: 0,
                opacity: 1,
                duration: 0.3,
                onComplete: () => {
                    setTimeout(() => {
                        gsap.to(notification, {
                            x: 50,
                            opacity: 0,
                            duration: 0.3,
                            onComplete: () => notification.remove()
                        });
                    }, 3000);
                }
            }
        );
    }
}
```

### Effets de scroll avancés

#### Parallax dynamique
```javascript
// Effet parallax avancé
ScrollTrigger.create({
    trigger: ".parallax-section",
    start: "top top",
    end: "bottom top",
    scrub: true,
    pin: true,
    onUpdate: self => {
        gsap.to(".parallax-layer", {
            y: self.progress * 100,
            scale: 1 + (self.progress * 0.1),
            opacity: 1 - (self.progress * 0.5)
        });
    }
});
```

#### Animation des statistiques
```javascript
// Animation des compteurs
function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            clearInterval(timer);
            current = end;
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// Utilisation avec ScrollTrigger
ScrollTrigger.create({
    trigger: ".stats-section",
    start: "top center",
    onEnter: () => {
        document.querySelectorAll('.stat-value').forEach(stat => {
            animateValue(stat, 0, parseInt(stat.dataset.value), 2000);
        });
    }
});
```

### Transitions de page avancées
```javascript
const pageTransitions = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.98
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: "power3.out"
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.4,
            ease: "power3.in"
        }
    }
};

// Application des transitions
document.addEventListener('DOMContentLoaded', () => {
    gsap.from(document.querySelector('main'), {
        ...pageTransitions.initial,
        duration: pageTransitions.animate.transition.duration,
        ease: pageTransitions.animate.transition.ease
    });
});
```

## 🎨 Animations avancées

### Animations de texte
```javascript
// Animation de texte avec SplitType
const text = new SplitType('.hero-text', { types: 'chars' });
gsap.from(text.chars, {
    duration: 0.8,
    opacity: 0,
    y: 20,
    rotateX: -90,
    stagger: 0.02,
    ease: "back.out(1.7)"
});

// Animation de texte défilant
gsap.to('.marquee-text', {
    xPercent: -100,
    repeat: -1,
    duration: 15,
    ease: "none"
});
```

### Animations d'interaction
```css
/* Animation du hover sur les cartes */
.service-card {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    transform-style: preserve-3d;
    perspective: 1000px;
}

.service-card:hover {
    transform: translateY(-10px) rotateX(5deg);
    box-shadow: 
        0 20px 40px rgba(0,0,0,0.1),
        0 5px 15px rgba(0,0,0,0.05);
}

/* Animation des icônes */
.icon-container {
    position: relative;
    overflow: hidden;
}

.icon-animate {
    animation: iconFloat 3s ease-in-out infinite;
}

@keyframes iconFloat {
    0%, 100% { transform: translateY(0) rotate(0); }
    50% { transform: translateY(-10px) rotate(5deg); }
}
```

### Animations de chargement créatives
```css
/* Loader avec gradient animé */
.gradient-loader {
    background: linear-gradient(
        270deg,
        #ee7752,
        #e73c7e,
        #23a6d5,
        #23d5ab
    );
    background-size: 300% 300%;
    animation: gradientShift 4s ease infinite;
}

@keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

/* Loader avec particules */
.particle-loader {
    position: relative;
}

.particle {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    animation: particleMove 1.5s infinite;
}

@keyframes particleMove {
    0% { transform: scale(0) translate(0, 0); }
    50% { transform: scale(1) translate(20px, -20px); }
    100% { transform: scale(0) translate(40px, 0); }
}
```

### Animations de scroll avancées
```javascript
// Effet de parallax avec ScrollTrigger
gsap.utils.toArray('.parallax-section').forEach(section => {
    const layers = section.querySelectorAll('.parallax-layer');
    
    layers.forEach(layer => {
        const depth = layer.dataset.depth || 1;
        
        gsap.to(layer, {
            scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
                toggleActions: 'play reverse play reverse'
            },
            y: `${depth * 100}%`,
            ease: 'none'
        });
    });
});

// Animation de révélation au scroll
ScrollTrigger.batch('.reveal', {
    onEnter: elements => {
        gsap.from(elements, {
            autoAlpha: 0,
            y: 60,
            stagger: 0.15,
            duration: 1,
            ease: 'power3.out'
        });
    },
    once: true
});
```

### Animations 3D
```css
/* Effet de carte 3D */
.card-3d {
    transform-style: preserve-3d;
    perspective: 1000px;
}

.card-3d-content {
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-3d:hover .card-3d-content {
    transform: rotateY(180deg);
}

/* Effet de profondeur */
.depth-effect {
    position: relative;
    transform-style: preserve-3d;
}

.depth-layer {
    position: absolute;
    transform: translateZ(var(--depth));
    transition: transform 0.3s ease;
}
```

### Animations de menu
```javascript
// Animation du menu mobile
const menuTimeline = gsap.timeline({ paused: true });

menuTimeline
    .to('.menu-overlay', {
        duration: 0.5,
        opacity: 1,
        visibility: 'visible',
        ease: 'power2.inOut'
    })
    .from('.mobile-menu-item', {
        duration: 0.4,
        opacity: 0,
        y: 20,
        stagger: 0.1,
        ease: 'power2.out'
    }, '-=0.2')
    .from('.menu-footer', {
        duration: 0.3,
        opacity: 0,
        y: 10,
        ease: 'power2.out'
    }, '-=0.2');

// Animation du menu de navigation
const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
    const highlight = document.createElement('div');
    highlight.className = 'nav-highlight';
    item.appendChild(highlight);

    item.addEventListener('mouseenter', () => {
        gsap.to(highlight, {
            width: '100%',
            duration: 0.3,
            ease: 'power1.out'
        });
    });

    item.addEventListener('mouseleave', () => {
        gsap.to(highlight, {
            width: '0%',
            duration: 0.3,
            ease: 'power1.in'
        });
    });
});
```

### Animations de notification
```javascript
// Système de notification avancé
class NotificationSystem {
    static show(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Animation d'entrée
        gsap.fromTo(notification,
            {
                x: 100,
                opacity: 0,
                scale: 0.8
            },
            {
                x: 0,
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: 'elastic.out(1, 0.7)',
                onComplete: () => {
                    // Animation de sortie après délai
                    setTimeout(() => {
                        gsap.to(notification, {
                            x: 100,
                            opacity: 0,
                            scale: 0.8,
                            duration: 0.3,
                            ease: 'power2.in',
                            onComplete: () => notification.remove()
                        });
                    }, 3000);
                }
            }
        );
    }
}
```