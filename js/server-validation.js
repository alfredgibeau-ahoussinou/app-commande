class ServerValidator {
    static async validatePhoneNumber(phoneNumber) {
        try {
            if (!this.isValidPhoneFormat(phoneNumber)) {
                throw new Error('Format de numéro invalide');
            }

            const response = await fetch('/api/validate/phone', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': this.getCSRFToken()
                },
                body: JSON.stringify({ phoneNumber })
            });

            if (!response.ok) {
                throw new Error(`Erreur serveur: ${response.status}`);
            }

            const data = await response.json();
            return {
                valid: data.valid,
                message: data.message
            };
        } catch (error) {
            ErrorHandler.showError('VALIDATION_ERROR');
            throw error;
        }
    }

    static isValidPhoneFormat(phone) {
        const phoneRegex = /^(\+33|0)[1-9](\d{2}){4}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    static getCSRFToken() {
        return document.querySelector('meta[name="csrf-token"]')?.content;
    }
} 