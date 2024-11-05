const ratingSystem = {
    async submitRating(deliveryId, rating, comment) {
        try {
            await db.collection('ratings').add({
                deliveryId,
                rating,
                comment,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Mettre à jour la moyenne des notes du livreur
            const delivery = await db.collection('deliveries').doc(deliveryId).get();
            const deliveryData = delivery.data();
            const driverId = deliveryData.driverId;

            const driverRef = db.collection('drivers').doc(driverId);
            await db.runTransaction(async (transaction) => {
                const driverDoc = await transaction.get(driverRef);
                const driverData = driverDoc.data();
                
                const newRatingCount = driverData.ratingCount + 1;
                const newRatingAvg = ((driverData.ratingAvg * driverData.ratingCount) + rating) / newRatingCount;

                transaction.update(driverRef, {
                    ratingCount: newRatingCount,
                    ratingAvg: newRatingAvg
                });
            });
        } catch (error) {
            console.error('Erreur lors de la soumission de l\'avis:', error);
            throw error;
        }
    }
}; 