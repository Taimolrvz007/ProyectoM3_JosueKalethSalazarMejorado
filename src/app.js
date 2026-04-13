import { setupChat } from './chat.js';

// 1. Definimos las vistas primero para que estén disponibles
const views = {
    home: `
        <section id="home-view">
            <h1>¡Hola, soy Goku!</h1>
            <p>¿Estás listo para entrenar tus habilidades de programación?</p>
            <button id="start-chat">Ir al entrenamiento</button>
        </section>
    `,
    chat: `
        <section id="chat-view">
            <div id="chat-container">
                <div id="chat-messages"></div>
                <div id="chat-input-area">
                    <input type="text" id="user-input" placeholder="Escribe un mensaje...">
                    <button id="send-btn">Enviar</button>
                </div>
            </div>
        </section>
    `,
    about: `
        <section id="about-view">
            <h2>Sobre este Proyecto</h2>
            <p>Un chatbot de entrenamiento inspirado en Dragon Ball, creado para el PI 3.</p>
        </section>
    `
};

const root = document.getElementById('root');

// 2. Función para renderizar el contenido según la ruta
function render(path) {
    if (path === '/chat') {
        root.innerHTML = views.chat;
        setupChat(); // Inicializa la lógica del chat cada vez que entramos [cite: 90]
    } else if (path === '/about') {
        root.innerHTML = views.about;
    } else {
        root.innerHTML = views.home;
        // Listener para el botón de la landing
        const startBtn = document.getElementById('start-chat');
        if (startBtn) {
            startBtn.addEventListener('click', () => navigate('/chat'));
        }
    }
}

// 3. Función para navegar usando History API [cite: 11, 60]
function navigate(path) {
    window.history.pushState({}, path, window.location.origin + path);
    render(path);
}

// 4. Manejo del evento popstate (Botones atrás/adelante del navegador) [cite: 61, 117]
window.addEventListener('popstate', () => {
    render(window.location.pathname);
});

// 5. Carga inicial
document.addEventListener('DOMContentLoaded', () => {
    render(window.location.pathname);

    document.getElementById('nav-home').addEventListener('click', () => navigate('/'));
    document.getElementById('nav-chat').addEventListener('click', () => navigate('/chat'));
    document.getElementById('nav-about').addEventListener('click', () => navigate('/about'));
});