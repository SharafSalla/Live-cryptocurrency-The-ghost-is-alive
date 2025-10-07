// ===== وظائف صفحة الدعم =====

// تحميل وظائف الدعم عند بدء الصفحة
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('support.html')) {
        initializeSupportPage();
    }
});

// ===== تهيئة صفحة الدعم =====
function initializeSupportPage() {
    setupSupportForms();
    setupCopyButtons();
    setupFAQToggle();
    loadSupportStats();
}

// ===== إعداد نماذج الدعم =====
function setupSupportForms() {
    const supportForm = document.getElementById('support-form');
    const suggestionForm = document.getElementById('suggestion-form');
    
    if (supportForm) {
        supportForm.addEventListener('submit', handleSupportFormSubmission);
    }
    
    if (suggestionForm) {
        suggestionForm.addEventListener('submit', handleSuggestionFormSubmission);
    }
}

// ===== معالجة إرسال نموذج الدعم =====
function handleSupportFormSubmission(event) {
    event.preventDefault();
    
    const formData = {
        type: document.getElementById('message-type').value,
        name: document.getElementById('sender-name').value || 'مجهول',
        email: document.getElementById('sender-email').value,
        subject: document.getElementById('message-subject').value,
        content: document.getElementById('message-content').value,
        attachment: document.getElementById('message-attachment').files[0]
    };
    
    // التحقق من صحة البيانات
    if (!formData.type || !formData.subject || !formData.content) {
        showSupportNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    // عرض رسالة التحميل
    showSupportNotification('جاري إرسال رسالتك...', 'info');
    
    // محاكاة إرسال البيانات
    setTimeout(() => {
        // محاكاة نجاح الإرسال
        showSupportNotification('تم إرسال رسالتك بنجاح! سنرد عليك في أقرب وقت ممكن.', 'success');
        
        // إعادة تعيين النموذج
        document.getElementById('support-form').reset();
        
        // تحديث إحصائيات الدعم
        updateSupportStats();
        
    }, 2000);
}

// ===== معالجة إرسال نموذج الاقتراحات =====
function handleSuggestionFormSubmission(event) {
    event.preventDefault();
    
    const title = document.getElementById('suggestion-title').value.trim();
    const description = document.getElementById('suggestion-description').value.trim();
    
    if (!title || !description) {
        showSupportNotification('يرجى ملء جميع حقول الاقتراح', 'error');
        return;
    }
    
    // عرض رسالة التحميل
    showSupportNotification('جاري إضافة اقتراحك...', 'info');
    
    // محاكاة إضافة الاقتراح
    setTimeout(() => {
        // إضافة الاقتراح إلى القائمة
        addSuggestionToList(title, description);
        
        showSupportNotification('تم إضافة اقتراحك بنجاح! سيظهر في القائمة بعد المراجعة.', 'success');
        
        // إعادة تعيين النموذج
        document.getElementById('suggestion-form').reset();
        
    }, 1500);
}

// ===== إضافة اقتراح جديد إلى القائمة =====
function addSuggestionToList(title, description) {
    const suggestionsList = document.querySelector('.suggestions-list');
    if (!suggestionsList) return;
    
    const newSuggestion = document.createElement('div');
    newSuggestion.className = 'suggestion-item';
    newSuggestion.innerHTML = `
        <div class="suggestion-content">
            <h4>${title}</h4>
            <p>${description}</p>
            <div class="suggestion-meta">
                <span class="author">اقترحه: أنت</span>
                <span class="date">الآن</span>
            </div>
        </div>
        <div class="suggestion-votes">
            <button class="vote-btn upvote" onclick="voteSuggestion('new', 'up')">
                👍 <span>0</span>
            </button>
            <button class="vote-btn downvote" onclick="voteSuggestion('new', 'down')">
                👎 <span>0</span>
            </button>
        </div>
    `;
    
    // إضافة الاقتراح في المقدمة
    suggestionsList.insertBefore(newSuggestion, suggestionsList.firstChild);
    
    // تأثير بصري للاقتراح الجديد
    newSuggestion.style.animation = 'fadeInUp 0.5s ease-out';
}

// ===== إعداد أزرار النسخ =====
function setupCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', handleCopyClick);
    });
}

// ===== معالجة نقر زر النسخ =====
function handleCopyClick(event) {
    const button = event.target;
    const targetId = button.getAttribute('onclick').match(/'([^']+)'/)[1];
    const targetElement = document.getElementById(targetId);
    
    if (!targetElement) return;
    
    const textToCopy = targetElement.textContent.trim();
    
    // نسخ النص
    navigator.clipboard.writeText(textToCopy).then(() => {
        // تغيير مظهر الزر مؤقتاً
        const originalText = button.textContent;
        const originalColor = button.style.backgroundColor;
        
        button.textContent = '✅ تم النسخ';
        button.style.backgroundColor = 'var(--green-500)';
        button.style.color = 'white';
        
        showSupportNotification('تم نسخ النص بنجاح!', 'success');
        
        // إعادة الزر لحالته الأصلية
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = originalColor;
            button.style.color = '';
        }, 2000);
        
    }).catch(() => {
        showSupportNotification('فشل في نسخ النص. يرجى النسخ يدوياً.', 'error');
    });
}

// ===== إعداد تبديل الأسئلة الشائعة =====
function setupFAQToggle() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', handleFAQToggle);
    });
}

// ===== معالجة تبديل الأسئلة الشائعة =====
function handleFAQToggle(event) {
    const question = event.currentTarget;
    const faqItem = question.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const toggle = question.querySelector('.faq-toggle');
    
    // إغلاق جميع الأسئلة الأخرى
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
            const otherAnswer = item.querySelector('.faq-answer');
            const otherToggle = item.querySelector('.faq-toggle');
            otherAnswer.style.display = 'none';
            otherToggle.textContent = '+';
        }
    });
    
    // تبديل السؤال الحالي
    if (answer.style.display === 'block') {
        answer.style.display = 'none';
        toggle.textContent = '+';
    } else {
        answer.style.display = 'block';
        toggle.textContent = '-';
        
        // تأثير بصري للإجابة
        answer.style.animation = 'fadeInDown 0.3s ease-out';
    }
}

// ===== التصويت على الاقتراحات =====
function voteSuggestion(suggestionId, voteType) {
    const button = event.target.closest('.vote-btn');
    const countSpan = button.querySelector('span');
    let currentCount = parseInt(countSpan.textContent);
    
    // التحقق من التصويت السابق
    if (button.classList.contains('voted')) {
        showSupportNotification('لقد قمت بالتصويت على هذا الاقتراح مسبقاً', 'warning');
        return;
    }
    
    // تحديث العدد
    if (voteType === 'up') {
        countSpan.textContent = currentCount + 1;
        button.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
        button.style.color = 'var(--green-600)';
        showSupportNotification('تم تسجيل تصويتك الإيجابي!', 'success');
    } else {
        countSpan.textContent = currentCount + 1;
        button.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        button.style.color = 'var(--red-600)';
        showSupportNotification('تم تسجيل تصويتك السلبي!', 'info');
    }
    
    // تعليم الزر كمُصوت عليه
    button.classList.add('voted');
    button.disabled = true;
    
    // تأثير بصري
    button.style.transform = 'scale(1.1)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);
}

// ===== تحميل إحصائيات الدعم =====
function loadSupportStats() {
    // محاكاة تحميل الإحصائيات
    const stats = {
        totalSupport: 2847,
        totalAmount: 12400,
        successRate: 89.3,
        avgProfit: 156
    };
    
    // تحديث الإحصائيات في الصفحة الرئيسية إذا كانت متاحة
    updateStatsDisplay(stats);
}

// ===== تحديث عرض الإحصائيات =====
function updateStatsDisplay(stats) {
    const elements = {
        'total-support': stats.totalSupport.toLocaleString(),
        'total-amount': '$' + (stats.totalAmount / 1000).toFixed(1) + 'K',
        'success-rate': stats.successRate.toFixed(1) + '%',
        'avg-profit': stats.avgProfit + '%'
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            // تأثير العد التصاعدي
            animateNumber(element, value);
        }
    });
}

// ===== تحديث إحصائيات الدعم =====
function updateSupportStats() {
    // محاكاة تحديث الإحصائيات بعد إرسال رسالة
    const currentStats = {
        messages: parseInt(localStorage.getItem('supportMessages') || '0') + 1,
        suggestions: parseInt(localStorage.getItem('supportSuggestions') || '0')
    };
    
    localStorage.setItem('supportMessages', currentStats.messages.toString());
    
    console.log(`تم إرسال ${currentStats.messages} رسالة دعم`);
}

// ===== تأثير العد التصاعدي للأرقام =====
function animateNumber(element, targetValue) {
    const isNumeric = /^\d+/.test(targetValue);
    if (!isNumeric) {
        element.textContent = targetValue;
        return;
    }
    
    const startValue = 0;
    const numericTarget = parseInt(targetValue.replace(/[^\d]/g, ''));
    const duration = 1000;
    const increment = numericTarget / (duration / 16);
    
    let currentValue = startValue;
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= numericTarget) {
            currentValue = numericTarget;
            clearInterval(timer);
        }
        
        element.textContent = targetValue.replace(/^\d+/, Math.floor(currentValue).toLocaleString());
    }, 16);
}

// ===== عرض إشعارات الدعم =====
function showSupportNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `support-notification support-notification-${type}`;
    
    // تحديد الأيقونة حسب النوع
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
    
    // تحديد الألوان حسب النوع
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
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(notification);
    
    // إزالة الإشعار بعد 5 ثوان
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease-in';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 400);
    }, 5000);
    
    // إضافة إمكانية الإغلاق بالنقر
    notification.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.4s ease-in';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 400);
    });
}

// ===== وظائف مساعدة =====
function formatSupportDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Riyadh'
    };
    return new Date(date).toLocaleDateString('ar-SA', options);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// ===== إضافة أنماط CSS للدعم =====
const supportStyles = document.createElement('style');
supportStyles.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-icon {
        font-size: 1.25rem;
    }
    
    .notification-message {
        flex: 1;
        line-height: 1.4;
    }
    
    .support-notification {
        cursor: pointer;
        transition: transform 0.2s ease;
    }
    
    .support-notification:hover {
        transform: translateX(-5px);
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .vote-btn.voted {
        cursor: not-allowed;
        opacity: 0.7;
    }
    
    .suggestion-item {
        transition: all 0.3s ease;
    }
    
    .suggestion-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    }
    
    .faq-answer {
        animation-fill-mode: both;
    }
    
    .copy-btn {
        transition: all 0.3s ease;
    }
    
    .copy-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
`;
document.head.appendChild(supportStyles);
