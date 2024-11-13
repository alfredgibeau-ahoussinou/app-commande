const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: functions.config().email.user,
        pass: functions.config().email.pass
    }
});

// Fonction pour envoyer des emails lors de la mise à jour d'un colis
exports.sendShipmentUpdateEmail = functions.firestore
    .document('shipments/{shipmentId}')
    .onUpdate(async (change, context) => {
        const newData = change.after.data();
        const previousData = change.before.data();

        // Vérifier si le statut a changé
        if (newData.status === previousData.status) {
            return null;
        }

        try {
            // Récupérer les informations de l'utilisateur
            const userDoc = await admin.firestore()
                .collection('users')
                .doc(newData.senderId)
                .get();

            const userData = userDoc.data();

            // Préparer l'email
            const mailOptions = {
                from: 'ExpressDelivery <noreply@expressdelivery.com>',
                to: userData.email,
                subject: `Mise à jour de votre colis ${context.params.shipmentId}`,
                html: `
                    <h2>Mise à jour de votre colis</h2>
                    <p>Votre colis (${context.params.shipmentId}) est maintenant : ${newData.status}</p>
                    <p>Localisation actuelle : ${newData.currentLocation}</p>
                    <p>Date estimée de livraison : ${newData.estimatedDeliveryDate}</p>
                    <a href="https://votre-site.com/tracking/${context.params.shipmentId}">
                        Suivre votre colis
                    </a>
                `
            };

            // Envoyer l'email
            await transporter.sendMail(mailOptions);

            // Enregistrer l'envoi dans l'historique
            await admin.firestore()
                .collection('tracking_history')
                .add({
                    trackingId: context.params.shipmentId,
                    type: 'email_notification',
                    status: newData.status,
                    timestamp: admin.firestore.FieldValue.serverTimestamp()
                });

        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'email:', error);
        }
    });

// Fonction pour envoyer des notifications push
exports.sendPushNotification = functions.firestore
    .document('shipments/{shipmentId}')
    .onUpdate(async (change, context) => {
        const newData = change.after.data();
        const previousData = change.before.data();

        if (newData.status === previousData.status) {
            return null;
        }

        try {
            // Récupérer les tokens de l'utilisateur
            const userDoc = await admin.firestore()
                .collection('users')
                .doc(newData.senderId)
                .get();

            const userData = userDoc.data();
            const tokens = userData.messagingTokens || [];

            if (tokens.length === 0) {
                return null;
            }

            // Préparer la notification
            const message = {
                notification: {
                    title: 'Mise à jour de votre colis',
                    body: `Votre colis est maintenant : ${newData.status}`
                },
                data: {
                    trackingId: context.params.shipmentId,
                    status: newData.status
                },
                tokens: tokens
            };

            // Envoyer la notification
            await admin.messaging().sendMulticast(message);

        } catch (error) {
            console.error('Erreur lors de l\'envoi de la notification:', error);
        }
    });

// Fonction pour créer/mettre à jour le profil utilisateur
exports.createUserProfile = functions.auth.user().onCreate(async (user) => {
    try {
        await admin.firestore().collection('users').doc(user.uid).set({
            phone: user.phoneNumber,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            notifications: {
                push: false,
                email: false,
                sms: false
            }
        });
    } catch (error) {
        console.error('Erreur lors de la création du profil:', error);
    }
});

// Fonction pour gérer les changements de préférences de notification
exports.handleNotificationPreferences = functions.firestore
    .document('users/{userId}')
    .onUpdate(async (change, context) => {
        const newData = change.after.data();
        const previousData = change.before.data();
        const userId = context.params.userId;

        // Vérifier si les préférences de notification ont changé
        if (JSON.stringify(newData.notifications) === JSON.stringify(previousData.notifications)) {
            return null;
        }

        try {
            // Mettre à jour les tokens de notification si nécessaire
            if (!newData.notifications.push && previousData.notifications.push) {
                // Supprimer les tokens si les notifications push sont désactivées
                await admin.firestore()
                    .collection('users')
                    .doc(userId)
                    .update({
                        messagingTokens: admin.firestore.FieldValue.delete()
                    });
            }

            // Enregistrer le changement dans l'historique
            await admin.firestore()
                .collection('users')
                .doc(userId)
                .collection('notificationHistory')
                .add({
                    previousSettings: previousData.notifications,
                    newSettings: newData.notifications,
                    timestamp: admin.firestore.FieldValue.serverTimestamp()
                });

        } catch (error) {
            console.error('Erreur lors de la mise à jour des préférences:', error);
        }
    });

// Fonction pour valider l'email
exports.validateEmail = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Utilisateur non authentifié');
    }

    const { email } = data;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new functions.https.HttpsError('invalid-argument', 'Email invalide');
    }

    try {
        // Envoyer un email de validation
        const mailOptions = {
            from: 'ExpressDelivery <noreply@expressdelivery.com>',
            to: email,
            subject: 'Validation de votre email',
            html: `
                <h2>Validation de votre email</h2>
                <p>Cliquez sur le lien suivant pour valider votre email :</p>
                <a href="https://votre-site.com/validate-email?token=${generateValidationToken()}">
                    Valider mon email
                </a>
            `
        };

        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        throw new functions.https.HttpsError('internal', 'Erreur lors de l\'envoi de l\'email');
    }
});

// Fonction utilitaire pour générer un token de validation
function generateValidationToken() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
} 