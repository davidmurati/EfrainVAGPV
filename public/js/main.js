/* =============================================
   AGPV - main.js
   ============================================= */

// ---- Navbar scroll effect ----
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

// ---- Hamburger menu ----
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
});

// Close menu on nav-link click
navMenu.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
    });
});

// ---- Scroll to top ----
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- Intersection Observer for animations ----
const animateElements = document.querySelectorAll('.animate-left, .animate-right, .animate-up');

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

animateElements.forEach(el => observer.observe(el));

// ---- Active nav link on scroll ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.color = 'var(--orange-light)';
        }
    });
});

// ---- Smooth scroll for all anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ---- Service cards micro-animation ----
document.querySelectorAll('.service-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.05}s`;
});

// ---- Formulario de Consulta ----
const consultForm = document.getElementById('consultForm');
if (consultForm) {
    const submitBtn = document.getElementById('cf-submit');
    const feedback = document.getElementById('cf-feedback');

    // ⚠️ Coloca aquí el número de WhatsApp de AGPV (con código de país, sin espacios ni +)
    const WHATSAPP_NUMBER = '584143216063'; // +58 414 677 9652

    consultForm.addEventListener('submit', (e) => {
        e.preventDefault();
        feedback.className = 'cf-feedback';
        feedback.textContent = '';

        // Client-side validation
        const nombre = document.getElementById('cf-nombre').value.trim();
        const email = document.getElementById('cf-email').value.trim();
        const mensaje = document.getElementById('cf-mensaje').value.trim();

        ['cf-nombre', 'cf-email', 'cf-mensaje'].forEach(id => {
            document.getElementById(id).classList.remove('error');
        });

        let hasError = false;
        if (!nombre) { document.getElementById('cf-nombre').classList.add('error'); hasError = true; }
        if (!email) { document.getElementById('cf-email').classList.add('error'); hasError = true; }
        if (!mensaje) { document.getElementById('cf-mensaje').classList.add('error'); hasError = true; }

        if (hasError) {
            feedback.textContent = 'Por favor complete los campos obligatorios (*).';
            feedback.className = 'cf-feedback error';
            return;
        }

        const empresa = document.getElementById('cf-empresa').value.trim();
        const telefono = document.getElementById('cf-telefono').value.trim();
        const asunto = document.getElementById('cf-asunto').value;

        // Construir el mensaje de WhatsApp
        let texto = `*Nueva Consulta — AGPV Asesores Económicos*\n\n`;
        texto += `👤 *Nombre:* ${nombre}\n`;
        if (empresa) texto += `🏢 *Empresa:* ${empresa}\n`;
        texto += `📧 *Correo:* ${email}\n`;
        if (telefono) texto += `📞 *Teléfono:* ${telefono}\n`;
        if (asunto) texto += `📌 *Asunto:* ${asunto}\n`;
        texto += `\n💬 *Mensaje:*\n${mensaje}`;

        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;

        // Abrir WhatsApp
        window.open(url, '_blank');

        // Confirmar en el formulario
        feedback.textContent = '✅ ¡Redirigiendo a WhatsApp! Completa el envío desde la aplicación.';
        feedback.className = 'cf-feedback success';
        consultForm.reset();
    });
}

console.log('✅ AGPV Asesores Económicos C.A - Sitio web iniciado correctamente.');
