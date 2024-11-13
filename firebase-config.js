const firebaseConfig = {
    apiKey: "votre-api-key",
    authDomain: "votre-project.firebaseapp.com",
    projectId: "votre-project-id",
    storageBucket: "votre-project.appspot.com",
    messagingSenderId: "votre-messaging-sender-id",
    appId: "votre-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Initialize Messaging
const messaging = firebase.messaging();

// Fonction pour sauvegarder le token
async function saveMessagingToken(userId, token) {
    try {
        await db.collection('users').doc(userId).update({
            messagingTokens: firebase.firestore.FieldValue.arrayUnion(token)
        });
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du token:', error);
    }
}

// Fonction pour sauvegarder l'historique
async function saveTrackingHistory(trackingId, event) {
    try {
        await db.collection('tracking_history').add({
            trackingId,
            ...event,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error('Erreur lors de la sauvegarde de l\'historique:', error);
    }
}