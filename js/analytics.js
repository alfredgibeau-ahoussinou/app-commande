const analyticsSystem = {
    async trackDelivery(deliveryId) {
        const delivery = await db.collection('deliveries').doc(deliveryId).get();
        const data = delivery.data();

        await db.collection('analytics').add({
            type: 'delivery',
            deliveryId,
            distance: data.distance,
            duration: data.duration,
            price: data.price,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    },

    async generateReport(startDate, endDate) {
        const analytics = await db.collection('analytics')
            .where('timestamp', '>=', startDate)
            .where('timestamp', '<=', endDate)
            .get();

        const stats = {
            totalDeliveries: 0,
            totalRevenue: 0,
            averageDistance: 0,
            averageDuration: 0,
            deliveriesByType: {},
            peakHours: {}
        };

        analytics.forEach(doc => {
            const data = doc.data();
            stats.totalDeliveries++;
            stats.totalRevenue += data.price;
            stats.averageDistance += data.distance;
            stats.averageDuration += data.duration;

            // Analyse des heures de pointe
            const hour = new Date(data.timestamp.toDate()).getHours();
            stats.peakHours[hour] = (stats.peakHours[hour] || 0) + 1;
        });

        return {
            ...stats,
            averageDistance: stats.averageDistance / stats.totalDeliveries,
            averageDuration: stats.averageDuration / stats.totalDeliveries
        };
    }
}; 