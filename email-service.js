// Service d'email utilisant Mailjet
const EmailService = {
    // Configuration Mailjet
    config: {
        apiKey: 'saaisc1cd75420a798e1e5ca3ff50282e4c0f',
        apiSecret: 'saaisc1cd75420a798e1e5ca3ff50282e4c0f',
        fromEmail: 'alfredgibeauahoussinou@gmail.com',
        fromName: 'ExpressDelivery Support',
        adminEmail: 'alfredgibeauahoussinou@gmail.com',
        templateIds: {
            contactConfirmation: 'contact-confirmation',
            adminNotification: 'admin-notification'
        }
    },

    // Initialiser Mailjet
    mailjet: require('node-mailjet').connect(
        this.config.apiKey,
        this.config.apiSecret
    ),

    // Envoyer un email via Mailjet
    async sendEmail(to, subject, templateId, variables) {
        try {
            const response = await this.mailjet
                .post("send", { version: 'v3.1' })
                .request({
                    Messages: [
                        {
                            From: {
                                Email: this.config.fromEmail,
                                Name: this.config.fromName
                            },
                            To: [
                                {
                                    Email: to,
                                    Name: variables.name || to
                                }
                            ],
                            Subject: subject,
                            HTMLPart: this.generateEmailTemplate(variables),
                            CustomID: `contact-form-${Date.now()}`
                        }
                    ]
                });

            return {
                success: true,
                messageId: response.body.Messages[0].To[0].MessageID
            };
        } catch (error) {
            console.error('Erreur Mailjet:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // Générer le template HTML pour l'email
    generateEmailTemplate(variables) {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #1a7fa3;">Nouveau message de contact</h2>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 10px;">
                    <p><strong>De:</strong> ${variables.name}</p>
                    <p><strong>Email:</strong> ${variables.email}</p>
                    <p><strong>Message:</strong></p>
                    <p style="background: white; padding: 15px; border-radius: 5px;">${variables.message}</p>
                    <p style="color: #666; font-size: 12px;">Envoyé le ${new Date().toLocaleString()}</p>
                </div>
            </div>
        `;
    },

    // Traiter le formulaire de contact
    async handleContactForm(formData) {
        try {
            // Envoyer la notification à votre email
            await this.sendEmail(
                this.config.adminEmail,
                'Nouveau message de contact ExpressDelivery',
                null,
                {
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                    date: new Date().toLocaleDateString()
                }
            );

            // Envoyer une confirmation à l'utilisateur
            await this.sendEmail(
                formData.email,
                'Confirmation de votre message - ExpressDelivery',
                null,
                {
                    name: formData.name,
                    message: "Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.",
                    date: new Date().toLocaleDateString()
                }
            );

            return {
                success: true,
                message: 'Message envoyé avec succès'
            };
        } catch (error) {
            console.error('Erreur lors du traitement du formulaire:', error);
            return {
                success: false,
                message: 'Erreur lors de l\'envoi du message'
            };
        }
    }
};

// Modifier le gestionnaire de formulaire dans index.html
async function submitContactForm(event) {
    event.preventDefault();
    const form = event.target;
    const button = form.querySelector('button');
    
    button.textContent = 'Envoi en cours...';
    button.disabled = true;

    const formData = {
        name: form.querySelector('input[type="text"]').value,
        email: form.querySelector('input[type="email"]').value,
        message: form.querySelector('textarea').value
    };

    try {
        const result = await EmailService.handleContactForm(formData);
        if (result.success) {
            alert('Message envoyé avec succès !');
            form.reset();
            document.querySelector('.contact-box').classList.remove('show');
        } else {
            alert('Erreur lors de l\'envoi. Veuillez réessayer.');
        }
    } catch (error) {
        alert('Une erreur est survenue. Veuillez réessayer plus tard.');
        console.error('Erreur:', error);
    } finally {
        button.textContent = 'Envoyer';
        button.disabled = false;
    }

    return false;
} 