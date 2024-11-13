class ErrorHandler {
    static init() {
        window.onerror = this.handleError.bind(this);
        window.addEventListener('unhandledrejection', this.handlePromiseError.bind(this));
    }

    static handleError(msg, url, lineNo, columnNo, error) {
        console.error('Erreur:', {msg, url, lineNo, columnNo, error});
        this.showErrorMessage('Une erreur est survenue. Veuillez réessayer.');
        return false;
    }

    static handlePromiseError(event) {
        console.error('Erreur Promise:', event.reason);
        this.showErrorMessage('Une erreur de connexion est survenue.');
    }

    static showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div class="error-content">
                <p>${message}</p>
                <button onclick="this.parentElement.remove()">OK</button>
            </div>
        `;
        document.body.appendChild(errorDiv);
    }
}

// Initialiser le gestionnaire d'erreurs
ErrorHandler.init(); 