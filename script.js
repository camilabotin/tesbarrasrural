// Três Barras Rural - JavaScript
// Funcionalidades: Carrinho de Compras, Acessibilidade, FAQ, Formulários, Navegação

document.addEventListener('DOMContentLoaded', function() {
    // Inicialização
    initializeCart();
    initializeAccessibility();
    initializeFAQ();
    initializeForms();
    initializeNavigation();
    initializeScrollAnimations();
});

// ===== CARRINHO DE COMPRAS =====
let cart = [];

function initializeCart() {
    // Carregar carrinho do localStorage
    const savedCart = localStorage.getItem('tresBarrasCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }

    // Event listeners para botões do carrinho
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productData = JSON.parse(e.target.getAttribute('data-product'));
            addToCart(productData);
        }
        
        if (e.target.id === 'cart-btn') {
            toggleCartModal();
        }
        
        if (e.target.id === 'close-cart') {
            closeCartModal();
        }
        
        if (e.target.classList.contains('cart-item-remove')) {
            const productId = parseInt(e.target.getAttribute('data-product-id'));
            removeFromCart(productId);
        }
        
        if (e.target.id === 'checkout-btn') {
            checkout();
        }
    });

    // Fechar modal clicando fora
    document.getElementById('cart-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeCartModal();
        }
    });
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartDisplay();
    showNotification(`${product.name} adicionado ao carrinho!`, 'success');
}

function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        const removedItem = cart[itemIndex];
        cart.splice(itemIndex, 1);
        saveCart();
        updateCartDisplay();
        showNotification(`${removedItem.name} removido do carrinho!`, 'info');
    }
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    // Atualizar contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Atualizar itens do carrinho
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: var(--gray); padding: 2rem;">Seu carrinho está vazio</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-quantity">Quantidade: ${item.quantity}</div>
                    <div class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</div>
                </div>
                <button class="cart-item-remove" data-product-id="${item.id}" aria-label="Remover ${item.name} do carrinho">
                    Remover
                </button>
            </div>
        `).join('');
    }
    
    // Atualizar total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2).replace('.', ',');
}

function toggleCartModal() {
    const modal = document.getElementById('cart-modal');
    const isVisible = modal.classList.contains('show');
    
    if (isVisible) {
        closeCartModal();
    } else {
        openCartModal();
    }
}

function openCartModal() {
    const modal = document.getElementById('cart-modal');
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    
    // Focar no primeiro elemento focável
    const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
        firstFocusable.focus();
    }
    
    // Prevenir scroll do body
    document.body.style.overflow = 'hidden';
}

function closeCartModal() {
    const modal = document.getElementById('cart-modal');
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    
    // Restaurar scroll do body
    document.body.style.overflow = '';
    
    // Retornar foco para o botão do carrinho
    document.getElementById('cart-btn').focus();
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Seu carrinho está vazio!', 'warning');
        return;
    }
    
    // Simular processo de checkout
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    showNotification(
        `Compra finalizada com sucesso! ${itemCount} itens - Total: R$ ${total.toFixed(2).replace('.', ',')}. Entraremos em contato em breve!`,
        'success'
    );
    
    // Limpar carrinho
    cart = [];
    saveCart();
    updateCartDisplay();
    closeCartModal();
}

function saveCart() {
    localStorage.setItem('tresBarrasCart', JSON.stringify(cart));
}

// ===== ACESSIBILIDADE =====
function initializeAccessibility() {
    const accessibilityBtn = document.getElementById('accessibility-btn');
    const accessibilityMenu = document.getElementById('accessibility-menu');
    const increaseFontBtn = document.getElementById('increase-font');
    const decreaseFontBtn = document.getElementById('decrease-font');
    const highContrastBtn = document.getElementById('high-contrast');
    const closeAccessibilityBtn = document.getElementById('close-accessibility');
    
    // Carregar preferências salvas
    loadAccessibilityPreferences();
    
    // Toggle menu de acessibilidade
    accessibilityBtn.addEventListener('click', function() {
        const isVisible = accessibilityMenu.classList.contains('show');
        if (isVisible) {
            closeAccessibilityMenu();
        } else {
            openAccessibilityMenu();
        }
    });
    
    // Fechar menu
    closeAccessibilityBtn.addEventListener('click', closeAccessibilityMenu);
    
    // Aumentar fonte
    increaseFontBtn.addEventListener('click', function() {
        document.body.classList.remove('small-font');
        document.body.classList.add('large-font');
        saveAccessibilityPreference('fontSize', 'large');
        showNotification('Fonte aumentada', 'info');
    });
    
    // Diminuir fonte
    decreaseFontBtn.addEventListener('click', function() {
        document.body.classList.remove('large-font');
        document.body.classList.add('small-font');
        saveAccessibilityPreference('fontSize', 'small');
        showNotification('Fonte diminuída', 'info');
    });
    
    // Alto contraste
    highContrastBtn.addEventListener('click', function() {
        const isHighContrast = document.body.classList.contains('high-contrast');
        if (isHighContrast) {
            document.body.classList.remove('high-contrast');
            saveAccessibilityPreference('highContrast', 'false');
            showNotification('Alto contraste desativado', 'info');
        } else {
            document.body.classList.add('high-contrast');
            saveAccessibilityPreference('highContrast', 'true');
            showNotification('Alto contraste ativado', 'info');
        }
    });
    
    // Fechar menu clicando fora
    document.addEventListener('click', function(e) {
        if (!accessibilityBtn.contains(e.target) && !accessibilityMenu.contains(e.target)) {
            closeAccessibilityMenu();
        }
    });
    
    // Navegação por teclado
    document.addEventListener('keydown', function(e) {
        // ESC para fechar modais
        if (e.key === 'Escape') {
            closeCartModal();
            closeAccessibilityMenu();
        }
        
        // Alt + A para abrir menu de acessibilidade
        if (e.altKey && e.key === 'a') {
            e.preventDefault();
            accessibilityBtn.click();
        }
    });
}

function openAccessibilityMenu() {
    const menu = document.getElementById('accessibility-menu');
    menu.classList.add('show');
    menu.setAttribute('aria-hidden', 'false');
    
    // Focar no primeiro botão
    const firstButton = menu.querySelector('button');
    if (firstButton) {
        firstButton.focus();
    }
}

function closeAccessibilityMenu() {
    const menu = document.getElementById('accessibility-menu');
    menu.classList.remove('show');
    menu.setAttribute('aria-hidden', 'true');
}

function saveAccessibilityPreference(key, value) {
    localStorage.setItem(`accessibility_${key}`, value);
}

function loadAccessibilityPreferences() {
    const fontSize = localStorage.getItem('accessibility_fontSize');
    const highContrast = localStorage.getItem('accessibility_highContrast');
    
    if (fontSize === 'large') {
        document.body.classList.add('large-font');
    } else if (fontSize === 'small') {
        document.body.classList.add('small-font');
    }
    
    if (highContrast === 'true') {
        document.body.classList.add('high-contrast');
    }
}

// ===== FAQ =====
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const answerId = this.getAttribute('aria-controls');
            const answer = document.getElementById(answerId);
            
            // Fechar todas as outras perguntas
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== this) {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    const otherAnswerId = otherQuestion.getAttribute('aria-controls');
                    const otherAnswer = document.getElementById(otherAnswerId);
                    otherAnswer.classList.remove('show');
                    otherAnswer.setAttribute('aria-hidden', 'true');
                }
            });
            
            // Toggle pergunta atual
            if (isExpanded) {
                this.setAttribute('aria-expanded', 'false');
                answer.classList.remove('show');
                answer.setAttribute('aria-hidden', 'true');
            } else {
                this.setAttribute('aria-expanded', 'true');
                answer.classList.add('show');
                answer.setAttribute('aria-hidden', 'false');
            }
        });
    });
}

// ===== FORMULÁRIOS =====
function initializeForms() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateContactForm()) {
                // Simular envio do formulário
                showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
                contactForm.reset();
                clearFormErrors();
            }
        });
        
        // Validação em tempo real
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

function validateContactForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    
    let isValid = true;
    
    // Validar nome
    if (!name.value.trim()) {
        showFieldError(name, 'Nome é obrigatório');
        isValid = false;
    }
    
    // Validar email
    if (!email.value.trim()) {
        showFieldError(email, 'E-mail é obrigatório');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showFieldError(email, 'E-mail inválido');
        isValid = false;
    }
    
    // Validar assunto
    if (!subject.value) {
        showFieldError(subject, 'Assunto é obrigatório');
        isValid = false;
    }
    
    // Validar mensagem
    if (!message.value.trim()) {
        showFieldError(message, 'Mensagem é obrigatória');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    
    clearFieldError(field);
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, `${getFieldLabel(field)} é obrigatório`);
        return false;
    }
    
    if (fieldName === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'E-mail inválido');
        return false;
    }
    
    return true;
}

function showFieldError(field, message) {
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    field.setAttribute('aria-invalid', 'true');
    field.classList.add('error');
}

function clearFieldError(field) {
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    field.removeAttribute('aria-invalid');
    field.classList.remove('error');
}

function clearFormErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
    
    const fields = document.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.removeAttribute('aria-invalid');
        field.classList.remove('error');
    });
}

function getFieldLabel(field) {
    const label = document.querySelector(`label[for="${field.id}"]`);
    return label ? label.textContent.replace('*', '').trim() : field.getAttribute('name');
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== NAVEGAÇÃO =====
function initializeNavigation() {
    // Navegação suave
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Atualizar link ativo
                updateActiveNavLink(this);
                
                // Focar no elemento de destino para acessibilidade
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
                targetElement.addEventListener('blur', function() {
                    this.removeAttribute('tabindex');
                }, { once: true });
            }
        });
    });
    
    // Destacar seção ativa durante o scroll
    window.addEventListener('scroll', throttle(updateActiveNavOnScroll, 100));
}

function updateActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.removeAttribute('aria-current');
    });
    activeLink.setAttribute('aria-current', 'page');
}

function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const headerHeight = document.querySelector('header').offsetHeight;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.removeAttribute('aria-current');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.setAttribute('aria-current', 'page');
        }
    });
}

// ===== ANIMAÇÕES DE SCROLL =====
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.product-card, .service-card, .course-card, .value-item');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ===== NOTIFICAÇÕES =====
function showNotification(message, type = 'info') {
    // Remover notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Criar nova notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close" aria-label="Fechar notificação">×</button>
    `;
    
    // Estilos da notificação
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: '1001',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        maxWidth: '90%',
        fontSize: '14px',
        fontWeight: '500'
    });
    
    // Cores baseadas no tipo
    const colors = {
        success: { bg: '#d4edda', color: '#155724', border: '#c3e6cb' },
        error: { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb' },
        warning: { bg: '#fff3cd', color: '#856404', border: '#ffeaa7' },
        info: { bg: '#d1ecf1', color: '#0c5460', border: '#bee5eb' }
    };
    
    const colorScheme = colors[type] || colors.info;
    Object.assign(notification.style, {
        backgroundColor: colorScheme.bg,
        color: colorScheme.color,
        border: `1px solid ${colorScheme.border}`
    });
    
    // Estilo do botão de fechar
    const closeBtn = notification.querySelector('.notification-close');
    Object.assign(closeBtn.style, {
        background: 'none',
        border: 'none',
        fontSize: '18px',
        cursor: 'pointer',
        color: 'inherit',
        padding: '0',
        marginLeft: 'auto'
    });
    
    // Adicionar ao DOM
    document.body.appendChild(notification);
    
    // Evento de fechar
    closeBtn.addEventListener('click', function() {
        notification.remove();
    });
    
    // Auto-remover após 5 segundos
    setTimeout(function() {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    // Animação de entrada
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(-50%) translateY(-20px)';
    
    requestAnimationFrame(function() {
        notification.style.transition = 'all 0.3s ease';
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%) translateY(0)';
    });
}

// ===== UTILITÁRIOS =====
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== INICIALIZAÇÃO DE EVENTOS GLOBAIS =====
// Melhorar acessibilidade do teclado
document.addEventListener('keydown', function(e) {
    // Tab trap para modais
    if (e.key === 'Tab') {
        const cartModal = document.getElementById('cart-modal');
        const accessibilityMenu = document.getElementById('accessibility-menu');
        
        if (cartModal.classList.contains('show')) {
            trapFocus(e, cartModal);
        } else if (accessibilityMenu.classList.contains('show')) {
            trapFocus(e, accessibilityMenu);
        }
    }
});

function trapFocus(e, container) {
    const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
        }
    } else {
        if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
        }
    }
}

// Adicionar estilos CSS para animações via JavaScript
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: slideInUp 0.6s ease-out;
    }
    
    .notification {
        animation: slideInDown 0.3s ease-out;
    }
    
    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    .error {
        border-color: var(--warm-orange) !important;
    }
`;
document.head.appendChild(style);

