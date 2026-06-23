// =============================================
// NAVBAR SCROLL
// =============================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// =============================================
// MOBILE MENU
// =============================================
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = menuToggle.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
});

// Close on outside click
document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        menuToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
});

// =============================================
// SMOOTH SCROLL
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// =============================================
// AOS (Scroll Animations)
// =============================================
function initAOS() {
    const elements = document.querySelectorAll('[data-aos]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.aosDelay || 0;
                setTimeout(() => entry.target.classList.add('aos-animate'), parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    elements.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', initAOS);

// =============================================
// WHATSAPP FORM SEND
// =============================================
function sendEmail() {
    const nameInput = document.getElementById('formName');
    const emailInput = document.getElementById('formEmail');
    const phoneInput = document.getElementById('formPhone');
    const subjectInput = document.getElementById('formSubject');
    const msgInput = document.getElementById('formMsg');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const subject = subjectInput.value.trim();
    const msg = msgInput.value.trim();

    [nameInput, emailInput, phoneInput, msgInput].forEach(f => f && clearFieldError(f));

    let hasError = false;

    if (!name) {
        showFieldError(nameInput, 'Por favor indique o seu nome.');
        hasError = true;
    }
    if (!email) {
        showFieldError(emailInput, 'Por favor indique o seu email.');
        hasError = true;
    } else if (!isValidEmail(email)) {
        showFieldError(emailInput, 'Indique um email válido.');
        hasError = true;
    }
    if (phone && !isValidPhone(phone)) {
        showFieldError(phoneInput, 'Indique um número de telefone válido.');
        hasError = true;
    }
    if (!msg) {
        showFieldError(msgInput, 'Descreva brevemente o seu projecto.');
        hasError = true;
    }

    if (hasError) return;

    const mailSubject = subject || `Novo contacto de ${name} — Portfólio`;
    const body =
`Nome: ${name}
Email: ${email}
Telefone: ${phone || 'Não informado'}

Mensagem:
${msg}`;

    const url = `mailto:nelsondzimba08@gmail.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
}

// =============================================
// PROJECT FILTERS
// =============================================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const filterEmpty = document.getElementById('filterEmpty');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        let visibleCount = 0;
        projectCards.forEach(card => {
            const match = filter === 'all' || card.dataset.category === filter;
            card.classList.toggle('hidden', !match);
            if (match) visibleCount++;
        });
        if (filterEmpty) filterEmpty.style.display = visibleCount === 0 ? 'block' : 'none';
    });
});

// =============================================
// PROJECT MODAL
// =============================================
const projectModal = document.getElementById('projectModal');
const modalClose = document.getElementById('modalClose');
const modalThumb = document.getElementById('modalThumb');
const modalIcon = document.getElementById('modalIcon');
const modalCategory = document.getElementById('modalCategory');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalFeatures = document.getElementById('modalFeatures');
const modalTags = document.getElementById('modalTags');
const modalCodeBtn = document.getElementById('modalCodeBtn');

function openProjectModal(thumbEl) {
    if (!projectModal) return;
    const { title, categoryLabel, desc, icon, tags, features, link } = thumbEl.dataset;

    modalTitle.textContent = title || '';
    modalCategory.textContent = categoryLabel || '';
    modalDesc.textContent = desc || '';
    modalIcon.className = icon || 'fas fa-folder';

    if (link) {
        modalCodeBtn.href = link;
        modalCodeBtn.style.display = '';
        modalCodeBtn.textContent = 'Ver Código';
    } else {
        modalCodeBtn.style.display = 'none';
    }

    modalFeatures.innerHTML = (features || '').split(',').filter(Boolean)
        .map(f => `<span><i class="fas fa-check-circle"></i> ${f.trim()}</span>`).join('');

    modalTags.innerHTML = (tags || '').split(',').filter(Boolean)
        .map(t => `<span>${t.trim()}</span>`).join('');

    projectModal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    projectModal.classList.remove('open');
    document.body.style.overflow = '';
}

document.querySelectorAll('.project-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => openProjectModal(thumb));
});

document.querySelectorAll('.view-project-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const thumb = btn.closest('.project-card').querySelector('.project-thumb');
        if (thumb) openProjectModal(thumb);
    });
});

if (modalClose) modalClose.addEventListener('click', closeProjectModal);
if (projectModal) {
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) closeProjectModal();
    });
}
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('open')) {
        closeProjectModal();
    }
});

// =============================================
// CONTACT FORM VALIDATION
// =============================================
function showFieldError(input, message) {
    clearFieldError(input);
    input.classList.add('input-error');
    const err = document.createElement('span');
    err.className = 'field-error';
    err.textContent = message;
    input.insertAdjacentElement('afterend', err);
}
function clearFieldError(input) {
    input.classList.remove('input-error');
    const next = input.nextElementSibling;
    if (next && next.classList.contains('field-error')) next.remove();
}
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isValidPhone(phone) {
    return /^[0-9+\s()-]{7,}$/.test(phone);
}

document.querySelectorAll('#contactForm input, #contactForm textarea').forEach(field => {
    field.addEventListener('input', () => clearFieldError(field));
});

// =============================================
// COUNT-UP ANIMATION (estatísticas)
// =============================================
function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = Math.floor(eased * target);
        el.textContent = current + suffix;
        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            el.textContent = target + suffix;
        }
    }
    requestAnimationFrame(tick);
}

function initCountUp() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });
    counters.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', initCountUp);

const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 120) current = section.id;
    });
    navLinkEls.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--primary-light)' : '';
    });
});
