const sendMessage = async () => {
        try {
            const response = await fetch('/api/functions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: chatHistory })
            });

            const data = await response.json();
            chatMessages.removeChild(loadingDiv);

            if (data.text) {
                renderMessage('goku', data.text);
                chatHistory.push({ role: "model", parts: [{ text: data.text }] });
            }
        } catch (error) {
            chatMessages.removeChild(loadingDiv);
            renderMessage('goku', "¡Rayos! Algo salió mal con la conexión. ¡Seguro es obra de algún villano!");
            console.error("Error:", error); 
        }
    };

    userInput.onkeypress = (e) => { if (e.key === 'Enter') sendBtn.click(); };

function renderMessage(role, text) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(role === 'user' ? 'user-message' : 'goku-message');
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll automático
}