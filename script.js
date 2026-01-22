// 1. CONFIGURACIÓN GLOBAL
let currentLang = 'es';
const langToggle = document.getElementById('lang-switch');
const langOptions = document.querySelectorAll('.lang-opt');

// 2. LÓGICA DEL SELECTOR DE IDIOMAS (Pastilla)
langToggle.addEventListener('click', (e) => {
    const target = e.target.closest('.lang-opt');
    if (!target || target.classList.contains('active')) return;

    langOptions.forEach(opt => opt.classList.remove('active'));
    target.classList.add('active');

    currentLang = target.getAttribute('data-value');

    // Traducir elementos con data-es/en
    document.querySelectorAll('[data-es]').forEach(el => {
        const text = el.getAttribute(`data-${currentLang}`);
        if (text) { el.innerHTML = text; }
    });

    updateBotLanguage(); // Sincroniza el Bot inmediatamente
});

// 3. LÓGICA DEL P&G BOT - CORREGIDA Y MEJORADA
const chatTrigger = document.getElementById('chat-trigger');
const chatWindow = document.getElementById('chat-window');
const chatBody = document.getElementById('chat-body');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-chat');
const typingIndicator = document.getElementById('typing-indicator');

const botResponses = {
    free: {
        es: "Nuestra **Automatización Gratis** consiste en identificar un proceso repetitivo y automatizarlo en 1-2 semanas para que compruebes el ahorro real.",
        en: "Our **Free Automation** consists of identifying a repetitive process and automating it in 1-2 weeks so you can see the real savings."
    },
    price: {
        es: "Nuestros packs Pro comienzan en **USD 300/mes** e incluyen mantenimiento y soporte prioritario para múltiples procesos.",
        en: "Our Pro packs start at **USD 300/mo** and include maintenance and priority support for multiple processes."
    },
    tech: {
        es: "Expertos en **IA (GPT-4o)**, **n8n**, **Python** y soluciones **Cloud Native** de alta escala.",
        en: "Experts in **AI (GPT-4o)**, **n8n**, **Python**, and high-scale **Cloud Native** solutions."
    },
    human: {
        es: "¡Excelente! Puedes agendar directo con Santiago aquí: <br><a href='https://calendly.com/santipaulin97/30min' target='_blank' style='color:#00E0FF'>📅 Agendar en Calendly</a>",
        en: "Great! You can book directly with Santiago here: <br><a href='https://calendly.com/santipaulin97/30min' target='_blank' style='color:#00E0FF'>📅 Book on Calendly</a>"
    }
};

// Función para mostrar el menú de opciones
function showChatMenu() {
    const menuDiv = document.createElement('div');
    menuDiv.className = 'chat-options';
    menuDiv.innerHTML = `
        <button class="chat-opt-btn" data-action="free">${currentLang === 'es' ? '🎁 Automatización Gratis' : '🎁 Free Automation'}</button>
        <button class="chat-opt-btn" data-action="price">${currentLang === 'es' ? '💰 Planes y Costos' : '💰 Plans & Costs'}</button>
        <button class="chat-opt-btn" data-action="tech">${currentLang === 'es' ? '🚀 Tecnologías' : '🚀 Technologies'}</button>
        <button class="chat-opt-btn" data-action="human">${currentLang === 'es' ? '👤 Hablar con Santiago' : '👤 Talk to Santiago'}</button>
    `;
    chatBody.appendChild(menuDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Abrir/Cerrar (Corregido para el nuevo Trigger Wrapper)
let botInitialized = false;
chatTrigger.addEventListener('click', () => {
    const isOpen = chatWindow.style.display === 'flex';
    chatWindow.style.display = isOpen ? 'none' : 'flex';
    
    if (!isOpen && !botInitialized) {
        setTimeout(() => {
            const welcome = currentLang === 'es' ? "¡Hola! Soy P&G Bot. ¿En qué puedo ayudarte?" : "Hi! I'm P&G Bot. How can I help you?";
            addMessage(welcome, 'bot');
            showChatMenu();
        }, 400);
        botInitialized = true;
    }
});

document.getElementById('close-chat').addEventListener('click', () => {
    chatWindow.style.display = 'none';
});

// Función para añadir mensajes
function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `message ${type}`;
    
    // --- MEJORA AQUÍ ---
    // Esta línea convierte el texto tipo **negrita** en etiquetas <strong> reales
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    msg.innerHTML = formattedText; // Usamos innerHTML para que se vea el formato
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Lógica de respuesta con "Escribiendo..."
function botReply(action) {
    typingIndicator.style.display = 'flex';
    chatBody.scrollTop = chatBody.scrollHeight;

    setTimeout(() => {
        typingIndicator.style.display = 'none';
        addMessage(botResponses[action][currentLang], 'bot');
        setTimeout(showChatMenu, 500); // Reaparece el menú para facilitar la navegación
    }, 1200);
}

// Escuchar clics en botones de opciones
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('chat-opt-btn')) {
        const action = e.target.getAttribute('data-action');
        addMessage(e.target.innerText, 'user');
        
        // Remover el menú actual para que no se acumule
        e.target.parentElement.remove();
        
        botReply(action);
    }
});

// Enviar mensaje manual
sendBtn.addEventListener('click', () => {
    const text = chatInput.value.trim().toLowerCase();
    if (text) {
        addMessage(chatInput.value, 'user');
        chatInput.value = '';
        
        // Detección simple de palabras clave
        if (text.includes('gratis') || text.includes('free')) botReply('free');
        else if (text.includes('precio') || text.includes('pack')) botReply('price');
        else if (text.includes('santiago') || text.includes('hablar')) botReply('human');
        else {
            typingIndicator.style.display = 'flex';
            setTimeout(() => {
                typingIndicator.style.display = 'none';
                addMessage(currentLang === 'es' ? "Entiendo. Aquí tienes mis opciones:" : "I understand. Here are my options:", 'bot');
                showChatMenu();
            }, 1000);
        }
    }
});

chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendBtn.click(); });

// Sincronizar idioma del bot
function updateBotLanguage() {
    chatInput.placeholder = chatInput.getAttribute(`data-${currentLang}-placeholder`);
    // Si el bot ya inició, refrescamos el menú si existe
    const existingMenu = document.querySelector('.chat-options');
    if (existingMenu) {
        existingMenu.remove();
        showChatMenu();
    }
}

// 4. REVELACIÓN AL SCROLL (SCROLL REVEAL)
const revealOnScroll = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
};

// 5. INICIALIZACIÓN
window.addEventListener('DOMContentLoaded', () => {
    revealOnScroll();
    chatInput.placeholder = chatInput.getAttribute(`data-${currentLang}-placeholder`);
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) { target.scrollIntoView({ behavior: 'smooth' }); }
    });
});
