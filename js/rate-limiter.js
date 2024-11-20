class RateLimiter {
    constructor() {
        this.attempts = new Map();
        this.maxAttempts = 5;
        this.timeWindow = 15 * 60 * 1000; // 15 minutes
    }

    isAllowed(phoneNumber) {
        if (!phoneNumber) {
            throw new Error('Numéro de téléphone requis');
        }

        const now = Date.now();
        const userAttempts = this.attempts.get(phoneNumber) || [];
        
        // Nettoyer les anciennes tentatives
        const recentAttempts = userAttempts.filter(
            timestamp => now - timestamp < this.timeWindow
        );

        // Vérifier si le nombre de tentatives dépasse la limite
        if (recentAttempts.length >= this.maxAttempts) {
            const oldestAttempt = Math.min(...recentAttempts);
            const waitTime = Math.ceil((this.timeWindow - (now - oldestAttempt)) / 60000);
            
            return {
                allowed: false,
                waitTime,
                remainingAttempts: 0
            };
        }

        // Ajouter la nouvelle tentative
        recentAttempts.push(now);
        this.attempts.set(phoneNumber, recentAttempts);

        return {
            allowed: true,
            remainingAttempts: this.maxAttempts - recentAttempts.length,
            waitTime: 0
        };
    }

    reset(phoneNumber) {
        this.attempts.delete(phoneNumber);
    }
} 