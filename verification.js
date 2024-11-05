document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('verificationForm');
    const steps = document.querySelectorAll('.form-section');
    const progressSteps = document.querySelectorAll('.progress-bar .step');
    let currentStep = 0;
    let uploadedFiles = {};

    // Fonction pour uploader un fichier vers Firebase Storage
    async function uploadFile(file, path) {
        if (!storage) {
            throw new Error('Firebase Storage n\'est pas initialisé');
        }

        const storageRef = storage.ref();
        const fileRef = storageRef.child(`documents/${path}/${Date.now()}_${file.name}`);
        
        try {
            console.log('Début upload...', file.name);
            
            // Créer un objet de métadonnées
            const metadata = {
                contentType: file.type,
                customMetadata: {
                    'originalName': file.name,
                    'uploadedAt': new Date().toISOString()
                }
            };

            // Upload avec metadata et surveillance de la progression
            const uploadTask = fileRef.put(file, metadata);

            uploadTask.on('state_changed', 
                (snapshot) => {
                    // Progression
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload progress:', progress + '%');
                },
                (error) => {
                    // Erreur
                    console.error('Upload error:', error);
                    throw error;
                }
            );

            // Attendre la fin de l'upload
            const snapshot = await uploadTask;
            console.log('Upload successful');

            // Obtenir l'URL
            const downloadURL = await snapshot.ref.getDownloadURL();
            console.log('File available at:', downloadURL);

            return downloadURL;
        } catch (error) {
            console.error('Upload error details:', error);
            if (error.code === 'storage/unauthorized') {
                throw new Error('Erreur d\'autorisation - Vérifiez les règles Firebase Storage');
            } else if (error.code === 'storage/canceled') {
                throw new Error('Upload annulé');
            } else {
                throw new Error(`Erreur d'upload: ${error.message}`);
            }
        }
    }

    // Fonction pour sauvegarder les données dans Firestore
    async function saveDeliveryPartner(data) {
        try {
            const docRef = await db.collection('deliveryPartners').add({
                ...data,
                status: 'pending',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return docRef.id;
        } catch (error) {
            console.error("Erreur de sauvegarde:", error);
            throw error;
        }
    }

    // Fonction pour valider les champs d'une étape
    function validateStep(stepIndex) {
        const currentSection = steps[stepIndex];
        const inputs = currentSection.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value) {
                isValid = false;
                input.classList.add('error');
                // Ajouter un message d'erreur
                let errorMsg = input.nextElementSibling;
                if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                    errorMsg = document.createElement('span');
                    errorMsg.classList.add('error-message');
                    input.parentNode.insertBefore(errorMsg, input.nextSibling);
                }
                errorMsg.textContent = 'Ce champ est requis';
            } else {
                input.classList.remove('error');
                const errorMsg = input.nextElementSibling;
                if (errorMsg && errorMsg.classList.contains('error-message')) {
                    errorMsg.remove();
                }
            }
        });

        return isValid;
    }

    // Fonction pour afficher l'étape actuelle
    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.toggle('hidden', index !== stepIndex);
        });
        progressSteps.forEach((step, index) => {
            step.classList.toggle('active', index <= stepIndex);
        });
    }

    // Gestionnaire pour les boutons "Suivant"
    document.querySelectorAll('.next-btn').forEach(button => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    showStep(currentStep);
                }
            }
        });
    });

    // Gestionnaire pour les boutons "Précédent"
    document.querySelectorAll('.prev-btn').forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                showStep(currentStep);
            }
        });
    });

    // Gestion des fichiers
    document.querySelectorAll('input[type="file"]').forEach(input => {
        input.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            const maxSize = 5 * 1024 * 1024; // 5MB
            
            if (file && file.size > maxSize) {
                alert('Le fichier est trop volumineux. Taille maximum : 5MB');
                e.target.value = '';
                return;
            }

            if (file) {
                try {
                    const loadingIndicator = document.createElement('div');
                    loadingIndicator.className = 'loading-indicator';
                    loadingIndicator.textContent = 'Upload en cours...';
                    input.parentNode.appendChild(loadingIndicator);

                    const fileURL = await uploadFile(file, input.id);
                    uploadedFiles[input.id] = fileURL;

                    loadingIndicator.textContent = 'Upload réussi ✓';
                    setTimeout(() => loadingIndicator.remove(), 2000);
                } catch (error) {
                    alert("Erreur lors de l'upload du fichier");
                    input.value = '';
                }
            }
        });
    });

    // Soumission du formulaire
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateStep(currentStep)) {
            return;
        }

        // Créer et afficher l'overlay de chargement
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <h3>Envoi de votre dossier en cours...</h3>
                <p class="upload-status">Préparation des fichiers...</p>
            </div>
        `;
        document.body.appendChild(loadingOverlay);

        const updateStatus = (message) => {
            const status = loadingOverlay.querySelector('.upload-status');
            if (status) status.textContent = message;
        };

        try {
            const formData = new FormData(form);
            const data = {
                personalInfo: {
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    birthDate: formData.get('birthDate'),
                    phone: formData.get('phone'),
                    email: formData.get('email')
                },
                documents: uploadedFiles,
                termsAccepted: formData.get('terms') === 'on',
                status: 'pending',
                submittedAt: new Date().toISOString()
            };

            updateStatus('Vérification des informations...');
            await new Promise(resolve => setTimeout(resolve, 1000));

            updateStatus('Enregistrement de votre profil...');
            const partnerId = await saveDeliveryPartner(data);

            updateStatus('Génération de votre QR Code...');
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Afficher le succès
            const container = document.querySelector('.verification-container');
            container.innerHTML = `
                <div class="success-container">
                    <div class="success-animation">
                        <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                            <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                            <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                        </svg>
                    </div>
                    <h2>Inscription réussie !</h2>
                    <p>Voici votre QR Code de livreur :</p>
                    <div id="qrcode" class="qr-code-container"></div>
                    <p class="partner-id">ID: ${partnerId}</p>
                    <div class="qr-instructions">
                        <p>📱 Scannez ce QR code pour accéder à votre espace livreur</p>
                        <p>🔒 Gardez-le précieusement, il vous servira pour vos livraisons</p>
                    </div>
                    <div class="action-buttons">
                        <button onclick="downloadQR()" class="download-btn">Télécharger le QR Code</button>
                        <button onclick="window.location.href='index.html'" class="return-btn">Retour à l'accueil</button>
                    </div>
                </div>
            `;

            // Générer le QR Code
            const qrData = {
                partnerId: partnerId,
                name: `${data.personalInfo.firstName} ${data.personalInfo.lastName}`,
                type: 'delivery_partner',
                createdAt: data.submittedAt
            };

            new QRCode(document.getElementById("qrcode"), {
                text: JSON.stringify(qrData),
                width: 200,
                height: 200,
                colorDark: "#042142",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.');
        } finally {
            // Retirer l'overlay de chargement
            loadingOverlay.remove();
        }
    });

    // Validation en temps réel des champs
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('input', () => {
            if (input.required && !input.value) {
                input.classList.add('error');
            } else {
                input.classList.remove('error');
                const errorMsg = input.nextElementSibling;
                if (errorMsg && errorMsg.classList.contains('error-message')) {
                    errorMsg.remove();
                }
            }
        });
    });

    // Ajoutez cette fonction pour gérer les prévisualisations
    function handleFilePreview(input, previewId) {
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const preview = document.getElementById(previewId);
            const reader = new FileReader();

            reader.onload = function(e) {
                preview.src = e.target.result;
                preview.style.display = 'block';
                preview.parentElement.classList.add('has-preview');
            }

            if (file) {
                reader.readAsDataURL(file);
            }
        });
    }

    // Initialiser les prévisualisations
    handleFilePreview(document.getElementById('selfie'), 'selfiePreview');
    handleFilePreview(document.getElementById('idCardFront'), 'idFrontPreview');
    handleFilePreview(document.getElementById('idCardBack'), 'idBackPreview');
}); 