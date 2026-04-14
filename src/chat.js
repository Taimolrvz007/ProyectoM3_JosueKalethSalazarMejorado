const MOCK_RESPONSES = [
    "¡Ei! ¡Eso me recuerda cuando entrené en el Hiperbólico! ¡Tuve que superar mis propios límites!",
    "¡Kakarot jamás se rinde! Si quieres ser fuerte, ¡tienes que entrenar sin parar!",
    "¡Interesante! Eso me hace pensar en cuando alcancé el Super Saiyajin por primera vez... ¡fue increíble!",
    "¡Vegeta siempre dice que soy un idiota, pero yo aprendo a mi manera! ¿Tú cómo aprendes?",
    "¡Eso está genial! ¡La fuerza no solo viene del cuerpo, sino también del corazón!",
    "¡Mmm! Bulma diría que hay una explicación científica, pero yo prefiero confiar en mis instintos.",
    "¡Chi-Chi me enseñó que hay que estudiar, pero yo siempre preferí entrenar! ¿Tú qué prefieres?",
    "¡Eso me recuerda a la batalla contra Cell! ¡Gohan demostró que tenía una fuerza increíble escondida!",
    "¡Yo siempre busco superar mis límites! ¡Ese es el camino del guerrero Z!",
    "¡KAMEHAMEHA! ...perdón, a veces me emociono. ¿En qué te puedo ayudar?"
];

let mockIndex = 0;
let chatHistory = [];
let isWaiting = false;


const USE_REAL_API = true;

export function setupChat() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput    = document.getElementById('user-input');
    const sendBtn      = document.getElementById('send-btn');

    if (!chatMessages || !userInput || !sendBtn) {
        console.error('setupChat: no se encontraron los elementos del DOM');
        return;
    }

    
    renderMessage('goku', '¡Ei! ¡Soy Goku! ¿De qué quieres hablar, guerrero?', chatMessages);

    const handleSend = async () => {
        const text = userInput.value.trim();
        if (!text || isWaiting) return;

        isWaiting = true;
        sendBtn.disabled = true;
        userInput.value = '';

        renderMessage('user', text, chatMessages);
        chatHistory.push({ role: 'user', parts: [{ text }] });

        const loadingDiv = createLoadingIndicator();
        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            let reply;
            if (USE_REAL_API) {
                reply = await fetchFromGemini(chatHistory);
            } else {
                reply = await mockGeminiResponse();
            }

            chatMessages.removeChild(loadingDiv);
            renderMessage('goku', reply, chatMessages);
            chatHistory.push({ role: 'model', parts: [{ text: reply }] });

        } catch (error) {
            chatMessages.removeChild(loadingDiv);
            renderMessage('goku', '¡Rayos! Algo salió mal con la conexión. ¡Seguro es obra de algún villano!', chatMessages);
            console.error('Error en chat:', error);
        } finally {
            isWaiting = false;
            sendBtn.disabled = false;
            userInput.focus();
        }
    };

    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
}


function mockGeminiResponse() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const reply = MOCK_RESPONSES[mockIndex % MOCK_RESPONSES.length];
            mockIndex++;
            resolve(reply);
        }, 800);
    });
}


async function fetchFromGemini(history) {
    const response = await fetch('/api/functions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
    });

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    if (!data.text) throw new Error('Respuesta vacía de la API');
    return data.text;
}

// ---- Helpers de DOM ----
function renderMessage(role, text, container) {
    const div = document.createElement('div');
    div.classList.add('message', role === 'user' ? 'user-message' : 'goku-message');
    div.textContent = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function createLoadingIndicator() {
    const div = document.createElement('div');
    div.classList.add('message', 'goku-message', 'loading-message');
    div.textContent = 'Goku está pensando...';
    return div;
}