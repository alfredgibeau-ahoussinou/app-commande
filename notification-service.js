class NotificationService {
    constructor() {
        this.db = firebase.firestore();
    }

    // Configurer les notifications pour un utilisateur
    async setupNotifications(userId, preferences) {
        try {
            await this.db.collection('users').doc(userId).update({
                notificationPreferences: preferences
            });
        } catch (error) {
            console.error('Erreur lors de la configuration des notifications:', error);
        }
    }

    // Envoyer une notification email
    async sendEmailNotification(userId, subject, message) {
        try {
            await this.db.collection('mail').add({
                to: userId,
                message: {
                    subject,
                    text: message
                }
            });
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'email:', error);
        }
    }

    // Envoyer une notification push
    async sendPushNotification(userId, title, body) {
        try {
            const userDoc = await this.db.collection('users').doc(userId).get();
            const tokens = userDoc.data().messagingTokens;

            if (tokens && tokens.length > 0) {
                const message = {
                    notification: {
                        title,
                        body
                    },
                    tokens
                };

                await firebase.messaging().sendMulticast(message);
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la notification push:', error);
        }
    }
} 