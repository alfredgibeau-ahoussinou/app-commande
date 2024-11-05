const firebaseConfig = {
    apiKey: "AIzaSyDFvqvXXXXXXXXXXXXXXXXXXXXXXXXX",  // Remplacez par votre apiKey
    authDomain: "votre-projet.firebaseapp.com",      // Remplacez par votre authDomain
    projectId: "votre-projet",                       // Remplacez par votre projectId
    storageBucket: "votre-projet.appspot.com",      // Remplacez par votre storageBucket
    messagingSenderId: "123456789",                 // Remplacez par votre messagingSenderId
    appId: "1:123456789:web:abcdef123456"          // Remplacez par votre appId
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