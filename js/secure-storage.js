class SecureStorage {
    static async encryptData(data, key) {
        try {
            const encoder = new TextEncoder();
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            
            const encryptedData = await crypto.subtle.encrypt(
                {
                    name: "AES-GCM",
                    iv: iv
                },
                key,
                encoder.encode(JSON.stringify(data))
            );

            return {
                iv: Array.from(iv),
                data: Array.from(new Uint8Array(encryptedData))
            };
        } catch (error) {
            console.error('Erreur de chiffrement:', error);
            throw new Error('Échec du chiffrement des données');
        }
    }

    static async storeSecurely(key, data) {
        try {
            const cryptoKey = await this.generateKey();
            const encrypted = await this.encryptData(data, cryptoKey);
            
            sessionStorage.setItem(key, JSON.stringify(encrypted));
            return true;
        } catch (error) {
            console.error('Erreur de stockage:', error);
            return false;
        }
    }

    static async generateKey() {
        return await crypto.subtle.generateKey(
            {
                name: "AES-GCM",
                length: 256
            },
            true,
            ["encrypt", "decrypt"]
        );
    }

    static async retrieveData(key) {
        try {
            const encrypted = JSON.parse(sessionStorage.getItem(key));
            if (!encrypted) return null;

            // Décryptage à implémenter selon les besoins
            return encrypted;
        } catch (error) {
            console.error('Erreur de récupération:', error);
            return null;
        }
    }

    static async verifyIntegrity(data, signature) {
        try {
            const key = await this.getIntegrityKey();
            const isValid = await crypto.subtle.verify(
                "HMAC",
                key,
                signature,
                new TextEncoder().encode(JSON.stringify(data))
            );
            return isValid;
        } catch (error) {
            Logger.error("Erreur de vérification d'intégrité", error);
            return false;
        }
    }
} 