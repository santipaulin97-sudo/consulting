// 1. CONFIGURACIÓN GLOBAL DE IDIOMA
let currentLang = 'es';
const langToggle = document.getElementById('lang-switch');
const langOptions = document.querySelectorAll('.lang-opt');

langToggle.addEventListener('click', (e) => {
    const target = e.target.closest('.lang-opt');
    if (!target || target.classList.contains('active')) return;

    langOptions.forEach(opt => opt.classList.remove('active'));
    target.classList.add('active');

    currentLang = target.getAttribute('data-value');

    // Traducir elementos estáticos
    document.querySelectorAll('[data-es]').forEach(el => {
        const text = el.getAttribute(`data-${currentLang}`);
        if (text) { el.innerHTML = text; }
    });

    // Reiniciar Typing Effect al cambiar idioma
    phraseIndex = 0;
    charIndex = 0;
    isDeleting = false;

    updateBotLanguage(); 
});

// 2. TYPING EFFECT (Subtítulo dinámico arriba del párrafo)
const typingText = document.getElementById('typing-text');
const phrases = {
    es: ["Dashboards en línea.", "Reduzca costos operativos.", "Optimice procesos con IA."],
    en: ["Online dashboards.", "Reduce operational costs.", "Optimize processes with AI."]
};

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
    const currentPhrases = phrases[currentLang];
    const currentFullText = currentPhrases[phraseIndex];

    if (isDeleting) {
        typingText.textContent = currentFullText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingText.textContent = currentFullText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentFullText.length) {
        isDeleting = true;
        typingSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % currentPhrases.length;
        typingSpeed = 500;
    }

    setTimeout(typeEffect, typingSpeed);
}

// 3. LÓGICA DEL P&G BOT (Cerebro Expandido de Ingeniería)
const chatTrigger = document.getElementById('chat-trigger');
const chatWindow = document.getElementById('chat-window');
const chatBody = document.getElementById('chat-body');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-chat');
const typingIndicator = document.getElementById('typing-indicator');

const botResponses = {
    free: {
        es: "Nuestra **Automatización Gratis** consiste en identificar un proceso repetitivo y entregarlo en 1-2 semanas sin costo para que valides el ahorro real.",
        en: "Our **Free Automation** consists of identifying a repetitive process and delivering it in 1-2 weeks at no cost."
    },
    price: {
        es: "Los packs Pro inician en **USD 300/mes**. Aceptamos transferencias, tarjetas y pagos internacionales vía Deel o Payoneer.",
        en: "Pro packs start at **USD 300/mo**. We accept transfers, cards, and international payments."
    },
    payments: {
        es: "Podés pagar vía **transferencia, tarjetas o Deel/Payoneer**. Para proyectos grandes, ofrecemos **pagos por hitos**.",
        en: "You can pay via **transfer, cards, or Deel/Payoneer**. For large projects, we offer **milestone-based payments**."
    },
    cases: {
        es: "¡Sí! Tenemos casos de **Agentes de RRHH con GPT-4o** y conciliación bancaria. Podés verlos en la sección **'Casos Reales'**.",
        en: "Yes! We have cases including **HR Agents with GPT-4o** and bank reconciliation. Check the **'Case Studies'** section."
    },
    workflow: {
        es: "Trabajamos así: 1. **Diagnóstico** gratis. 2. Definición de **MVP**. 3. Desarrollo e **Implementación**. 4. Soporte.",
        en: "Our workflow: 1. Free **Diagnosis**. 2. **MVP** definition. 3. Development. 4. Support."
    },
    security: {
        es: "La seguridad es prioridad. Aplicamos estándares de **Mercado Libre** para el manejo de datos.",
        en: "Security is a priority. We apply **Mercado Libre** standards for data handling."
    },
    tech: {
        es: "Expertos en **GCP, Snowflake y Apache Airflow**. Usamos **Python y n8n** para integraciones robustas.",
        en: "Experts in **GCP, Snowflake, and Apache Airflow**. We use **Python and n8n**."
    },
    human: {
        es: "¡Excelente! Agenda directo aquí: <br><a href='https://calendly.com/santipaulin97/30min' target='_blank' style='color:#00E0FF'>📅 Agendar Llamada</a>",
        en: "Great! Book directly here: <br><a href='https://calendly.com/santipaulin97/30min' target='_blank' style='color:#00E0FF'>📅 Book a Call</a>"
    }
};

function showChatMenu() {
    const menuDiv = document.createElement('div');
    menuDiv.className = 'chat-options';
    menuDiv.innerHTML = `
        <button class="chat-opt-btn" data-action="free">${currentLang === 'es' ? '🎁 Automatización Gratis' : '🎁 Free Automation'}</button>
        <button class="chat-opt-btn" data-action="price">${currentLang === 'es' ? '💰 Planes y Costos' : '💰 Plans & Costs'}</button>
        <button class="chat-opt-btn" data-action="tech">${currentLang === 'es' ? '🚀 Tecnologías' : '🚀 Technologies'}</button>
        <button class="chat-opt-btn" data-action="human">${currentLang === 'es' ? '👤 Consultor' : '👤 Consultant'}</button>
    `;
    chatBody.appendChild(menuDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

chatTrigger.addEventListener('click', () => {
    chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
});

document.getElementById('close-chat').addEventListener('click', () => {
    chatWindow.style.display = 'none';
});

function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `message ${type}`;
    msg.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function botReply(action) {
    typingIndicator.style.display = 'flex';
    setTimeout(() => {
        typingIndicator.style.display = 'none';
        addMessage(botResponses[action][currentLang], 'bot');
        setTimeout(showChatMenu, 500);
    }, 1500);
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('chat-opt-btn')) {
        const action = e.target.getAttribute('data-action');
        addMessage(e.target.innerText, 'user');
        e.target.parentElement.remove();
        botReply(action);
    }
});

// MOTOR DE INTELIGENCIA POR PALABRAS CLAVE (CORREGIDO)
sendBtn.addEventListener('click', () => {
    const text = chatInput.value.trim().toLowerCase();
    if (text) {
        addMessage(chatInput.value, 'user');
        chatInput.value = '';
        
        if (text.includes('gratis') || text.includes('free') || text.includes('prueba')) botReply('free');
        else if (text.includes('precio') || text.includes('cost') || text.includes('cuanto sale') || text.includes('val')) botReply('price');
        else if (text.includes('paga') || text.includes('cuota') || text.includes('tarjeta') || text.includes('transferencia') || text.includes('deel') || text.includes('payoneer')) botReply('payments');
        else if (text.includes('caso') || text.includes('exito') || text.includes('hicieron') || text.includes('estudio') || text.includes('success')) botReply('cases');
        else if (text.includes('trabajan') || text.includes('metodo') || text.includes('pasos') || text.includes('como hacen') || text.includes('workflow')) botReply('workflow');
        else if (text.includes('seguridad') || text.includes('datos') || text.includes('confidencial') || text.includes('security') || text.includes('safe')) botReply('security');
        else if (text.includes('gcp') || text.includes('airflow') || text.includes('snowflake') || text.includes('python') || text.includes('tech')) botReply('tech');
        else if (text.includes('consultor') || text.includes('hablar') || text.includes('humano') || text.includes('reunion') || text.includes('call')) botReply('human');
        else {
            typingIndicator.style.display = 'flex';
            setTimeout(() => {
                typingIndicator.style.display = 'none';
                addMessage(currentLang === 'es' ? 
                    "Esa es una pregunta interesante. No tengo la respuesta exacta, pero un especialista puede aclarártelo. ¿Te gustaría agendar una llamada o ver nuestras tecnologías?" : 
                    "That's an interesting question. I don't have the exact answer, but a specialist can clarify it. Would you like to book a call or see our technologies?", 'bot');
                showChatMenu();
            }, 1200);
        }
    } // Aquí faltaba esta llave de cierre
});

chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendBtn.click(); });

function updateBotLanguage() {
    chatInput.placeholder = chatInput.getAttribute(`data-${currentLang}-placeholder`);
    const existingMenu = document.querySelector('.chat-options');
    if (existingMenu) { existingMenu.remove(); showChatMenu(); }
}

// 4. ANIMACIONES Y CARGA INICIAL (Revelado de secciones)
window.addEventListener('DOMContentLoaded', () => {
    typeEffect();
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    chatInput.placeholder = chatInput.getAttribute(`data-${currentLang}-placeholder`);
});

// 5. SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) { target.scrollIntoView({ behavior: 'smooth' }); }
    });
});;
