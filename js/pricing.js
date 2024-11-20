const pricingSystem = {
    async calculatePrice(origin, destination, packageDetails) {
        // Calculer la distance avec l'API Google Maps
        const distance = await this.calculateDistance(origin, destination);
        
        // Calculer le prix de base
        let basePrice = distance * 0.5; // 0.50€ par km
        
        // Ajustements selon le type de colis
        const weightMultiplier = this.getWeightMultiplier(packageDetails.weight);
        const urgencyMultiplier = this.getUrgencyMultiplier(packageDetails.urgency);
        
        // Prix final
        const finalPrice = basePrice * weightMultiplier * urgencyMultiplier;
        
        return {
            basePrice,
            weightMultiplier,
            urgencyMultiplier,
            finalPrice: Math.round(finalPrice * 100) / 100
        };
    },

    getWeightMultiplier(weight) {
        if (weight <= 5) return 1;
        if (weight <= 15) return 1.5;
        return 2;
    },

    getUrgencyMultiplier(urgency) {
        switch (urgency) {
            case 'express': return 1.5;
            case 'urgent': return 2;
            default: return 1;
        }
    }
}; 