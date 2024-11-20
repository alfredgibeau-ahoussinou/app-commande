class Security {
    static async initializeSecurity() {
        // Vérifier les cookies en premier
        if (!this.checkCookiesEnabled()) {
            return;
        }

        // Continuer avec les autres initialisations
        this.setupCSP();
        this.setupXSRFProtection();
        this.setupInputSanitization();
        this.monitorSuspiciousActivity();

        // Vérifier les préférences de cookies existantes
        const preferences = localStorage.getItem('cookiePreferences');
        if (!preferences) {
            document.getElementById('cookieBanner').style.display = 'block';
        }
    }

    // Protection contre les attaques XSS
    static setupCSP() {
        const meta = document.createElement('meta');
        meta.httpEquiv = "Content-Security-Policy";
        meta.content = `
            default-src 'self';
            script-src 'self' 'unsafe-inline' https://unpkg.com https://cdnjs.cloudflare.com;
            style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
            font-src 'self' https://fonts.gstatic.com;
            img-src 'self' data: https:;
            connect-src 'self' https://api.expressdelivery.com;
        `;
        document.head.appendChild(meta);
    }

    // Protection CSRF/XSRF
    static setupXSRFProtection() {
        const token = this.generateCSRFToken();
        document.querySelectorAll('form').forEach(form => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = '_csrf';
            input.value = token;
            form.appendChild(input);
        });
    }

    static generateCSRFToken() {
        const buffer = new Uint8Array(32);
        crypto.getRandomValues(buffer);
        return Array.from(buffer, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // Sanitization des entrées
    static setupInputSanitization() {
        document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', (e) => {
                e.target.value = this.sanitizeInput(e.target.value);
            });
        });
    }

    static sanitizeInput(input) {
        return input.replace(/[<>]/g, '');
    }

    // Détection d'activités suspectes
    static monitorSuspiciousActivity() {
        let suspiciousActions = 0;
        const maxSuspiciousActions = 5;

        window.addEventListener('error', this.handleSuspiciousActivity.bind(this));
        
        document.addEventListener('copy', (e) => {
            if (e.target.classList.contains('sensitive')) {
                e.preventDefault();
                this.handleSuspiciousActivity('Tentative de copie de données sensibles');
            }
        });
    }

    static handleSuspiciousActivity(event) {
        Logger.warn('Activité suspecte détectée', { event });
        // Implémenter la logique de blocage si nécessaire
    }

    // Validation des données sensibles
    static validateSensitiveData(data) {
        const validators = {
            phoneNumber: /^(\+33|0)[1-9](\d{2}){4}$/,
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            creditCard: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$/
        };

        for (const [key, regex] of Object.entries(validators)) {
            if (data[key] && !regex.test(data[key])) {
                throw new Error(`Invalid ${key}`);
            }
        }
    }

    // Protection contre le clickjacking
    static preventClickjacking() {
        if (window.self !== window.top) {
            window.top.location = window.self.location;
        }
    }

    // Détection des tentatives de manipulation du DOM
    static monitorDOMManipulation() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && 
                    mutation.target.hasAttribute('data-secure')) {
                    this.handleSuspiciousActivity('Manipulation DOM suspecte');
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Protection contre les attaques par force brute
    static async handleFailedAttempt(type, identifier) {
        const rateLimiter = new RateLimiter();
        const result = rateLimiter.isAllowed(identifier);

        if (!result.allowed) {
            throw new Error(`Trop de tentatives. Réessayez dans ${result.waitTime} minutes`);
        }

        return result;
    }

    // Validation des fichiers uploadés
    static validateFileUpload(file) {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
            throw new Error('Type de fichier non autorisé');
        }

        if (file.size > maxSize) {
            throw new Error('Fichier trop volumineux');
        }

        return true;
    }

    // Ajouter cette méthode à la classe Security
    static checkCookiesEnabled() {
        // Vérifier si les cookies sont activés
        if (!navigator.cookieEnabled) {
            this.showCookieWarning();
            return false;
        }

        // Tester la création d'un cookie
        try {
            document.cookie = "testcookie=1; SameSite=Strict; Secure";
            const cookieEnabled = document.cookie.indexOf("testcookie") !== -1;
            
            // Supprimer le cookie de test
            document.cookie = "testcookie=1; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            
            if (!cookieEnabled) {
                this.showCookieWarning();
                return false;
            }
            
            return true;
        } catch (error) {
            Logger.error('Erreur lors de la vérification des cookies', error);
            this.showCookieWarning();
            return false;
        }
    }

    static showCookieWarning() {
        const warningDiv = document.createElement('div');
        warningDiv.className = 'cookie-warning';
        warningDiv.innerHTML = `
            <div class="cookie-warning-content">
                <h3>Cookies désactivés</h3>
                <p>Les cookies sont nécessaires au bon fonctionnement du site. Veuillez les activer pour continuer.</p>
                <button onclick="location.reload()">Réessayer</button>
            </div>
        `;
        document.body.appendChild(warningDiv);

        // Ajouter les styles
        const style = document.createElement('style');
        style.textContent = `
            .cookie-warning {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            }
            .cookie-warning-content {
                background: white;
                padding: 30px;
                border-radius: 10px;
                text-align: center;
                max-width: 400px;
                margin: 20px;
            }
            .cookie-warning h3 {
                color: #333;
                margin: 0 0 15px 0;
            }
            .cookie-warning p {
                color: #666;
                margin: 0 0 20px 0;
            }
            .cookie-warning button {
                background: #1a7fa3;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                transition: background 0.3s ease;
            }
            .cookie-warning button:hover {
                background: #1aa383;
            }
        `;
        document.head.appendChild(style);
    }

    static setEssentialCookies() {
        const essentialCookies = {
            'session_secure': '1',
            'csrf_token': this.generateCSRFToken(),
            'cookie_consent': 'essential'
        };

        for (const [name, value] of Object.entries(essentialCookies)) {
            document.cookie = `${name}=${value}; path=/; SameSite=Strict; Secure; max-age=86400`;
        }
    }

    static checkEssentialCookies() {
        const requiredCookies = ['session_secure', 'csrf_token', 'cookie_consent'];
        const missingCookies = requiredCookies.filter(name => 
            !document.cookie.split(';').some(c => c.trim().startsWith(`${name}=`))
        );

        if (missingCookies.length > 0) {
            Logger.warn('Cookies essentiels manquants', { missingCookies });
            this.setEssentialCookies();
            return false;
        }

        return true;
    }
}

// Initialisation de la sécurité au chargement
document.addEventListener('DOMContentLoaded', () => {
    Security.initializeSecurity();
}); 