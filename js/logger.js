class Logger {
    static levels = {
        INFO: 'info',
        WARN: 'warn',
        ERROR: 'error'
    };

    static async log(level, message, data = {}) {
        // Vérification des paramètres
        if (!this.levels[level.toUpperCase()]) {
            level = this.levels.INFO;
        }

        const logEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            data,
            userAgent: navigator?.userAgent || 'Unknown',
            url: window?.location?.href || 'Unknown',
            sessionId: this.getSessionId()
        };

        // Envoyer au serveur
        try {
            const response = await fetch('/api/logs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': this.getCSRFToken()
                },
                body: JSON.stringify(logEntry)
            });

            if (!response.ok) {
                throw new Error(`Erreur serveur: ${response.status}`);
            }
        } catch (error) {
            // Fallback vers le stockage local si le serveur est inaccessible
            this.saveToLocalStorage(logEntry);
            
            // En développement, afficher dans la console
            if (this.isDevelopment()) {
                console[level.toLowerCase()](message, data, error);
            }
        }
    }

    static saveToLocalStorage(logEntry) {
        try {
            const key = 'error_logs';
            const existingLogs = JSON.parse(localStorage.getItem(key) || '[]');
            existingLogs.push(logEntry);
            
            // Garder seulement les 100 derniers logs
            if (existingLogs.length > 100) {
                existingLogs.shift();
            }
            
            localStorage.setItem(key, JSON.stringify(existingLogs));
        } catch (error) {
            console.error('Erreur de stockage des logs:', error);
        }
    }

    static getSessionId() {
        let sessionId = sessionStorage.getItem('sessionId');
        if (!sessionId) {
            sessionId = this.generateSessionId();
            sessionStorage.setItem('sessionId', sessionId);
        }
        return sessionId;
    }

    static generateSessionId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    static getCSRFToken() {
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        return metaTag ? metaTag.content : null;
    }

    static isDevelopment() {
        return process?.env?.NODE_ENV === 'development' || 
               window?.location?.hostname === 'localhost';
    }

    // Méthodes utilitaires pour faciliter l'utilisation
    static info(message, data = {}) {
        return this.log(this.levels.INFO, message, data);
    }

    static warn(message, data = {}) {
        return this.log(this.levels.WARN, message, data);
    }

    static error(message, data = {}) {
        return this.log(this.levels.ERROR, message, data);
    }

    // Méthode pour récupérer les logs stockés localement
    static getStoredLogs() {
        try {
            return JSON.parse(localStorage.getItem('error_logs') || '[]');
        } catch (error) {
            console.error('Erreur de lecture des logs:', error);
            return [];
        }
    }

    // Méthode pour nettoyer les logs stockés
    static clearStoredLogs() {
        try {
            localStorage.removeItem('error_logs');
            return true;
        } catch (error) {
            console.error('Erreur lors du nettoyage des logs:', error);
            return false;
        }
    }
} 