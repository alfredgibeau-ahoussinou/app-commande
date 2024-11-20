class ImageRecognition {
    constructor() {
        this.model = null;
        this.isModelLoaded = false;
        this.allowedPackageTypes = ['box', 'envelope', 'tube', 'irregular'];
        this.confidenceThreshold = 0.8;
    }

    async initialize() {
        try {
            // Charger le modèle TensorFlow.js
            this.model = await tf.loadLayersModel('/models/package-recognition/model.json');
            this.isModelLoaded = true;
            Logger.info('Modèle de reconnaissance chargé avec succès');
        } catch (error) {
            Logger.error('Erreur lors du chargement du modèle', error);
            throw new Error('Impossible de charger le modèle de reconnaissance');
        }
    }

    async analyzePackageImage(imageElement) {
        if (!this.isModelLoaded) {
            throw new Error('Le modèle n\'est pas encore chargé');
        }

        try {
            // Prétraitement de l'image
            const processedImage = await this.preprocessImage(imageElement);
            
            // Prédiction
            const prediction = await this.model.predict(processedImage);
            const results = await this.processPrediction(prediction);

            // Validation des résultats
            return this.validateResults(results);
        } catch (error) {
            Logger.error('Erreur lors de l\'analyse de l\'image', error);
            throw new Error('Échec de l\'analyse de l\'image');
        }
    }

    async preprocessImage(imageElement) {
        return tf.tidy(() => {
            // Convertir l'image en tensor
            const tensor = tf.browser.fromPixels(imageElement)
                .resizeNearestNeighbor([224, 224]) // Redimensionner pour le modèle
                .toFloat()
                .expandDims();
            
            // Normalisation
            return tensor.div(255.0);
        });
    }

    async processPrediction(prediction) {
        const probabilities = await prediction.data();
        return this.allowedPackageTypes.map((type, index) => ({
            type: type,
            confidence: probabilities[index]
        })).sort((a, b) => b.confidence - a.confidence);
    }

    validateResults(results) {
        const bestMatch = results[0];
        
        if (bestMatch.confidence < this.confidenceThreshold) {
            return {
                isValid: false,
                message: "Type de colis non reconnu avec certitude",
                suggestion: "Veuillez prendre une photo plus claire"
            };
        }

        return {
            isValid: true,
            packageType: bestMatch.type,
            confidence: bestMatch.confidence,
            alternatives: results.slice(1, 3)
        };
    }

    // Vérification des dimensions du colis
    async analyzeDimensions(imageElement) {
        try {
            const dimensions = await this.detectDimensions(imageElement);
            return this.validateDimensions(dimensions);
        } catch (error) {
            Logger.error('Erreur lors de l\'analyse des dimensions', error);
            throw new Error('Impossible de détecter les dimensions');
        }
    }

    async detectDimensions(imageElement) {
        // Utilisation d'un modèle spécifique pour la détection des dimensions
        const dimensionModel = await this.loadDimensionModel();
        const prediction = await dimensionModel.predict(this.preprocessImage(imageElement));
        
        return {
            width: prediction.width,
            height: prediction.height,
            depth: prediction.depth
        };
    }

    validateDimensions(dimensions) {
        const maxDimensions = {
            box: { width: 100, height: 100, depth: 100 },
            envelope: { width: 35, height: 25, depth: 3 },
            tube: { width: 150, height: 15, depth: 15 }
        };

        // Vérifier si les dimensions sont dans les limites acceptables
        for (const [dimension, value] of Object.entries(dimensions)) {
            if (value <= 0) {
                return {
                    isValid: false,
                    message: `Dimension ${dimension} invalide`
                };
            }
        }

        return {
            isValid: true,
            dimensions: dimensions,
            recommendations: this.getDimensionRecommendations(dimensions)
        };
    }

    getDimensionRecommendations(dimensions) {
        // Suggérer le meilleur type d'emballage basé sur les dimensions
        const volume = dimensions.width * dimensions.height * dimensions.depth;
        
        if (volume <= 2625) { // 35 x 25 x 3
            return "Enveloppe recommandée";
        } else if (volume <= 1000000) { // 100 x 100 x 100
            return "Boîte standard recommandée";
        } else {
            return "Dimensions hors normes - contactez le support";
        }
    }

    // Détection d'objets interdits
    async detectProhibitedItems(imageElement) {
        try {
            const detections = await this.runObjectDetection(imageElement);
            return this.validateDetections(detections);
        } catch (error) {
            Logger.error('Erreur lors de la détection d\'objets interdits', error);
            throw new Error('Échec de la détection d\'objets interdits');
        }
    }

    async runObjectDetection(imageElement) {
        // Implémenter la détection d'objets spécifiques
        const objectDetectionModel = await this.loadObjectDetectionModel();
        return await objectDetectionModel.detect(imageElement);
    }

    validateDetections(detections) {
        const prohibitedItems = ['weapon', 'explosive', 'flammable', 'toxic'];
        const foundProhibitedItems = detections.filter(item => 
            prohibitedItems.includes(item.class) && item.score > 0.5
        );

        return {
            isValid: foundProhibitedItems.length === 0,
            prohibitedItems: foundProhibitedItems,
            message: foundProhibitedItems.length > 0 
                ? "Objets interdits détectés" 
                : "Aucun objet interdit détecté"
        };
    }
}

// Export de la classe
export default ImageRecognition; 