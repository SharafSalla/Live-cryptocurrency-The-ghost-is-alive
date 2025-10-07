// ===== نظام المصادقة والمستخدمين =====

// متغيرات المصادقة
let authState = {
    isLoggedIn: false,
    currentUser: null,
    loginAttempts: 0,
    maxLoginAttempts: 5
};

// تحميل حالة المصادقة عند بدء الصفحة
document.addEventListener('DOMContentLoaded', () => {
    loadAuthState();
    setupAuthForms();
    setupPasswordValidation();
    checkAuthPages();
});

// ===== تحميل حالة المصادقة =====
function loadAuthState() {
    const savedAuth = localStorage.getItem('authState');
    if (savedAuth) {
        authState = { ...authState, ...JSON.parse(savedAuth) };
    }
    
    // تحديث واجهة المستخدم
    updateAuthUI();
}

// ===== حفظ حالة المصادقة =====
function saveAuthState() {
    localStorage.setItem('authState', JSON.stringify(authState));
}

// ===== تحديث واجهة المستخدم =====
function updateAuthUI() {
    const authButtons = document.querySelector('.auth-buttons');
    if (!authButtons) return;
    
    if (authState.isLoggedIn && authState.currentUser) {
        authButtons.innerHTML = `
            <a href="profile.html" class="btn btn-primary">👤 ${authState.currentUser.firstName}</a>
            <a href="#" class="btn btn-secondary" onclick="logout()">تسجيل الخروج</a>
        `;
    } else {
        authButtons.innerHTML = `
            <a href="login.html" class="btn btn-secondary">تسجيل الدخول</a>
            <a href="register.html" class="btn btn-primary">إنشاء حساب</a>
        `;
    }
}

// ===== إعداد نماذج المصادقة =====
function setupAuthForms() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        setupRealTimeValidation();
    }
}

// ===== معالجة تسجيل الدخول =====
function handleLogin(event) {
    event.preventDefault();
    
    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        rememberMe: document.getElementById('remember-me').checked
    };
    
    // التحقق من محاولات تسجيل الدخول
    if (authState.loginAttempts >= authState.maxLoginAttempts) {
        showAuthNotification('تم تجاوز الحد الأقصى لمحاولات تسجيل الدخول. يرجى المحاولة لاحقاً.', 'error');
        return;
    }
    
    // عرض حالة التحميل
    toggleLoadingState('login-form', true);
    
    // محاكاة عملية تسجيل الدخول
    setTimeout(() => {
        if (validateLogin(formData.email, formData.password)) {
            // نجح تسجيل الدخول
            const user = {
                id: generateUserId(),
                email: formData.email,
                firstName: 'أحمد',
                lastName: 'محمد',
                country: 'SA',
                joinDate: new Date().toISOString(),
                experience: 'intermediate'
            };
            
            authState.isLoggedIn = true;
            authState.currentUser = user;
            authState.loginAttempts = 0;
            
            saveAuthState();
            
            showAuthNotification('تم تسجيل الدخول بنجاح! مرحباً بك مرة أخرى.', 'success');
            
            // إعادة توجيه بعد ثانيتين
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 2000);
            
        } else {
            // فشل تسجيل الدخول
            authState.loginAttempts++;
            saveAuthState();
            
            showAuthNotification('بيانات تسجيل الدخول غير صحيحة. يرجى المحاولة مرة أخرى.', 'error');
        }
        
        toggleLoadingState('login-form', false);
    }, 2000);
}

// ===== معالجة إنشاء الحساب =====
function handleRegister(event) {
    event.preventDefault();
    
    const formData = {
        firstName: document.getElementById('first-name').value,
        lastName: document.getElementById('last-name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirm-password').value,
        country: document.getElementById('country').value,
        experience: document.getElementById('experience').value,
        terms: document.getElementById('terms').checked,
        newsletter: document.getElementById('newsletter').checked
    };
    
    // التحقق من صحة البيانات
    if (!validateRegistration(formData)) {
        return;
    }
    
    // عرض حالة التحميل
    toggleLoadingState('register-form', true);
    
    // محاكاة عملية إنشاء الحساب
    setTimeout(() => {
        // إنشاء المستخدم الجديد
        const user = {
            id: generateUserId(),
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            country: formData.country,
            experience: formData.experience,
            newsletter: formData.newsletter,
            joinDate: new Date().toISOString(),
            isVerified: false
        };
        
        // حفظ المستخدم
        saveUser(user);
        
        // تسجيل الدخول تلقائياً
        authState.isLoggedIn = true;
        authState.currentUser = user;
        saveAuthState();
        
        showAuthNotification('تم إنشاء حسابك بنجاح! مرحباً بك في مجتمعنا.', 'success');
        
        // إرسال بريد ترحيب (محاكاة)
        sendWelcomeEmail(user);
        
        // إعادة توجيه بعد ثانيتين
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 2000);
        
        toggleLoadingState('register-form', false);
    }, 2500);
}

// ===== التحقق من صحة تسجيل الدخول =====
function validateLogin(email, password) {
    // في التطبيق الحقيقي، سيتم التحقق من قاعدة البيانات
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const user = savedUsers.find(u => u.email === email);
    
    if (!user) return false;
    
    // محاكاة التحقق من كلمة المرور (في الواقع ستكون مشفرة)
    return password.length >= 6; // تبسيط للمحاكاة
}

// ===== التحقق من صحة التسجيل =====
function validateRegistration(formData) {
    let isValid = true;
    
    // التحقق من تطابق كلمات المرور
    if (formData.password !== formData.confirmPassword) {
        showFieldError('confirm-password', 'كلمات المرور غير متطابقة');
        isValid = false;
    }
    
    // التحقق من قوة كلمة المرور
    if (!isPasswordStrong(formData.password)) {
        showFieldError('password', 'كلمة المرور ضعيفة. يجب أن تحتوي على 8 أحرف على الأقل');
        isValid = false;
    }
    
    // التحقق من صحة البريد الإلكتروني
    if (!isValidEmail(formData.email)) {
        showFieldError('email', 'البريد الإلكتروني غير صحيح');
        isValid = false;
    }
    
    // التحقق من وجود البريد الإلكتروني مسبقاً
    if (isEmailExists(formData.email)) {
        showFieldError('email', 'البريد الإلكتروني مستخدم بالفعل');
        isValid = false;
    }
    
    // التحقق من الموافقة على الشروط
    if (!formData.terms) {
        showAuthNotification('يجب الموافقة على شروط الاستخدام', 'error');
        isValid = false;
    }
    
    return isValid;
}

// ===== إعداد التحقق الفوري =====
function setupRealTimeValidation() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    
    if (emailInput) {
        emailInput.addEventListener('blur', validateEmailField);
        emailInput.addEventListener('input', clearFieldError);
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', validatePasswordStrength);
    }
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', validatePasswordMatch);
    }
}

// ===== التحقق من البريد الإلكتروني =====
function validateEmailField() {
    const email = document.getElementById('email').value;
    const validation = document.getElementById('email-validation');
    
    if (!validation) return;
    
    if (!email) {
        validation.textContent = '';
        return;
    }
    
    if (!isValidEmail(email)) {
        validation.textContent = '❌ البريد الإلكتروني غير صحيح';
        validation.className = 'input-validation error';
    } else if (isEmailExists(email)) {
        validation.textContent = '⚠️ البريد الإلكتروني مستخدم بالفعل';
        validation.className = 'input-validation warning';
    } else {
        validation.textContent = '✅ البريد الإلكتروني متاح';
        validation.className = 'input-validation success';
    }
}

// ===== التحقق من قوة كلمة المرور =====
function validatePasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthIndicator = document.getElementById('password-strength');
    
    if (!strengthIndicator) return;
    
    const strength = calculatePasswordStrength(password);
    
    strengthIndicator.innerHTML = `
        <div class="strength-bar">
            <div class="strength-fill ${strength.level}" style="width: ${strength.percentage}%"></div>
        </div>
        <span class="strength-text">${strength.text}</span>
    `;
    
    strengthIndicator.className = `password-strength ${strength.level}`;
}

// ===== التحقق من تطابق كلمات المرور =====
function validatePasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const matchIndicator = document.getElementById('password-match');
    
    if (!matchIndicator || !confirmPassword) return;
    
    if (password === confirmPassword) {
        matchIndicator.textContent = '✅ كلمات المرور متطابقة';
        matchIndicator.className = 'input-validation success';
    } else {
        matchIndicator.textContent = '❌ كلمات المرور غير متطابقة';
        matchIndicator.className = 'input-validation error';
    }
}

// ===== حساب قوة كلمة المرور =====
function calculatePasswordStrength(password) {
    let score = 0;
    let feedback = [];
    
    if (password.length >= 8) score += 25;
    else feedback.push('8 أحرف على الأقل');
    
    if (/[a-z]/.test(password)) score += 25;
    else feedback.push('حروف صغيرة');
    
    if (/[A-Z]/.test(password)) score += 25;
    else feedback.push('حروف كبيرة');
    
    if (/[0-9]/.test(password)) score += 25;
    else feedback.push('أرقام');
    
    if (/[^A-Za-z0-9]/.test(password)) score += 10;
    
    let level, text;
    if (score < 30) {
        level = 'weak';
        text = 'ضعيفة - ' + feedback.slice(0, 2).join(', ');
    } else if (score < 60) {
        level = 'medium';
        text = 'متوسطة - ' + (feedback.length > 0 ? feedback[0] : 'جيدة');
    } else if (score < 90) {
        level = 'strong';
        text = 'قوية';
    } else {
        level = 'very-strong';
        text = 'قوية جداً';
    }
    
    return { level, text, percentage: Math.min(score, 100) };
}

// ===== تبديل عرض كلمة المرور =====
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = event.target;
    
    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = '🙈';
    } else {
        input.type = 'password';
        button.textContent = '👁️';
    }
}

// ===== تسجيل الخروج =====
function logout() {
    authState.isLoggedIn = false;
    authState.currentUser = null;
    saveAuthState();
    
    showAuthNotification('تم تسجيل الخروج بنجاح', 'success');
    
    // إعادة توجيه للصفحة الرئيسية
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// ===== تسجيل الدخول بـ Google =====
function loginWithGoogle() {
    showAuthNotification('جاري إعادة التوجيه إلى Google...', 'info');
    
    // محاكاة تسجيل الدخول بـ Google
    setTimeout(() => {
        const user = {
            id: generateUserId(),
            email: 'user@gmail.com',
            firstName: 'مستخدم',
            lastName: 'Google',
            country: 'SA',
            joinDate: new Date().toISOString(),
            provider: 'google'
        };
        
        authState.isLoggedIn = true;
        authState.currentUser = user;
        saveAuthState();
        
        showAuthNotification('تم تسجيل الدخول بنجاح عبر Google!', 'success');
        
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 2000);
    }, 2000);
}

// ===== تسجيل الدخول بـ Twitter =====
function loginWithTwitter() {
    showAuthNotification('جاري إعادة التوجيه إلى Twitter...', 'info');
    
    // محاكاة تسجيل الدخول بـ Twitter
    setTimeout(() => {
        const user = {
            id: generateUserId(),
            email: 'user@twitter.com',
            firstName: 'مستخدم',
            lastName: 'Twitter',
            country: 'SA',
            joinDate: new Date().toISOString(),
            provider: 'twitter'
        };
        
        authState.isLoggedIn = true;
        authState.currentUser = user;
        saveAuthState();
        
        showAuthNotification('تم تسجيل الدخول بنجاح عبر Twitter!', 'success');
        
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 2000);
    }, 2000);
}

// ===== التسجيل بـ Google =====
function registerWithGoogle() {
    loginWithGoogle(); // نفس العملية
}

// ===== التسجيل بـ Twitter =====
function registerWithTwitter() {
    loginWithTwitter(); // نفس العملية
}

// ===== فحص صفحات المصادقة =====
function checkAuthPages() {
    const currentPage = window.location.pathname;
    
    // إعادة توجيه المستخدمين المسجلين بعيداً عن صفحات تسجيل الدخول
    if (authState.isLoggedIn && (currentPage.includes('login.html') || currentPage.includes('register.html'))) {
        window.location.href = 'profile.html';
        return;
    }
    
    // إعادة توجيه المستخدمين غير المسجلين بعيداً عن الصفحات المحمية
    if (!authState.isLoggedIn && currentPage.includes('profile.html')) {
        window.location.href = 'login.html';
        return;
    }
}

// ===== وظائف مساعدة =====
function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isPasswordStrong(password) {
    return password.length >= 8;
}

function isEmailExists(email) {
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    return savedUsers.some(user => user.email === email);
}

function saveUser(user) {
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    savedUsers.push(user);
    localStorage.setItem('users', JSON.stringify(savedUsers));
}

function sendWelcomeEmail(user) {
    // محاكاة إرسال بريد ترحيب
    console.log(`تم إرسال بريد ترحيب إلى ${user.email}`);
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    field.classList.add('error');
    
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

function clearFieldError() {
    const field = event.target;
    field.classList.remove('error');
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function toggleLoadingState(formId, isLoading) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const submitButton = form.querySelector('button[type="submit"]');
    const btnText = submitButton.querySelector('.btn-text');
    const btnLoading = submitButton.querySelector('.btn-loading');
    
    if (isLoading) {
        submitButton.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        submitButton.classList.add('loading');
    } else {
        submitButton.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitButton.classList.remove('loading');
    }
}

function showAuthNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `auth-notification auth-notification-${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${icons[type]}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    const colors = {
        success: 'var(--green-500)',
        error: 'var(--red-500)',
        warning: 'var(--yellow-500)',
        info: 'var(--blue-500)'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${colors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease-in';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 400);
    }, 5000);
}

// ===== إضافة أنماط CSS للمصادقة =====
const authStyles = document.createElement('style');
authStyles.textContent = `
    /* أنماط صفحات المصادقة */
    .auth-container {
        min-height: calc(100vh - 200px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        gap: 3rem;
    }
    
    .auth-card {
        background: var(--white);
        border-radius: 16px;
        padding: 2.5rem;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        width: 100%;
        max-width: 450px;
    }
    
    .auth-header {
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .auth-header h1 {
        color: var(--gray-900);
        margin-bottom: 0.5rem;
    }
    
    .auth-header p {
        color: var(--gray-600);
        margin: 0;
    }
    
    .auth-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
    
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    
    .form-group {
        position: relative;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--gray-700);
        font-weight: 500;
    }
    
    .form-group input,
    .form-group select {
        width: 100%;
        padding: 0.75rem 1rem;
        padding-right: 3rem;
        border: 2px solid var(--gray-300);
        border-radius: 8px;
        font-size: 1rem;
        transition: all 0.3s ease;
    }
    
    .form-group input:focus,
    .form-group select:focus {
        outline: none;
        border-color: var(--blue-500);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .form-group input.error {
        border-color: var(--red-500);
    }
    
    .input-icon {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--gray-400);
        pointer-events: none;
    }
    
    .password-toggle {
        position: absolute;
        left: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        transition: background-color 0.3s ease;
    }
    
    .password-toggle:hover {
        background-color: var(--gray-100);
    }
    
    .form-options {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: -0.5rem 0;
    }
    
    .checkbox-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        font-size: 0.875rem;
        color: var(--gray-700);
    }
    
    .checkbox-container input[type="checkbox"] {
        width: auto;
        margin: 0;
    }
    
    .forgot-link {
        color: var(--blue-600);
        text-decoration: none;
        font-size: 0.875rem;
        transition: color 0.3s ease;
    }
    
    .forgot-link:hover {
        color: var(--blue-800);
    }
    
    .auth-btn {
        padding: 1rem;
        font-size: 1.1rem;
        font-weight: 600;
        position: relative;
        overflow: hidden;
    }
    
    .auth-btn.loading {
        cursor: not-allowed;
        opacity: 0.7;
    }
    
    .auth-divider {
        text-align: center;
        position: relative;
        margin: 1rem 0;
    }
    
    .auth-divider::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background: var(--gray-300);
    }
    
    .auth-divider span {
        background: var(--white);
        padding: 0 1rem;
        color: var(--gray-500);
        font-size: 0.875rem;
    }
    
    .social-login {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    
    .social-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        padding: 0.75rem;
        border: 2px solid var(--gray-300);
        background: var(--white);
        transition: all 0.3s ease;
    }
    
    .social-btn:hover {
        border-color: var(--gray-400);
        background: var(--gray-50);
    }
    
    .social-icon {
        font-size: 1.25rem;
    }
    
    .auth-footer {
        text-align: center;
        margin-top: 1.5rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--gray-200);
    }
    
    .auth-footer p {
        margin: 0;
        color: var(--gray-600);
        font-size: 0.875rem;
    }
    
    .auth-footer a {
        color: var(--blue-600);
        text-decoration: none;
        font-weight: 500;
    }
    
    .auth-footer a:hover {
        color: var(--blue-800);
    }
    
    /* معلومات المميزات */
    .auth-info {
        background: var(--gray-100);
        border-radius: 16px;
        padding: 2rem;
        width: 100%;
        max-width: 400px;
    }
    
    .auth-info h3 {
        color: var(--gray-900);
        margin-bottom: 1.5rem;
        text-align: center;
    }
    
    .features-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .features-list li {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 1.5rem;
        padding: 1rem;
        background: var(--white);
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    
    .feature-icon {
        font-size: 1.5rem;
        flex-shrink: 0;
    }
    
    .feature-content h4 {
        margin: 0 0 0.25rem 0;
        color: var(--gray-900);
        font-size: 1rem;
    }
    
    .feature-content p {
        margin: 0;
        color: var(--gray-600);
        font-size: 0.875rem;
        line-height: 1.4;
    }
    
    /* مؤشرات الثقة */
    .trust-indicators {
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid var(--gray-300);
    }
    
    .trust-indicators h4 {
        text-align: center;
        margin-bottom: 1rem;
        color: var(--gray-900);
    }
    
    .trust-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
    }
    
    .trust-stat {
        text-align: center;
        padding: 1rem;
        background: var(--white);
        border-radius: 8px;
    }
    
    .trust-number {
        display: block;
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--blue-600);
    }
    
    .trust-label {
        font-size: 0.75rem;
        color: var(--gray-600);
    }
    
    /* التحقق من البيانات */
    .input-validation {
        font-size: 0.75rem;
        margin-top: 0.25rem;
        padding: 0.25rem 0;
    }
    
    .input-validation.success {
        color: var(--green-600);
    }
    
    .input-validation.error {
        color: var(--red-600);
    }
    
    .input-validation.warning {
        color: var(--yellow-600);
    }
    
    /* قوة كلمة المرور */
    .password-strength {
        margin-top: 0.5rem;
    }
    
    .strength-bar {
        height: 4px;
        background: var(--gray-200);
        border-radius: 2px;
        overflow: hidden;
        margin-bottom: 0.25rem;
    }
    
    .strength-fill {
        height: 100%;
        transition: all 0.3s ease;
    }
    
    .strength-fill.weak {
        background: var(--red-500);
    }
    
    .strength-fill.medium {
        background: var(--yellow-500);
    }
    
    .strength-fill.strong {
        background: var(--blue-500);
    }
    
    .strength-fill.very-strong {
        background: var(--green-500);
    }
    
    .strength-text {
        font-size: 0.75rem;
        color: var(--gray-600);
    }
    
    .password-strength.weak .strength-text {
        color: var(--red-600);
    }
    
    .password-strength.medium .strength-text {
        color: var(--yellow-600);
    }
    
    .password-strength.strong .strength-text {
        color: var(--blue-600);
    }
    
    .password-strength.very-strong .strength-text {
        color: var(--green-600);
    }
    
    /* رسائل الخطأ */
    .field-error {
        color: var(--red-600);
        font-size: 0.75rem;
        margin-top: 0.25rem;
    }
    
    /* الاستجابة للشاشات الصغيرة */
    @media (max-width: 768px) {
        .auth-container {
            flex-direction: column;
            padding: 1rem;
        }
        
        .auth-card,
        .auth-info {
            max-width: 100%;
        }
        
        .form-row {
            grid-template-columns: 1fr;
        }
        
        .trust-stats {
            grid-template-columns: 1fr;
        }
        
        .form-options {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }
    }
`;
document.head.appendChild(authStyles);
