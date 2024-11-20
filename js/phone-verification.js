class PhoneVerification {
    constructor() {
        this.rateLimiter = new RateLimiter();
    }

    showNotification(message, icon = '📱', type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'code-notification';
        notification.innerHTML = `
            <div class="notification-content ${type}">
                <div class="notification-icon">${icon}</div>
                <div class="notification-text">
                    <h3>${message}</h3>
                    ${type === 'code' ? `<div class="code-display">${this.lastGeneratedCode}</div>` : ''}
                </div>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            .code-notification {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(255, 255, 255, 0.95);
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2);
                z-index: 1000;
                animation: slideDown 0.5s ease forwards, fadeOut 0.5s ease 4.5s forwards;
            }

            .notification-content {
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .notification-content.success {
                color: #2ecc71;
            }

            .notification-icon {
                font-size: 24px;
                animation: bounce 1s infinite;
            }

            .notification-text {
                text-align: left;
            }

            .notification-text h3 {
                margin: 0;
                color: #333;
                font-size: 16px;
            }

            .code-display {
                font-family: monospace;
                font-size: 24px;
                color: #1a7fa3;
                margin-top: 5px;
                font-weight: bold;
                letter-spacing: 2px;
            }

            @keyframes slideDown {
                from {
                    transform: translate(-50%, -100%);
                    opacity: 0;
                }
                to {
                    transform: translate(-50%, 0);
                    opacity: 1;
                }
            }

            @keyframes fadeOut {
                to {
                    opacity: 0;
                    transform: translate(-50%, -20px);
                }
            }

            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 5000);
    }

    async sendVerificationCode(phoneNumber) {
        try {
            const rateLimitCheck = this.rateLimiter.isAllowed(phoneNumber);
            if (!rateLimitCheck.allowed) {
                throw new Error(`Trop de tentatives. Réessayez dans ${rateLimitCheck.waitTime} minutes`);
            }

            const code = Math.floor(100000 + Math.random() * 900000).toString();
            this.lastGeneratedCode = code;
            console.log('Code généré:', code);

            sessionStorage.setItem(`verification_${phoneNumber}`, code);

            this.showNotification('Code de vérification', '📱', 'code');

            return {
                success: true,
                message: "Code envoyé avec succès",
                code: code
            };
        } catch (error) {
            console.error('Erreur lors de l\'envoi du code:', error);
            throw error;
        }
    }

    async resendCode(phoneNumber) {
        try {
            const result = await this.sendVerificationCode(phoneNumber);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async verifyCode(phoneNumber, code) {
        try {
            const storedCode = sessionStorage.getItem(`verification_${phoneNumber}`);
            console.log('Code stocké:', storedCode, 'Code fourni:', code);

            if (!storedCode) {
                throw new Error('Code expiré ou invalide');
            }

            const isValid = code === storedCode;
            
            if (isValid) {
                sessionStorage.removeItem(`verification_${phoneNumber}`);
                this.rateLimiter.reset(phoneNumber);
            }

            return { success: isValid };
        } catch (error) {
            console.error('Erreur lors de la vérification du code:', error);
            throw error;
        }
    }
} 