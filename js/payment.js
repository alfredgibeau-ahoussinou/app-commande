const paymentSystem = {
    async initializePayment(amount, currency = 'EUR') {
        // Intégration avec Stripe
        const stripe = Stripe('votre_clé_publique_stripe');
        
        try {
            const response = await fetch('/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount,
                    currency
                })
            });

            const data = await response.json();
            
            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement('card'),
                    billing_details: {
                        name: 'Client Name'
                    }
                }
            });

            if (result.error) {
                throw new Error(result.error.message);
            }

            return result.paymentIntent;
        } catch (error) {
            console.error('Erreur de paiement:', error);
            throw error;
        }
    }
}; 