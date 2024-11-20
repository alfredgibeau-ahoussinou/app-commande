const notificationSystem = {
    init() {
        // Demander la permission pour les notifications
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }

        // Écouter les mises à jour en temps réel
        if (auth.currentUser) {
            db.collection('notifications')
                .where('userId', '==', auth.currentUser.uid)
                .onSnapshot(snapshot => {
                    snapshot.docChanges().forEach(change => {
                        if (change.type === 'added') {
                            this.showNotification(change.doc.data());
                        }
                    });
                });
        }
    },

    showNotification(data) {
        // Notification navigateur
        if (Notification.permission === 'granted') {
            new Notification(data.title, {
                body: data.message,
                icon: '/path/to/icon.png'
            });
        }

        // Notification in-app
        const notification = document.createElement('div');
        notification.className = 'in-app-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <h4>${data.title}</h4>
                <p>${data.message}</p>
            </div>
            <button class="close-notification">×</button>
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }
}; 