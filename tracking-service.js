class TrackingService {
    constructor() {
        this.db = firebase.firestore();
    }

    // Initialiser le suivi d'un colis
    async initializeTracking(trackingId, origin, destination) {
        try {
            await this.db.collection('shipments').doc(trackingId).set({
                status: 'initialized',
                origin,
                destination,
                currentLocation: origin,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error('Erreur lors de l\'initialisation du suivi:', error);
        }
    }

    // Mettre à jour la position
    async updateLocation(trackingId, location) {
        try {
            await this.db.collection('shipments').doc(trackingId).update({
                currentLocation: location,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Sauvegarder dans l'historique
            await saveTrackingHistory(trackingId, {
                type: 'location_update',
                location,
                message: 'Position mise à jour'
            });
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la position:', error);
        }
    }

    // Écouter les mises à jour en temps réel
    subscribeToUpdates(trackingId, callback) {
        return this.db.collection('shipments')
            .doc(trackingId)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    callback(doc.data());
                }
            });
    }
} 