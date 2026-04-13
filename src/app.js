import { setupChat } from './chat.js';

const root = document.getElementById('root');

const views = {
    home: `
        <div class="view-content">
            <div class="home-container">
                <h1>¡Bienvenido, Guerrero Z!</h1>
                <p>Entrena tu mente conversando con el Saiyajin más fuerte del universo.</p>
                <button id="btn-start">¡Empezar ahora!</button>
            </div>
        </div>`,
    chat: `
        <div class="view-content">
            <div class="chat-wrapper">
                <div id="chat-messages"></div>
                <div class="input-area">
                    <input type="text" id="user-input" placeholder="Escríbele algo a Goku..." autocomplete="off">
                    <button id="send-btn">Enviar</button>
                </div>
            </div>
        </div>`,
    about: `
        <div class="view-content">
            <div class="about-container">
                <h1>Sobre el Proyecto</h1>
                <p>Esta aplicación fue creada como Proyecto Integrador 3 de Henry.</p>
                <p>Permite conversar con Goku usando la API de Gemini AI, desplegada en Vercel con una Serverless Function como proxy seguro.</p>
                <p><strong>Tecnologías:</strong> JavaScript vanilla, History API, Vercel Serverless Functions, Google Gemini AI, Vitest.</p>
            </div>
        </div>`
};

function setActiveNav(route) {
    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
    if (route === '/' || route === '/home') document.getElementById('nav-home').classList.add('active');
    else if (route === '/chat')  document.getElementById('nav-chat').classList.add('active');
    else if (route === '/about') document.getElementById('nav-about').classList.add('active');
}

function renderView(route) {
    const path = route === '/' ? '/home' : route;
    setActiveNav(route);

    if (path === '/home') {
        root.innerHTML = views.home;
        document.getElementById('btn-start').addEventListener('click', () => navigate('/chat'));
    } else if (path === '/chat') {
        root.innerHTML = views.chat;
        setupChat();
    } else if (path === '/about') {
        root.innerHTML = views.about;
    } else {
        // Ruta desconocida → home
        root.innerHTML = views.home;
        document.getElementById('btn-start').addEventListener('click', () => navigate('/chat'));
    }
}

function navigate(path) {
    window.history.pushState({}, '', path);
    renderView(path);
}

document.getElementById('nav-home').addEventListener('click',  () => navigate('/home'));
document.getElementById('nav-chat').addEventListener('click',  () => navigate('/chat'));
document.getElementById('nav-about').addEventListener('click', () => navigate('/about'));

window.addEventListener('popstate', () => renderView(window.location.pathname));

renderView(window.location.pathname);