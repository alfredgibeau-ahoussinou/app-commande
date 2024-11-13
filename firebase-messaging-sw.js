importScripts('https://www.gstatic.com/firebasejs/9.x.x/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.x.x/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "votre-api-key",
    authDomain: "votre-project.firebaseapp.com",
    projectId: "votre-project-id",
    storageBucket: "votre-project.appspot.com",
    messagingSenderId: "votre-messaging-sender-id",
    appId: "votre-app-id"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/logo-transparent-png.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
}); 