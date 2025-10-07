// ===== وظائف الخصوصية والتحسينات النهائية =====

// متغيرات الخصوصية
let privacySettings = {
    cookiesAccepted: false,
    analyticsEnabled: false,
    functionalEnabled: true,
    marketingEnabled: false,
    privacyPolicyAccepted: false
};

// تحميل إعدادات الخصوصية عند بدء الصفحة
document.addEventListener('DOMContentLoaded', () => {
    loadPrivacySettings();
    setupPrivacyBanner();
    setupSmoothScrolling();
    setupAnimations();
    setupInteractiveElements();
    
    // إعداد خاص لصفحة الخصوصية
    if (window.location.pathname.includes('privacy.html')) {
        setupPrivacyPage();
    }
});

// ===== تحميل إعدادات الخصوصية =====
function loadPrivacySettings() {
    const savedSettings = localStorage.getItem('privacySettings');
    if (savedSettings) {
        privacySettings = { ...privacySettings, ...JSON.parse(savedSettings) };
    }
    
    // عرض بانر الخصوصية إذا لم يتم القبول
    if (!privacySettings.cookiesAccepted) {
        showPrivacyBanner();
    }
}

// ===== حفظ إعدادات الخصوصية =====
function savePrivacySettings() {
    localStorage.setItem('privacySettings', JSON.stringify(privacySettings));
}

// ===== عرض بانر الخصوصية =====
function showPrivacyBanner() {
    const banner = document.createElement('div');
    banner.id = 'privacy-banner';
    banner.className = 'privacy-banner';
    
    banner.innerHTML = `
        <div class="privacy-banner-content">
            <div class="privacy-banner-text">
                <h4>🍪 نحن نحترم خصوصيتك</h4>
                <p>نستخدم ملفات تعريف الارتباط لتحسين تجربتك. يمكنك قبول جميع الملفات أو إدارة تفضيلاتك.</p>
            </div>
            <div class="privacy-banner-actions">
                <button class="btn btn-secondary" onclick="showCookieSettings()">إدارة التفضيلات</button>
                <button class="btn btn-primary" onclick="acceptAllCookies()">قبول الكل</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(banner);
    
    // تأثير الظهور
    setTimeout(() => {
        banner.classList.add('show');
    }, 1000);
}

// ===== إخفاء بانر الخصوصية =====
function hidePrivacyBanner() {
    const banner = document.getElementById('privacy-banner');
    if (banner) {
        banner.classList.add('hide');
        setTimeout(() => {
            if (document.body.contains(banner)) {
                document.body.removeChild(banner);
            }
        }, 500);
    }
}

// ===== قبول جميع ملفات تعريف الارتباط =====
function acceptAllCookies() {
    privacySettings = {
        cookiesAccepted: true,
        analyticsEnabled: true,
        functionalEnabled: true,
        marketingEnabled: true,
        privacyPolicyAccepted: true
    };
    
    savePrivacySettings();
    hidePrivacyBanner();
    
    showNotification('تم حفظ تفضيلات الخصوصية بنجاح!', 'success');
    
    // تفعيل التحليلات
    enableAnalytics();
}

// ===== عرض إعدادات ملفات تعريف الارتباط =====
function showCookieSettings() {
    const modal = document.createElement('div');
    modal.className = 'cookie-settings-modal';
    
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeCookieSettings()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>⚙️ إعدادات الخصوصية</h3>
                <button class="modal-close" onclick="closeCookieSettings()">✕</button>
            </div>
            
            <div class="modal-body">
                <p>اختر أنواع ملفات تعريف الارتباط التي تريد السماح بها:</p>
                
                <div class="cookie-setting-item">
                    <div class="cookie-setting-info">
                        <h4>ملفات تعريف الارتباط الأساسية</h4>
                        <p>ضرورية لعمل الموقع الأساسي</p>
                    </div>
                    <label class="switch">
                        <input type="checkbox" checked disabled>
                        <span class="slider"></span>
                    </label>
                </div>
                
                <div class="cookie-setting-item">
                    <div class="cookie-setting-info">
                        <h4>ملفات تعريف الارتباط الوظيفية</h4>
                        <p>تحسن تجربة الاستخدام وحفظ التفضيلات</p>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="functional-cookies" ${privacySettings.functionalEnabled ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
                
                <div class="cookie-setting-item">
                    <div class="cookie-setting-info">
                        <h4>ملفات تعريف الارتباط التحليلية</h4>
                        <p>تساعدنا في فهم كيفية استخدام الموقع</p>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="analytics-cookies" ${privacySettings.analyticsEnabled ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
                
                <div class="cookie-setting-item">
                    <div class="cookie-setting-info">
                        <h4>ملفات تعريف الارتباط التسويقية</h4>
                        <p>لعرض إعلانات ومحتوى مخصص</p>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="marketing-cookies" ${privacySettings.marketingEnabled ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
            
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeCookieSettings()">إلغاء</button>
                <button class="btn btn-primary" onclick="saveCookieSettings()">حفظ التفضيلات</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // تأثير الظهور
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// ===== إغلاق إعدادات ملفات تعريف الارتباط =====
function closeCookieSettings() {
    const modal = document.querySelector('.cookie-settings-modal');
    if (modal) {
        modal.classList.add('hide');
        setTimeout(() => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        }, 300);
    }
}

// ===== حفظ إعدادات ملفات تعريف الارتباط =====
function saveCookieSettings() {
    privacySettings.functionalEnabled = document.getElementById('functional-cookies').checked;
    privacySettings.analyticsEnabled = document.getElementById('analytics-cookies').checked;
    privacySettings.marketingEnabled = document.getElementById('marketing-cookies').checked;
    privacySettings.cookiesAccepted = true;
    
    savePrivacySettings();
    closeCookieSettings();
    hidePrivacyBanner();
    
    showNotification('تم حفظ تفضيلات الخصوصية بنجاح!', 'success');
    
    // تفعيل/إلغاء التحليلات حسب الإعدادات
    if (privacySettings.analyticsEnabled) {
        enableAnalytics();
    } else {
        disableAnalytics();
    }
}

// ===== قبول سياسة الخصوصية =====
function acceptPrivacyPolicy() {
    privacySettings.privacyPolicyAccepted = true;
    privacySettings.cookiesAccepted = true;
    savePrivacySettings();
    
    showNotification('شكراً لك على قبول سياسة الخصوصية!', 'success');
    
    // إخفاء بانر الخصوصية إذا كان موجوداً
    hidePrivacyBanner();
}

// ===== إعداد صفحة الخصوصية =====
function setupPrivacyPage() {
    // إضافة تأثيرات التمرير للأقسام
    const sections = document.querySelectorAll('.privacy-section');
    sections.forEach((section, index) => {
        section.style.animationDelay = `${index * 0.1}s`;
        section.classList.add('fade-in-up');
    });
    
    // إعداد جدول المحتويات
    createTableOfContents();
}

// ===== إنشاء جدول المحتويات =====
function createTableOfContents() {
    const sections = document.querySelectorAll('.privacy-section h2');
    if (sections.length === 0) return;
    
    const toc = document.createElement('div');
    toc.className = 'table-of-contents';
    toc.innerHTML = '<h3>📋 المحتويات</h3>';
    
    const tocList = document.createElement('ul');
    
    sections.forEach((heading, index) => {
        const id = `section-${index}`;
        heading.id = id;
        
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${id}`;
        link.textContent = heading.textContent;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            smoothScrollTo(heading);
        });
        
        listItem.appendChild(link);
        tocList.appendChild(listItem);
    });
    
    toc.appendChild(tocList);
    
    // إدراج جدول المحتويات بعد المقدمة
    const privacyHeader = document.querySelector('.privacy-header');
    if (privacyHeader) {
        privacyHeader.parentNode.insertBefore(toc, privacyHeader.nextSibling);
    }
}

// ===== إعداد التمرير السلس =====
function setupSmoothScrolling() {
    // التمرير السلس لجميع الروابط الداخلية
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                smoothScrollTo(targetElement);
            }
        });
    });
}

// ===== التمرير السلس إلى عنصر =====
function smoothScrollTo(element) {
    const offsetTop = element.offsetTop - 100; // مساحة إضافية من الأعلى
    
    window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
    });
}

// ===== إعداد الرسوم المتحركة =====
function setupAnimations() {
    // مراقب التقاطع للرسوم المتحركة
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // مراقبة العناصر القابلة للتحريك
    document.querySelectorAll('.fade-in-up, .usage-item, .security-item, .right-item').forEach(el => {
        observer.observe(el);
    });
}

// ===== إعداد العناصر التفاعلية =====
function setupInteractiveElements() {
    // تأثيرات التمرير على البطاقات
    setupCardHoverEffects();
    
    // تأثيرات الأزرار
    setupButtonEffects();
    
    // تأثيرات النماذج
    setupFormEffects();
}

// ===== تأثيرات التمرير على البطاقات =====
function setupCardHoverEffects() {
    const cards = document.querySelectorAll('.usage-item, .security-item, .right-item, .cookie-type');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 16px rgba(0,0,0,0.05)';
        });
    });
}

// ===== تأثيرات الأزرار =====
function setupButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            // تأثير الموجة
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                if (button.contains(ripple)) {
                    button.removeChild(ripple);
                }
            }, 600);
        });
    });
}

// ===== تأثيرات النماذج =====
function setupFormEffects() {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
        
        // إضافة فئة للحقول المملوءة
        input.addEventListener('input', () => {
            if (input.value) {
                input.parentElement.classList.add('filled');
            } else {
                input.parentElement.classList.remove('filled');
            }
        });
    });
}

// ===== تفعيل التحليلات =====
function enableAnalytics() {
    // محاكاة تفعيل Google Analytics أو أدوات التحليل الأخرى
    console.log('تم تفعيل التحليلات');
    
    // في التطبيق الحقيقي، ستقوم بتحميل سكريبت Google Analytics هنا
    // gtag('config', 'GA_MEASUREMENT_ID');
}

// ===== إلغاء التحليلات =====
function disableAnalytics() {
    // محاكاة إلغاء التحليلات
    console.log('تم إلغاء التحليلات');
    
    // في التطبيق الحقيقي، ستقوم بإيقاف Google Analytics هنا
    // window['ga-disable-GA_MEASUREMENT_ID'] = true;
}

// ===== إعداد بانر الخصوصية =====
function setupPrivacyBanner() {
    // التحقق من حالة الخصوصية عند تحميل كل صفحة
    if (!privacySettings.cookiesAccepted) {
        // تأخير عرض البانر قليلاً لتحسين تجربة المستخدم
        setTimeout(showPrivacyBanner, 2000);
    }
}

// ===== وظائف مساعدة =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
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
    }, 4000);
}

// ===== إضافة أنماط CSS للخصوصية والتحسينات =====
const privacyStyles = document.createElement('style');
privacyStyles.textContent = `
    /* أنماط صفحة الخصوصية */
    .privacy-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem;
        line-height: 1.7;
    }
    
    .privacy-header {
        text-align: center;
        margin-bottom: 3rem;
        padding: 2rem;
        background: linear-gradient(135deg, var(--blue-100), var(--blue-50));
        border-radius: 16px;
    }
    
    .privacy-header h1 {
        color: var(--gray-900);
        margin-bottom: 1rem;
        font-size: 2.5rem;
    }
    
    .last-updated {
        color: var(--gray-600);
        font-size: 0.875rem;
        margin-bottom: 1rem;
        font-style: italic;
    }
    
    .intro {
        color: var(--gray-700);
        font-size: 1.1rem;
        max-width: 800px;
        margin: 0 auto;
    }
    
    .table-of-contents {
        background: var(--gray-100);
        border-radius: 12px;
        padding: 1.5rem;
        margin: 2rem 0;
        border-right: 4px solid var(--blue-500);
    }
    
    .table-of-contents h3 {
        margin-bottom: 1rem;
        color: var(--gray-900);
    }
    
    .table-of-contents ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .table-of-contents li {
        margin-bottom: 0.5rem;
    }
    
    .table-of-contents a {
        color: var(--blue-600);
        text-decoration: none;
        transition: color 0.3s ease;
        display: block;
        padding: 0.25rem 0;
    }
    
    .table-of-contents a:hover {
        color: var(--blue-800);
    }
    
    .privacy-section {
        margin-bottom: 3rem;
        background: var(--white);
        border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 4px 16px rgba(0,0,0,0.05);
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
    }
    
    .privacy-section.animate {
        opacity: 1;
        transform: translateY(0);
    }
    
    .privacy-section h2 {
        color: var(--gray-900);
        margin-bottom: 1.5rem;
        font-size: 1.75rem;
        border-bottom: 2px solid var(--blue-100);
        padding-bottom: 0.5rem;
    }
    
    .subsection {
        margin-bottom: 2rem;
    }
    
    .subsection h3 {
        color: var(--gray-800);
        margin-bottom: 1rem;
        font-size: 1.25rem;
    }
    
    .subsection ul {
        padding-right: 1.5rem;
    }
    
    .subsection li {
        margin-bottom: 0.75rem;
        color: var(--gray-700);
    }
    
    .subsection li strong {
        color: var(--gray-900);
    }
    
    /* شبكة الاستخدامات */
    .usage-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-top: 1rem;
    }
    
    .usage-item {
        background: var(--gray-50);
        border-radius: 12px;
        padding: 1.5rem;
        text-align: center;
        transition: all 0.3s ease;
        border: 2px solid transparent;
    }
    
    .usage-item:hover {
        border-color: var(--blue-200);
        background: var(--white);
    }
    
    .usage-icon {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        display: block;
    }
    
    .usage-item h4 {
        color: var(--gray-900);
        margin-bottom: 0.75rem;
        font-size: 1.1rem;
    }
    
    .usage-item p {
        color: var(--gray-600);
        margin: 0;
        font-size: 0.9rem;
    }
    
    /* معلومات المشاركة */
    .sharing-info {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-top: 1rem;
    }
    
    .sharing-policy,
    .sharing-exceptions {
        background: var(--gray-50);
        border-radius: 12px;
        padding: 1.5rem;
    }
    
    .sharing-policy {
        border-right: 4px solid var(--red-500);
    }
    
    .sharing-exceptions {
        border-right: 4px solid var(--green-500);
    }
    
    .sharing-policy h3,
    .sharing-exceptions h3 {
        margin-bottom: 1rem;
        font-size: 1.1rem;
    }
    
    .no-share-list,
    .share-list {
        padding-right: 1.5rem;
        margin: 0;
    }
    
    .no-share-list li,
    .share-list li {
        margin-bottom: 0.75rem;
        color: var(--gray-700);
    }
    
    /* إجراءات الأمان */
    .security-measures {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-top: 1rem;
    }
    
    .security-item {
        background: var(--gray-50);
        border-radius: 12px;
        padding: 1.5rem;
        border-right: 4px solid var(--blue-500);
        transition: all 0.3s ease;
    }
    
    .security-item h4 {
        color: var(--gray-900);
        margin-bottom: 0.75rem;
        font-size: 1.1rem;
    }
    
    .security-item p {
        color: var(--gray-600);
        margin: 0;
        font-size: 0.9rem;
    }
    
    /* شبكة الحقوق */
    .rights-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        margin: 1rem 0 2rem 0;
    }
    
    .right-item {
        background: var(--gray-50);
        border-radius: 12px;
        padding: 1.5rem;
        border-right: 4px solid var(--green-500);
        transition: all 0.3s ease;
    }
    
    .right-item h4 {
        color: var(--gray-900);
        margin-bottom: 0.75rem;
        font-size: 1.1rem;
    }
    
    .right-item p {
        color: var(--gray-600);
        margin: 0;
        font-size: 0.9rem;
    }
    
    .rights-contact {
        background: var(--blue-50);
        border-radius: 12px;
        padding: 1.5rem;
        border-right: 4px solid var(--blue-500);
    }
    
    .rights-contact p {
        margin-bottom: 1rem;
        color: var(--gray-800);
        font-weight: 500;
    }
    
    .rights-contact ul {
        padding-right: 1.5rem;
        margin: 0;
    }
    
    .rights-contact li {
        margin-bottom: 0.5rem;
        color: var(--gray-700);
    }
    
    /* معلومات ملفات تعريف الارتباط */
    .cookies-info {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .cookie-type {
        background: var(--gray-50);
        border-radius: 12px;
        padding: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.3s ease;
    }
    
    .cookie-type h4 {
        color: var(--gray-900);
        margin: 0 0 0.5rem 0;
        font-size: 1.1rem;
    }
    
    .cookie-type p {
        color: var(--gray-600);
        margin: 0;
        font-size: 0.9rem;
    }
    
    .cookie-status {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
        flex-shrink: 0;
    }
    
    .cookie-status.required {
        background: rgba(239, 68, 68, 0.1);
        color: var(--red-600);
    }
    
    .cookie-status.optional {
        background: rgba(16, 185, 129, 0.1);
        color: var(--green-600);
    }
    
    .cookie-control {
        background: var(--blue-50);
        border-radius: 8px;
        padding: 1rem;
        margin-top: 1rem;
    }
    
    .cookie-control a {
        color: var(--blue-600);
        text-decoration: none;
        font-weight: 500;
    }
    
    .cookie-control a:hover {
        color: var(--blue-800);
    }
    
    /* سياسة الأطفال */
    .children-policy {
        background: var(--yellow-50);
        border-radius: 12px;
        padding: 1.5rem;
        border-right: 4px solid var(--yellow-500);
    }
    
    .children-policy p {
        margin-bottom: 1rem;
        color: var(--gray-700);
    }
    
    .children-policy p:last-child {
        margin-bottom: 0;
        font-weight: 500;
        color: var(--gray-800);
    }
    
    /* معلومات التحديثات */
    .updates-info {
        background: var(--gray-50);
        border-radius: 12px;
        padding: 1.5rem;
    }
    
    .update-process {
        margin: 1.5rem 0;
        background: var(--white);
        border-radius: 8px;
        padding: 1rem;
    }
    
    .update-process h4 {
        color: var(--gray-900);
        margin-bottom: 1rem;
    }
    
    .update-process ul {
        padding-right: 1.5rem;
        margin: 0;
    }
    
    .update-process li {
        margin-bottom: 0.5rem;
        color: var(--gray-700);
    }
    
    /* معلومات التواصل */
    .contact-info {
        background: var(--gray-50);
        border-radius: 12px;
        padding: 1.5rem;
    }
    
    .contact-methods {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .contact-method {
        background: var(--white);
        border-radius: 8px;
        padding: 1rem;
        text-align: center;
    }
    
    .contact-method h4 {
        color: var(--gray-900);
        margin-bottom: 0.5rem;
        font-size: 1rem;
    }
    
    .contact-method p {
        color: var(--gray-600);
        margin: 0;
        font-size: 0.9rem;
    }
    
    .contact-method a {
        color: var(--blue-600);
        text-decoration: none;
    }
    
    .contact-method a:hover {
        color: var(--blue-800);
    }
    
    /* قسم الموافقة */
    .consent-section {
        background: linear-gradient(135deg, var(--green-50), var(--blue-50));
        border: 2px solid var(--green-200);
    }
    
    .consent-info {
        text-align: center;
    }
    
    .consent-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 1.5rem;
        flex-wrap: wrap;
    }
    
    /* بانر الخصوصية */
    .privacy-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: var(--white);
        border-top: 3px solid var(--blue-500);
        box-shadow: 0 -4px 20px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateY(100%);
        transition: transform 0.5s ease;
    }
    
    .privacy-banner.show {
        transform: translateY(0);
    }
    
    .privacy-banner.hide {
        transform: translateY(100%);
    }
    
    .privacy-banner-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.5rem 2rem;
        max-width: 1200px;
        margin: 0 auto;
        gap: 2rem;
    }
    
    .privacy-banner-text h4 {
        margin: 0 0 0.5rem 0;
        color: var(--gray-900);
        font-size: 1.1rem;
    }
    
    .privacy-banner-text p {
        margin: 0;
        color: var(--gray-600);
        font-size: 0.9rem;
    }
    
    .privacy-banner-actions {
        display: flex;
        gap: 1rem;
        flex-shrink: 0;
    }
    
    /* نافذة إعدادات ملفات تعريف الارتباط */
    .cookie-settings-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10001;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }
    
    .cookie-settings-modal.show {
        opacity: 1;
        visibility: visible;
    }
    
    .cookie-settings-modal.hide {
        opacity: 0;
        visibility: hidden;
    }
    
    .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        backdrop-filter: blur(4px);
    }
    
    .modal-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--white);
        border-radius: 16px;
        width: 90%;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid var(--gray-200);
    }
    
    .modal-header h3 {
        margin: 0;
        color: var(--gray-900);
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--gray-500);
        padding: 0.25rem;
        border-radius: 4px;
        transition: all 0.3s ease;
    }
    
    .modal-close:hover {
        background: var(--gray-100);
        color: var(--gray-700);
    }
    
    .modal-body {
        padding: 1.5rem;
    }
    
    .cookie-setting-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        padding: 1rem;
        background: var(--gray-50);
        border-radius: 8px;
        margin-bottom: 1rem;
    }
    
    .cookie-setting-info h4 {
        margin: 0 0 0.25rem 0;
        color: var(--gray-900);
        font-size: 1rem;
    }
    
    .cookie-setting-info p {
        margin: 0;
        color: var(--gray-600);
        font-size: 0.875rem;
    }
    
    .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        padding: 1.5rem;
        border-top: 1px solid var(--gray-200);
    }
    
    /* تأثيرات الرسوم المتحركة */
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .fade-in-up {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    /* تأثير الموجة للأزرار */
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    /* الاستجابة للشاشات الصغيرة */
    @media (max-width: 768px) {
        .privacy-container {
            padding: 1rem;
        }
        
        .privacy-header h1 {
            font-size: 2rem;
        }
        
        .usage-grid,
        .security-measures,
        .rights-grid {
            grid-template-columns: 1fr;
        }
        
        .sharing-info {
            grid-template-columns: 1fr;
        }
        
        .contact-methods {
            grid-template-columns: 1fr;
        }
        
        .privacy-banner-content {
            flex-direction: column;
            text-align: center;
            padding: 1rem;
        }
        
        .privacy-banner-actions {
            width: 100%;
            justify-content: center;
        }
        
        .consent-actions {
            flex-direction: column;
            align-items: center;
        }
        
        .modal-content {
            width: 95%;
            margin: 1rem;
        }
    }
`;
document.head.appendChild(privacyStyles);
