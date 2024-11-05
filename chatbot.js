document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotBox = document.querySelector('.chatbot-box');
    const closeChat = document.querySelector('.close-chat');
    const messagesContainer = document.querySelector('.chatbot-messages');
    const input = document.querySelector('.chatbot-input input');
    const sendButton = document.querySelector('.send-message');

    // Réponses prédéfinies
    const responses = {
        'bonjour': 'Bonjour ! Comment puis-je vous aider ?',
        'hello': 'Bonjour ! Comment puis-je vous aider ?',
        'salut': 'Bonjour ! Comment puis-je vous aider ?',
        'livraison': 'Nous proposons différents types de livraison : standard (2-3 jours), express (24h) et ultra urgent (2h).',
        'prix': 'Les prix varient selon la distance et le type de livraison. Vous pouvez obtenir un devis en cliquant sur "Envoyer un colis".',
        'livreur': 'Pour devenir livreur, cliquez sur le bouton "Devenir livreur" et suivez les étapes de vérification.',
        'contact': 'Vous pouvez nous contacter par email à support@expressdelivery.com ou par téléphone au 01 23 45 67 89.',
        'aide': 'Je peux vous aider avec : \n- Les types de livraison\n- Les prix\n- Devenir livreur\n- Contact support',
        'merci': 'Je vous en prie ! N\'hésitez pas si vous avez d\'autres questions.',
    };

    // Ouvrir/Fermer le chat
    chatbotToggle.addEventListener('click', () => {
        chatbotBox.classList.remove('hidden');
    });

    closeChat.addEventListener('click', () => {
        chatbotBox.classList.add('hidden');
    });

    // Envoyer un message
    function sendMessage() {
        const message = input.value.trim().toLowerCase();
        if (message) {
            // Ajouter le message de l'utilisateur
            addMessage(message, 'user');
            input.value = '';

            // Répondre après un court délai
            setTimeout(() => {
                let response = 'Désolé, je ne comprends pas votre demande. Essayez "aide" pour voir les options disponibles.';
                
                // Chercher une réponse correspondante
                for (const [key, value] of Object.entries(responses)) {
                    if (message.includes(key)) {
                        response = value;
                        break;
                    }
                }
                
                addMessage(response, 'bot');
            }, 500);
        }
    }

    // Ajouter un message au chat
    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Suggestions rapides
    const quickResponses = [
        'Comment devenir livreur ?',
        'Quels sont les prix ?',
        'Types de livraison',
        'Contact support'
    ];

    // Ajouter les suggestions après le message de bienvenue
    setTimeout(() => {
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'message bot suggestions';
        suggestionsDiv.innerHTML = 'Suggestions :<br>' + 
            quickResponses.map(r => `<button class="suggestion-btn">${r}</button>`).join('');
        messagesContainer.appendChild(suggestionsDiv);

        // Event listeners pour les suggestions
        document.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                input.value = btn.textContent;
                sendMessage();
            });
        });
    }, 1000);
}); 