document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('packageForm');
    const steps = document.querySelectorAll('.form-section');
    const progressSteps = document.querySelectorAll('.progress-bar .step');
    let currentStep = 0;

    let stream = null;
    let videoCaptures = [];

    // Fonction pour démarrer la caméra
    async function startCamera() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            const video = document.getElementById('videoPreview');
            video.srcObject = stream;
            document.getElementById('captureVideo').disabled = false;
        } catch (err) {
            console.error('Erreur accès caméra:', err);
            alert('Impossible d\'accéder à la caméra');
        }
    }

    // Fonction pour capturer une image
    function captureImage() {
        const video = document.getElementById('videoPreview');
        const canvas = document.getElementById('videoCanvas');
        const context = canvas.getContext('2d');

        // Définir les dimensions du canvas
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Capturer l'image
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convertir en base64
        const imageData = canvas.toDataURL('image/jpeg');
        
        // Ajouter à la prévisualisation
        const preview = document.createElement('img');
        preview.src = imageData;
        document.querySelector('.video-preview').appendChild(preview);

        // Sauvegarder la capture
        videoCaptures.push(imageData);
    }

    // Ajouter les event listeners
    document.getElementById('startVideo').addEventListener('click', startCamera);
    document.getElementById('captureVideo').addEventListener('click', captureImage);

    // Fonction pour valider les champs d'une étape
    function validateStep(stepIndex) {
        const currentSection = steps[stepIndex];
        const inputs = currentSection.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value) {
                isValid = false;
                input.classList.add('error');
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

    // Navigation entre les étapes
    document.querySelectorAll('.next-btn').forEach(button => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                currentStep++;
                showStep(currentStep);
            }
        });
    });

    document.querySelectorAll('.prev-btn').forEach(button => {
        button.addEventListener('click', () => {
            currentStep--;
            showStep(currentStep);
        });
    });

    // Soumission du formulaire
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateStep(currentStep)) {
            return;
        }

        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <h3>Traitement de votre demande...</h3>
                <p class="upload-status">Recherche des livreurs disponibles...</p>
            </div>
        `;
        document.body.appendChild(loadingOverlay);

        try {
            const formData = new FormData(form);
            const packageData = {
                sender: {
                    name: formData.get('senderName'),
                    phone: formData.get('senderPhone'),
                    email: formData.get('senderEmail'),
                    address: formData.get('pickupAddress')
                },
                receiver: {
                    name: formData.get('receiverName'),
                    phone: formData.get('receiverPhone'),
                    address: formData.get('deliveryAddress')
                },
                package: {
                    type: formData.get('packageType'),
                    weight: formData.get('packageWeight'),
                    content: formData.get('packageContent'),
                    urgency: formData.get('urgency'),
                    fragile: formData.get('fragile') === 'on'
                },
                status: 'pending',
                createdAt: new Date().toISOString()
            };

            // Ajouter les captures à packageData
            packageData.videoCaptures = videoCaptures;

            // Arrêter la caméra
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            // Sauvegarder dans Firebase
            const docRef = await db.collection('deliveries').add(packageData);

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
                    <h2>Demande enregistrée !</h2>
                    <p>Numéro de suivi : ${docRef.id}</p>
                    <div class="delivery-info">
                        <p>Nous recherchons le meilleur livreur pour votre colis.</p>
                        <p>Vous recevrez une notification dès qu'un livreur acceptera votre demande.</p>
                    </div>
                    <button onclick="window.location.href='index.html'" class="return-btn">Retour à l'accueil</button>
                </div>
            `;

        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            loadingOverlay.remove();
        }
    });

    // Validation en temps réel
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
}); 