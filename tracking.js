// Nouveau fichier pour le suivi des colis
document.addEventListener('DOMContentLoaded', () => {
    const trackingSystem = {
        initTracking(deliveryId) {
            // Mise à jour en temps réel avec Firebase
            db.collection('deliveries').doc(deliveryId)
                .onSnapshot((doc) => {
                    if (doc.exists) {
                        updateTrackingUI(doc.data());
                    }
                });
        },

        updateLocation(deliveryId, location) {
            return db.collection('deliveries').doc(deliveryId).update({
                currentLocation: location,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
        },

        calculateETA(origin, destination) {
            // Intégration avec l'API Google Maps pour calculer l'ETA
            return new Promise((resolve) => {
                // Simulation pour l'exemple
                const eta = new Date();
                eta.setHours(eta.getHours() + 1);
                resolve(eta);
            });
        }
    };

    // Interface utilisateur pour le suivi
    function updateTrackingUI(data) {
        const trackingContainer = document.createElement('div');
        trackingContainer.className = 'tracking-container';
        trackingContainer.innerHTML = `
            <div class="tracking-status">
                <div class="status-icon ${data.status}"></div>
                <h3>Statut: ${data.status}</h3>
                <p>Dernière mise à jour: ${new Date(data.lastUpdated).toLocaleString()}</p>
            </div>
            <div class="tracking-map" id="map"></div>
            <div class="tracking-details">
                <p>Position actuelle: ${data.currentLocation}</p>
                <p>ETA: ${data.estimatedArrival}</p>
            </div>
        `;
    }
}); 