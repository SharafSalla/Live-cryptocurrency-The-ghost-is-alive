// ===== وظائف صفحة المجتمع والدعم =====

// متغيرات المجتمع
let communityData = {
    successStories: [],
    profitGallery: [],
    currentFilter: 'all'
};

// تحميل بيانات المجتمع عند بدء الصفحة
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('community-success.html')) {
        loadCommunityData();
        setupCommunityFilters();
    }
    
    if (window.location.pathname.includes('support.html')) {
        setupSupportPage();
    }
});

// ===== تحميل بيانات المجتمع =====
function loadCommunityData() {
    // محاكاة تحميل معرض الأرباح
    generateProfitGallery();
    
    // إعداد نماذج المجتمع
    setupCommunityForms();
}

// ===== توليد معرض الأرباح =====
function generateProfitGallery() {
    const gallery = document.getElementById('profit-gallery');
    if (!gallery) return;
    
    // بيانات وهمية لمعرض الأرباح
    const profits = [
        { user: 'أحمد م.', coin: 'BTC', profit: '+340%', amount: '$1,700', date: '2025-01-05' },
        { user: 'فاطمة س.', coin: 'ETH', profit: '+180%', amount: '$1,800', date: '2025-01-04' },
        { user: 'محمد ع.', coin: 'SOL', profit: '+250%', amount: '$500', date: '2025-01-03' },
        { user: 'سارة أ.', coin: 'ADA', profit: '+120%', amount: '$600', date: '2025-01-02' },
        { user: 'علي ح.', coin: 'MATIC', profit: '+95%', amount: '$475', date: '2025-01-01' },
        { user: 'نور م.', coin: 'DOT', profit: '+160%', amount: '$800', date: '2024-12-31' },
        { user: 'خالد ع.', coin: 'LINK', profit: '+75%', amount: '$375', date: '2024-12-30' },
        { user: 'ليلى س.', coin: 'UNI', profit: '+200%', amount: '$1,000', date: '2024-12-29' }
    ];
    
    const galleryHTML = profits.map(profit => `
        <div class="profit-card">
            <div class="profit-header">
                <div class="user-avatar">${profit.user.charAt(0)}</div>
                <div class="profit-info">
                    <h4>${profit.user}</h4>
                    <p>${profit.coin}</p>
                </div>
                <div class="profit-badge success">${profit.profit}</div>
            </div>
            <div class="profit-details">
                <div class="profit-amount">${profit.amount}</div>
                <div class="profit-date">${formatDate(profit.date)}</div>
            </div>
            <div class="profit-actions">
                <button class="btn btn-secondary btn-sm" onclick="congratulateUser('${profit.user}')">
                    🎉 تهنئة
                </button>
            </div>
        </div>
    `).join('');
    
    gallery.innerHTML = galleryHTML;
}

// ===== تصفية نجاحات المجتمع =====
function filterSuccess(filterType) {
    communityData.currentFilter = filterType;
    
    // إزالة الفئة النشطة من جميع الأزرار
    document.querySelectorAll('.success-filters .btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // إضافة الفئة النشطة للزر المحدد
    event.target.classList.add('active');
    
    // تطبيق التصفية (في التطبيق الحقيقي، ستقوم بتصفية البيانات)
    console.log(`تم تطبيق تصفية: ${filterType}`);
    
    // محاكاة إعادة تحميل المحتوى
    setTimeout(() => {
        showFilterMessage(filterType);
    }, 300);
}

// ===== عرض رسالة التصفية =====
function showFilterMessage(filterType) {
    const messages = {
        'all': 'عرض جميع قصص النجاح',
        'high-profit': 'عرض الأرباح العالية فقط (+100%)',
        'recent': 'عرض أحدث قصص النجاح',
        'stories': 'عرض القصص الملهمة فقط'
    };
    
    showNotification(messages[filterType] || 'تم تطبيق التصفية', 'success');
}

// ===== إعداد نماذج المجتمع =====
function setupCommunityForms() {
    const successForm = document.getElementById('success-form');
    if (successForm) {
        successForm.addEventListener('submit', handleSuccessSubmission);
    }
}

// ===== معالجة إرسال قصة النجاح =====
function handleSuccessSubmission(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('user-name').value || 'مجهول',
        profit: document.getElementById('profit-amount').value,
        coin: document.getElementById('coin-used').value,
        story: document.getElementById('success-story').value,
        tips: document.getElementById('success-tips').value,
        screenshot: document.getElementById('profit-screenshot').files[0]
    };
    
    // التحقق من صحة البيانات
    if (!formData.profit || !formData.coin || !formData.story) {
        showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    // محاكاة إرسال البيانات
    showNotification('جاري إرسال قصة النجاح...', 'info');
    
    setTimeout(() => {
        showNotification('تم إرسال قصة نجاحك بنجاح! سيتم مراجعتها ونشرها قريباً.', 'success');
        successForm.reset();
    }, 2000);
}

// ===== تهنئة المستخدم =====
function congratulateUser(userName) {
    showNotification(`تم إرسال تهنئة إلى ${userName}! 🎉`, 'success');
}

// ===== إعداد صفحة الدعم =====
function setupSupportPage() {
    setupSupportForms();
    setupFAQ();
}

// ===== إعداد نماذج الدعم =====
function setupSupportForms() {
    const supportForm = document.getElementById('support-form');
    const suggestionForm = document.getElementById('suggestion-form');
    
    if (supportForm) {
        supportForm.addEventListener('submit', handleSupportMessage);
    }
    
    if (suggestionForm) {
        suggestionForm.addEventListener('submit', handleSuggestionSubmission);
    }
}

// ===== معالجة رسالة الدعم =====
function handleSupportMessage(event) {
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
        showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    // محاكاة إرسال الرسالة
    showNotification('جاري إرسال رسالتك...', 'info');
    
    setTimeout(() => {
        showNotification('تم إرسال رسالتك بنجاح! سنرد عليك في أقرب وقت ممكن.', 'success');
        document.getElementById('support-form').reset();
    }, 2000);
}

// ===== معالجة إرسال الاقتراح =====
function handleSuggestionSubmission(event) {
    event.preventDefault();
    
    const title = document.getElementById('suggestion-title').value;
    const description = document.getElementById('suggestion-description').value;
    
    if (!title || !description) {
        showNotification('يرجى ملء جميع حقول الاقتراح', 'error');
        return;
    }
    
    // محاكاة إضافة الاقتراح
    showNotification('جاري إضافة اقتراحك...', 'info');
    
    setTimeout(() => {
        showNotification('تم إضافة اقتراحك بنجاح! سيظهر في القائمة بعد المراجعة.', 'success');
        document.getElementById('suggestion-form').reset();
    }, 1500);
}

// ===== التصويت على الاقتراحات =====
function voteSuggestion(suggestionId, voteType) {
    const button = event.target.closest('.vote-btn');
    const countSpan = button.querySelector('span');
    let currentCount = parseInt(countSpan.textContent);
    
    // محاكاة التصويت
    if (voteType === 'up') {
        countSpan.textContent = currentCount + 1;
        showNotification('تم تسجيل تصويتك الإيجابي!', 'success');
    } else {
        countSpan.textContent = Math.max(0, currentCount + 1);
        showNotification('تم تسجيل تصويتك السلبي!', 'info');
    }
    
    // تعطيل الزر مؤقتاً
    button.disabled = true;
    setTimeout(() => {
        button.disabled = false;
    }, 3000);
}

// ===== نسخ النص إلى الحافظة =====
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        showNotification('تم نسخ النص بنجاح!', 'success');
        
        // تغيير نص الزر مؤقتاً
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = '✅ تم النسخ';
        button.style.backgroundColor = 'var(--green-500)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
        }, 2000);
    }).catch(() => {
        showNotification('فشل في نسخ النص. يرجى النسخ يدوياً.', 'error');
    });
}

// ===== إعداد الأسئلة الشائعة =====
function setupFAQ() {
    // تم إعداد الأحداث في HTML مباشرة
}

// ===== تبديل عرض الأسئلة الشائعة =====
function toggleFAQ(faqId) {
    const answer = document.getElementById(`faq-${faqId}`);
    const toggle = event.target.closest('.faq-question').querySelector('.faq-toggle');
    
    if (answer.style.display === 'block') {
        answer.style.display = 'none';
        toggle.textContent = '+';
    } else {
        // إغلاق جميع الأسئلة الأخرى
        document.querySelectorAll('.faq-answer').forEach(ans => {
            ans.style.display = 'none';
        });
        document.querySelectorAll('.faq-toggle').forEach(tog => {
            tog.textContent = '+';
        });
        
        // فتح السؤال المحدد
        answer.style.display = 'block';
        toggle.textContent = '-';
    }
}

// ===== وظائف مساعدة =====
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: 'Asia/Riyadh'
    };
    return date.toLocaleDateString('ar-SA', options);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
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
        border-radius: 8px;
        z-index: 10000;
        max-width: 350px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // إزالة الإشعار بعد 5 ثوان
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// ===== إضافة أنماط CSS للمجتمع والدعم =====
const communityStyles = document.createElement('style');
communityStyles.textContent = `
    /* أنماط معرض الأرباح */
    .profit-gallery {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
        margin-top: 1rem;
    }
    
    .profit-card {
        background: var(--white);
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 4px 16px rgba(0,0,0,0.05);
        transition: all 0.3s ease;
    }
    
    .profit-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    }
    
    .profit-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    
    .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--blue-500);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    }
    
    .profit-info h4 {
        margin: 0;
        font-size: 1rem;
        color: var(--gray-900);
    }
    
    .profit-info p {
        margin: 0;
        font-size: 0.875rem;
        color: var(--gray-600);
    }
    
    .profit-badge {
        margin-right: auto;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.875rem;
    }
    
    .profit-badge.success {
        background: rgba(16, 185, 129, 0.1);
        color: var(--green-500);
    }
    
    .profit-details {
        text-align: center;
        margin-bottom: 1rem;
    }
    
    .profit-amount {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--green-500);
        margin-bottom: 0.25rem;
    }
    
    .profit-date {
        font-size: 0.875rem;
        color: var(--gray-600);
    }
    
    .profit-actions {
        text-align: center;
    }
    
    .btn-sm {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
    }
    
    /* أنماط قصص النجاح */
    .success-stories {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }
    
    .success-story {
        background: var(--white);
        border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 4px 16px rgba(0,0,0,0.05);
    }
    
    .story-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--gray-200);
    }
    
    .user-info {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--blue-500);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 1.25rem;
    }
    
    .user-details h3 {
        margin: 0;
        color: var(--gray-900);
    }
    
    .user-details p {
        margin: 0;
        color: var(--gray-600);
        font-size: 0.875rem;
    }
    
    .story-content h4 {
        color: var(--gray-900);
        margin-bottom: 1rem;
    }
    
    .story-content p {
        line-height: 1.7;
        margin-bottom: 1rem;
        color: var(--gray-700);
    }
    
    .story-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin: 1.5rem 0;
        padding: 1rem;
        background: var(--gray-100);
        border-radius: 8px;
    }
    
    .story-stats .stat {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .story-stats .label {
        font-size: 0.875rem;
        color: var(--gray-600);
    }
    
    .story-stats .value {
        font-weight: 600;
        color: var(--gray-900);
    }
    
    .story-stats .value.success {
        color: var(--green-500);
    }
    
    .story-tips {
        margin-top: 1.5rem;
        padding: 1rem;
        background: rgba(59, 130, 246, 0.05);
        border-radius: 8px;
        border-right: 4px solid var(--blue-500);
    }
    
    .story-tips h5 {
        margin-bottom: 0.75rem;
        color: var(--blue-900);
    }
    
    .story-tips ul {
        margin: 0;
        padding-right: 1.5rem;
    }
    
    .story-tips li {
        margin-bottom: 0.5rem;
        color: var(--gray-700);
    }
    
    /* أنماط الدعم */
    .success-filters, .recommendation-filters {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 1.5rem;
    }
    
    .support-benefits {
        list-style: none;
        padding: 0;
        margin: 1.5rem 0;
    }
    
    .support-benefits li {
        padding: 0.75rem 0;
        border-bottom: 1px solid var(--gray-200);
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .support-methods {
        margin-top: 2rem;
    }
    
    .support-method {
        background: var(--white);
        border: 2px solid var(--gray-200);
        border-radius: 12px;
        margin-bottom: 2rem;
        overflow: hidden;
    }
    
    .method-header {
        background: var(--gray-100);
        padding: 1rem 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .method-header h4 {
        margin: 0;
        color: var(--gray-900);
    }
    
    .method-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
        background: var(--blue-100);
        color: var(--blue-900);
    }
    
    .method-badge.recommended {
        background: var(--green-100);
        color: var(--green-900);
    }
    
    .method-content {
        padding: 1.5rem;
    }
    
    .support-info {
        margin: 1rem 0;
    }
    
    .info-item {
        margin-bottom: 1rem;
    }
    
    .info-item .label {
        display: block;
        font-size: 0.875rem;
        color: var(--gray-600);
        margin-bottom: 0.5rem;
    }
    
    .copy-container {
        display: flex;
        gap: 0.75rem;
        align-items: center;
    }
    
    .wallet-address {
        font-family: monospace;
        background: var(--gray-100);
        padding: 0.5rem;
        border-radius: 6px;
        font-size: 0.875rem;
        word-break: break-all;
        flex: 1;
    }
    
    .network {
        font-weight: 600;
        color: var(--blue-600);
    }
    
    .method-warning {
        background: rgba(245, 158, 11, 0.1);
        border: 1px solid var(--yellow-500);
        border-radius: 8px;
        padding: 1rem;
        margin-top: 1rem;
    }
    
    .method-steps {
        margin-top: 1rem;
    }
    
    .method-steps h5 {
        margin-bottom: 0.75rem;
        color: var(--gray-800);
    }
    
    .method-steps ol {
        padding-right: 1.5rem;
    }
    
    .method-steps li {
        margin-bottom: 0.5rem;
        color: var(--gray-700);
    }
    
    /* أنماط الشهادات */
    .testimonials {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-top: 1rem;
    }
    
    .testimonial {
        background: var(--white);
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 4px 16px rgba(0,0,0,0.05);
    }
    
    .testimonial-content {
        margin-bottom: 1rem;
    }
    
    .testimonial-content p {
        font-style: italic;
        color: var(--gray-700);
        line-height: 1.6;
    }
    
    .testimonial-author {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 1rem;
        border-top: 1px solid var(--gray-200);
    }
    
    .testimonial-author .name {
        font-weight: 600;
        color: var(--gray-900);
    }
    
    .testimonial-author .support {
        font-size: 0.875rem;
        color: var(--green-600);
        font-weight: 500;
    }
    
    /* أنماط الاقتراحات */
    .suggestions-list {
        margin-bottom: 2rem;
    }
    
    .suggestion-item {
        background: var(--white);
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
    }
    
    .suggestion-content {
        flex: 1;
    }
    
    .suggestion-content h4 {
        margin: 0 0 0.5rem 0;
        color: var(--gray-900);
    }
    
    .suggestion-content p {
        margin: 0 0 0.75rem 0;
        color: var(--gray-700);
        line-height: 1.5;
    }
    
    .suggestion-meta {
        display: flex;
        gap: 1rem;
        font-size: 0.875rem;
        color: var(--gray-600);
    }
    
    .suggestion-votes {
        display: flex;
        gap: 0.5rem;
    }
    
    .vote-btn {
        background: var(--gray-100);
        border: none;
        border-radius: 6px;
        padding: 0.5rem 0.75rem;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.875rem;
    }
    
    .vote-btn:hover {
        background: var(--gray-200);
    }
    
    .vote-btn.upvote:hover {
        background: rgba(16, 185, 129, 0.1);
        color: var(--green-600);
    }
    
    .vote-btn.downvote:hover {
        background: rgba(239, 68, 68, 0.1);
        color: var(--red-600);
    }
    
    .add-suggestion {
        background: var(--gray-100);
        border-radius: 12px;
        padding: 1.5rem;
    }
    
    .add-suggestion h4 {
        margin-bottom: 1rem;
        color: var(--gray-900);
    }
    
    /* أنماط الأسئلة الشائعة */
    .faq-container {
        max-width: 800px;
        margin: 0 auto;
    }
    
    .faq-item {
        background: var(--white);
        border-radius: 8px;
        margin-bottom: 1rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    
    .faq-question {
        padding: 1.5rem;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: background-color 0.3s ease;
    }
    
    .faq-question:hover {
        background: var(--gray-50);
    }
    
    .faq-question h4 {
        margin: 0;
        color: var(--gray-900);
    }
    
    .faq-toggle {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--blue-500);
    }
    
    .faq-answer {
        display: none;
        padding: 0 1.5rem 1.5rem;
        color: var(--gray-700);
        line-height: 1.6;
    }
    
    /* الإشعارات */
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
    
    /* الاستجابة للشاشات الصغيرة */
    @media (max-width: 768px) {
        .profit-gallery {
            grid-template-columns: 1fr;
        }
        
        .story-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }
        
        .story-stats {
            grid-template-columns: 1fr;
        }
        
        .success-filters, .recommendation-filters {
            flex-direction: column;
            align-items: center;
        }
        
        .copy-container {
            flex-direction: column;
            align-items: stretch;
        }
        
        .wallet-address {
            text-align: center;
        }
        
        .suggestion-item {
            flex-direction: column;
        }
        
        .suggestion-votes {
            align-self: flex-start;
        }
        
        .testimonials {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(communityStyles);
