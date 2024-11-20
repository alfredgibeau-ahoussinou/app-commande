const liveChat = {
    initChat(deliveryId) {
        const chatRef = db.collection('chats').doc(deliveryId);
        
        // Écouter les nouveaux messages
        chatRef.collection('messages').orderBy('timestamp')
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        displayMessage(change.doc.data());
                    }
                });
            });
    },

    async sendMessage(deliveryId, message, sender) {
        try {
            await db.collection('chats').doc(deliveryId)
                .collection('messages').add({
                    text: message,
                    sender,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
        } catch (error) {
            console.error('Erreur d\'envoi du message:', error);
            throw error;
        }
    }
}; 