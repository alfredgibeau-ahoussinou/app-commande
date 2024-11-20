const locationSystem = {
    watchId: null,
    currentPosition: null,

    startTracking() {
        if ("geolocation" in navigator) {
            this.watchId = navigator.geolocation.watchPosition(
                position => this.updateLocation(position),
                error => console.error(error),
                {
                    enableHighAccuracy: true,
                    maximumAge: 30000,
                    timeout: 27000
                }
            );
        }
    },

    stopTracking() {
        if (this.watchId) {
            navigator.geolocation.clearWatch(this.watchId);
        }
    },

    async updateLocation(position) {
        this.currentPosition = position;
        
        if (auth.currentUser) {
            await db.collection('locations').doc(auth.currentUser.uid).set({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
    },

    async getNearbyDrivers(radius = 5000) { // rayon en mètres
        if (!this.currentPosition) return [];

        const nearby = await db.collection('locations')
            .where('isDriver', '==', true)
            .get();

        return nearby.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data(),
                distance: this.calculateDistance(
                    this.currentPosition.coords.latitude,
                    this.currentPosition.coords.longitude,
                    doc.data().latitude,
                    doc.data().longitude
                )
            }))
            .filter(driver => driver.distance <= radius)
            .sort((a, b) => a.distance - b.distance);
    },

    calculateDistance(lat1, lon1, lat2, lon2) {
        // Formule de Haversine
        const R = 6371e3; // Rayon de la Terre en mètres
        const φ1 = lat1 * Math.PI/180;
        const φ2 = lat2 * Math.PI/180;
        const Δφ = (lat2-lat1) * Math.PI/180;
        const Δλ = (lon2-lon1) * Math.PI/180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c;
    }
}; 