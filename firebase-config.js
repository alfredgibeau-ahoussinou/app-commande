const firebaseConfig = {
    apiKey: "AIzaSyAZ7HRiULg8jkuUcWpiDL1Lfhc4wlMLDbI",
    authDomain: "livraison-5f7c9.firebaseapp.com",
    projectId: "livraison-5f7c9",
    storageBucket: "livraison-5f7c9.firebasestorage.app",
    messagingSenderId: "326764757981",
    appId: "1:326764757981:web:f406015028de9528686c34",
    measurementId: "G-PN5M3M47WV"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);

// Obtenir les références des services
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

// Vérifier que Firebase est bien initialisé
console.log('Firebase initialisé:', firebase.apps.length > 0);

// Fonction de test pour vérifier la connexion
async function testFirebaseConnection() {
    try {
        // Test Firestore
        await db.collection('test').doc('test').set({
            test: 'Connection successful',
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('Firestore connection successful');

        // Test Storage
        const testRef = storage.ref().child('test/test.txt');
        await testRef.putString('test');
        console.log('Storage connection successful');

        return true;
    } catch (error) {
        console.error('Firebase connection error:', error);
        return false;
    }
}

// Exécuter le test de connexion
testFirebaseConnection().then(isConnected => {
    if (isConnected) {
        console.log('Firebase est correctement configuré');
    } else {
        console.error('Problème de configuration Firebase');
    }
});