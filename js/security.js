class Security {
    static async initializeSecurity() {
        this.setupCSP();
        this.setupXSRFProtection();
        this.setupInputSanitization();
        this.monitorSuspiciousActivity();
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
}

// Initialisation de la sécurité au chargement
document.addEventListener('DOMContentLoaded', () => {
    Security.initializeSecurity();
}); 