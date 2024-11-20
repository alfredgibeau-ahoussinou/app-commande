class ErrorHandler {
    static errorMessages = {
        PHONE_INVALID: "Le numéro de téléphone doit être au format français (ex: 06 12 34 56 78)",
        RATE_LIMIT: "Trop de tentatives. Veuillez réessayer dans {minutes} minutes",
        SERVER_ERROR: "Une erreur est survenue. Veuillez réessayer plus tard",
        VALIDATION_ERROR: "Le code de vérification est invalide",
        NETWORK_ERROR: "Problème de connexion. Vérifiez votre connexion internet",
        STORAGE_ERROR: "Erreur lors du stockage des données",
        AUTH_ERROR: "Erreur d'authentification",
        INVALID_TOKEN: "Session invalide, veuillez vous reconnecter",
        SUSPICIOUS_ACTIVITY: "Activité suspecte détectée",
        FILE_VALIDATION: "Le fichier ne respecte pas les critères de sécurité",
        INTEGRITY_ERROR: "L'intégrité des données est compromise"
    };

    static showError(errorCode, params = {}) {
        let message = this.errorMessages[errorCode] || "Une erreur est survenue";
        
        // Remplacer les paramètres dans le message
        Object.keys(params).forEach(key => {
            message = message.replace(`{${key}}`, params[key]);
        });

        // Créer et afficher le message d'erreur
        const errorContainer = this.createErrorElement(message);
        this.showErrorContainer(errorContainer);
        
        // Logger l'erreur
        Logger.log('error', errorCode, { message, params });
    }

    static createErrorElement(message) {
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-message';
        errorContainer.textContent = message;
        return errorContainer;
    }

    static showErrorContainer(container) {
        document.body.appendChild(container);
        
        // Animation d'entrée
        gsap.fromTo(container, 
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.3 }
        );

        // Retirer après 5 secondes
        setTimeout(() => {
            gsap.to(container, {
                opacity: 0,
                y: -20,
                duration: 0.3,
                onComplete: () => container.remove()
            });
        }, 5000);
    }
} 