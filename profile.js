// ===== وظائف الملف الشخصي =====

// متغيرات الملف الشخصي
let profileData = {
    currentSection: 'dashboard',
    userStats: {},
    favorites: [],
    performance: {},
    notifications: {}
};

// تحميل بيانات الملف الشخصي عند بدء الصفحة
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('profile.html')) {
        initializeProfile();
    }
});

// ===== تهيئة الملف الشخصي =====
function initializeProfile() {
    // التحقق من تسجيل الدخول
    if (!authState.isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
    
    loadProfileData();
    setupProfileNavigation();
    setupProfileForms();
    loadUserDashboard();
}

// ===== تحميل بيانات الملف الشخصي =====
function loadProfileData() {
    // تحميل البيانات من localStorage أو API
    const savedProfile = localStorage.getItem('profileData');
    if (savedProfile) {
        profileData = { ...profileData, ...JSON.parse(savedProfile) };
    }
    
    // تحديث معلومات المستخدم في الواجهة
    updateUserInfo();
}

// ===== تحديث معلومات المستخدم =====
function updateUserInfo() {
    const user = authState.currentUser;
    if (!user) return;
    
    // تحديث الاسم والبريد الإلكتروني
    const nameElement = document.getElementById('user-name');
    const emailElement = document.getElementById('user-email');
    
    if (nameElement) {
        nameElement.textContent = `${user.firstName} ${user.lastName}`;
    }
    
    if (emailElement) {
        emailElement.textContent = user.email;
    }
    
    // تحديث الإحصائيات
    updateUserStats();
}

// ===== تحديث إحصائيات المستخدم =====
function updateUserStats() {
    // محاكاة إحصائيات المستخدم
    const stats = {
        memberSince: calculateMembershipDuration(),
        totalProfit: '+340%',
        followingRecommendations: 23,
        totalEarnings: '$1,700',
        successRate: '87%',
        successfulTrades: 15
    };
    
    // تحديث العناصر في الواجهة
    updateStatElement('member-since', stats.memberSince);
    updateStatElement('total-profit', stats.totalProfit);
    
    // تحديث إحصائيات لوحة التحكم
    updateDashboardStats(stats);
}

// ===== حساب مدة العضوية =====
function calculateMembershipDuration() {
    const user = authState.currentUser;
    if (!user || !user.joinDate) return '0 أيام';
    
    const joinDate = new Date(user.joinDate);
    const now = new Date();
    const diffTime = Math.abs(now - joinDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} يوم`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} شهر`;
    return `${Math.floor(diffDays / 365)} سنة`;
}

// ===== تحديث عنصر إحصائي =====
function updateStatElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

// ===== تحديث إحصائيات لوحة التحكم =====
function updateDashboardStats(stats) {
    const statElements = {
        'following-recommendations': stats.followingRecommendations,
        'total-earnings': stats.totalEarnings,
        'success-rate': stats.successRate,
        'successful-trades': stats.successfulTrades
    };
    
    Object.entries(statElements).forEach(([id, value]) => {
        const element = document.querySelector(`[data-stat="${id}"]`);
        if (element) {
            element.textContent = value;
        }
    });
}

// ===== إعداد التنقل في الملف الشخصي =====
function setupProfileNavigation() {
    const navLinks = document.querySelectorAll('.profile-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
}

// ===== معالجة النقر على التنقل =====
function handleNavClick(event) {
    event.preventDefault();
    
    const clickedLink = event.target;
    const sectionId = clickedLink.getAttribute('href').substring(1);
    
    showSection(sectionId);
}

// ===== عرض قسم معين =====
function showSection(sectionId) {
    // إخفاء جميع الأقسام
    document.querySelectorAll('.profile-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // إزالة الفئة النشطة من جميع روابط التنقل
    document.querySelectorAll('.profile-nav .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // عرض القسم المحدد
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // تفعيل رابط التنقل المحدد
    const activeLink = document.querySelector(`[href="#${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // تحديث القسم الحالي
    profileData.currentSection = sectionId;
    
    // تحميل بيانات القسم
    loadSectionData(sectionId);
}

// ===== تحميل بيانات القسم =====
function loadSectionData(sectionId) {
    switch (sectionId) {
        case 'dashboard':
            loadUserDashboard();
            break;
        case 'favorites':
            loadFavorites();
            break;
        case 'performance':
            loadPerformanceData();
            break;
        case 'notifications':
            loadNotifications();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

// ===== تحميل لوحة التحكم =====
function loadUserDashboard() {
    // تحميل النشاط الأخير
    loadRecentActivity();
    
    // تحميل التوصيات النشطة
    loadActiveRecommendations();
}

// ===== تحميل النشاط الأخير =====
function loadRecentActivity() {
    // محاكاة النشاط الأخير
    const activities = [
        {
            type: 'success',
            icon: '✅',
            title: 'تحقق الهدف الأول لـ BTC/USDT',
            description: 'ربح +12.5% من التوصية',
            time: 'منذ ساعتين'
        },
        {
            type: 'info',
            icon: '⭐',
            title: 'إضافة ETH/USDT للمفضلة',
            description: 'تم حفظ التوصية للمتابعة',
            time: 'منذ 4 ساعات'
        },
        {
            type: 'warning',
            icon: '⚠️',
            title: 'تفعيل وقف الخسارة لـ SOL/USDT',
            description: 'خسارة محدودة -3.2%',
            time: 'أمس'
        }
    ];
    
    const activityList = document.querySelector('.activity-list');
    if (activityList) {
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">${activity.icon}</div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `).join('');
    }
}

// ===== تحميل التوصيات النشطة =====
function loadActiveRecommendations() {
    // محاكاة التوصيات النشطة
    const activeRecs = [
        {
            symbol: 'BTC/USDT',
            logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
            status: 'bullish',
            statusText: '🟢 ارتفاع',
            progress: 75,
            progressText: 'الهدف الثاني'
        },
        {
            symbol: 'ETH/USDT',
            logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
            status: 'bearish',
            statusText: '🔴 انخفاض',
            progress: 40,
            progressText: 'في الانتظار'
        }
    ];
    
    const recsGrid = document.querySelector('.recommendations-grid');
    if (recsGrid) {
        recsGrid.innerHTML = activeRecs.map(rec => `
            <div class="recommendation-mini">
                <div class="coin-info">
                    <img src="${rec.logo}" alt="${rec.symbol}" width="24" height="24" onerror="this.style.display='none'">
                    <span>${rec.symbol}</span>
                </div>
                <div class="recommendation-status ${rec.status}">${rec.statusText}</div>
                <div class="recommendation-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${rec.progress}%"></div>
                    </div>
                    <span>${rec.progressText}</span>
                </div>
            </div>
        `).join('');
    }
}

// ===== تحميل المفضلة =====
function loadFavorites() {
    // محاكاة التوصيات المفضلة
    const favorites = [
        {
            id: 'btc',
            symbol: 'BTC/USDT',
            name: 'Bitcoin',
            logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
            status: 'active',
            statusText: 'نشط',
            entryPrice: 28500,
            currentPrice: 32100,
            profit: 12.6
        },
        {
            id: 'eth',
            symbol: 'ETH/USDT',
            name: 'Ethereum',
            logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
            status: 'pending',
            statusText: 'في الانتظار',
            entryPrice: 2150,
            currentPrice: 2180,
            profit: 1.4
        }
    ];
    
    const favoritesList = document.querySelector('.favorites-list');
    if (favoritesList) {
        favoritesList.innerHTML = favorites.map(fav => `
            <div class="favorite-item">
                <div class="favorite-header">
                    <div class="coin-info">
                        <img src="${fav.logo}" alt="${fav.symbol}" width="32" height="32" onerror="this.style.display='none'">
                        <div>
                            <h4>${fav.symbol}</h4>
                            <p>${fav.name}</p>
                        </div>
                    </div>
                    <div class="favorite-status">
                        <span class="status-badge ${fav.status}">${fav.statusText}</span>
                        <button class="btn btn-secondary btn-sm" onclick="removeFavorite('${fav.id}')">🗑️</button>
                    </div>
                </div>
                <div class="favorite-details">
                    <div class="detail-item">
                        <span class="label">سعر الدخول:</span>
                        <span class="value">$${fav.entryPrice.toLocaleString()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">السعر الحالي:</span>
                        <span class="value">$${fav.currentPrice.toLocaleString()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">${fav.profit > 0 ? 'الربح الحالي:' : 'التغيير:'}</span>
                        <span class="value ${fav.profit > 0 ? 'success' : 'neutral'}">+${fav.profit}%</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// ===== تحميل بيانات الأداء =====
function loadPerformanceData() {
    // محاكاة بيانات الأداء
    const performanceStats = {
        initialCapital: 500,
        currentValue: 2200,
        totalProfit: 1700,
        growthRate: 340,
        bestTrade: '+45% (BTC)',
        worstTrade: '-8% (ADA)'
    };
    
    // تحديث الإحصائيات
    const statsContainer = document.querySelector('.performance-stats');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="stat-row">
                <span class="stat-label">رأس المال الأولي:</span>
                <span class="stat-value">$${performanceStats.initialCapital}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">القيمة الحالية:</span>
                <span class="stat-value">$${performanceStats.currentValue.toLocaleString()}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">إجمالي الربح:</span>
                <span class="stat-value success">$${performanceStats.totalProfit.toLocaleString()}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">نسبة النمو:</span>
                <span class="stat-value success">+${performanceStats.growthRate}%</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">أفضل صفقة:</span>
                <span class="stat-value success">${performanceStats.bestTrade}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">أسوأ صفقة:</span>
                <span class="stat-value error">${performanceStats.worstTrade}</span>
            </div>
        `;
    }
}

// ===== تحميل التنبيهات =====
function loadNotifications() {
    // إعداد مفاتيح التنبيهات
    setupNotificationToggles();
}

// ===== إعداد مفاتيح التنبيهات =====
function setupNotificationToggles() {
    const toggles = document.querySelectorAll('.notifications-settings .switch input');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', handleNotificationToggle);
    });
}

// ===== معالجة تغيير التنبيهات =====
function handleNotificationToggle(event) {
    const toggle = event.target;
    const notificationType = toggle.closest('.notification-item').querySelector('h4').textContent;
    
    if (toggle.checked) {
        showProfileNotification(`تم تفعيل تنبيهات: ${notificationType}`, 'success');
    } else {
        showProfileNotification(`تم إلغاء تنبيهات: ${notificationType}`, 'info');
    }
    
    // حفظ الإعدادات
    saveNotificationSettings();
}

// ===== تحميل الإعدادات =====
function loadSettings() {
    // تحميل إعدادات المستخدم
    const user = authState.currentUser;
    if (!user) return;
    
    // تحديث حقول النموذج
    const displayNameInput = document.getElementById('display-name');
    const emailInput = document.getElementById('user-email-settings');
    const countrySelect = document.getElementById('user-country');
    
    if (displayNameInput) {
        displayNameInput.value = `${user.firstName} ${user.lastName}`;
    }
    
    if (emailInput) {
        emailInput.value = user.email;
    }
    
    if (countrySelect && user.country) {
        countrySelect.value = user.country;
    }
}

// ===== إعداد نماذج الملف الشخصي =====
function setupProfileForms() {
    const settingsForm = document.querySelector('.settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', handleSettingsUpdate);
    }
}

// ===== معالجة تحديث الإعدادات =====
function handleSettingsUpdate(event) {
    event.preventDefault();
    
    const formData = {
        displayName: document.getElementById('display-name').value,
        email: document.getElementById('user-email-settings').value,
        country: document.getElementById('user-country').value
    };
    
    // تحديث بيانات المستخدم
    if (authState.currentUser) {
        const nameParts = formData.displayName.split(' ');
        authState.currentUser.firstName = nameParts[0] || '';
        authState.currentUser.lastName = nameParts.slice(1).join(' ') || '';
        authState.currentUser.email = formData.email;
        authState.currentUser.country = formData.country;
        
        saveAuthState();
    }
    
    showProfileNotification('تم حفظ التغييرات بنجاح!', 'success');
}

// ===== إزالة من المفضلة =====
function removeFavorite(favoriteId) {
    // إزالة من قائمة المفضلة
    profileData.favorites = profileData.favorites.filter(fav => fav.id !== favoriteId);
    
    // إعادة تحميل المفضلة
    loadFavorites();
    
    showProfileNotification('تم إزالة التوصية من المفضلة', 'info');
}

// ===== تغيير الصورة الشخصية =====
function changeAvatar() {
    // محاكاة تغيير الصورة الشخصية
    showProfileNotification('ميزة تغيير الصورة الشخصية ستكون متاحة قريباً', 'info');
}

// ===== تغيير كلمة المرور =====
function changePassword() {
    // محاكاة تغيير كلمة المرور
    showProfileNotification('ميزة تغيير كلمة المرور ستكون متاحة قريباً', 'info');
}

// ===== تفعيل المصادقة الثنائية =====
function enable2FA() {
    // محاكاة تفعيل المصادقة الثنائية
    showProfileNotification('ميزة المصادقة الثنائية ستكون متاحة قريباً', 'info');
}

// ===== حذف الحساب =====
function deleteAccount() {
    const confirmation = confirm('هل أنت متأكد من رغبتك في حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.');
    
    if (confirmation) {
        const finalConfirmation = confirm('تأكيد أخير: سيتم حذف جميع بياناتك نهائياً. هل تريد المتابعة؟');
        
        if (finalConfirmation) {
            // محاكاة حذف الحساب
            showProfileNotification('جاري حذف الحساب...', 'warning');
            
            setTimeout(() => {
                // تسجيل الخروج وحذف البيانات
                localStorage.removeItem('authState');
                localStorage.removeItem('profileData');
                
                alert('تم حذف حسابك بنجاح. شكراً لاستخدامك خدماتنا.');
                window.location.href = 'index.html';
            }, 3000);
        }
    }
}

// ===== حفظ إعدادات التنبيهات =====
function saveNotificationSettings() {
    const settings = {};
    
    document.querySelectorAll('.notifications-settings .switch input').forEach(toggle => {
        const settingName = toggle.closest('.notification-item').querySelector('h4').textContent;
        settings[settingName] = toggle.checked;
    });
    
    profileData.notifications = settings;
    localStorage.setItem('profileData', JSON.stringify(profileData));
}

// ===== عرض إشعارات الملف الشخصي =====
function showProfileNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `profile-notification profile-notification-${type}`;
    
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

// ===== إضافة أنماط CSS للملف الشخصي =====
const profileStyles = document.createElement('style');
profileStyles.textContent = `
    /* أنماط الملف الشخصي */
    .profile-container {
        display: flex;
        gap: 2rem;
        max-width: 1400px;
        margin: 0 auto;
        padding: 2rem;
        min-height: calc(100vh - 200px);
    }
    
    .profile-sidebar {
        width: 300px;
        flex-shrink: 0;
    }
    
    .profile-card {
        background: var(--white);
        border-radius: 16px;
        padding: 2rem;
        text-align: center;
        box-shadow: 0 4px 16px rgba(0,0,0,0.05);
        margin-bottom: 2rem;
    }
    
    .profile-avatar {
        position: relative;
        display: inline-block;
        margin-bottom: 1rem;
    }
    
    .profile-avatar img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        border: 4px solid var(--blue-100);
    }
    
    .change-avatar-btn {
        position: absolute;
        bottom: 0;
        right: 0;
        background: var(--blue-500);
        border: none;
        border-radius: 50%;
        width: 28px;
        height: 28px;
        cursor: pointer;
        font-size: 0.75rem;
        transition: all 0.3s ease;
    }
    
    .change-avatar-btn:hover {
        background: var(--blue-600);
        transform: scale(1.1);
    }
    
    .profile-info h2 {
        margin: 0 0 0.5rem 0;
        color: var(--gray-900);
    }
    
    .profile-info p {
        margin: 0 0 1rem 0;
        color: var(--gray-600);
        font-size: 0.875rem;
    }
    
    .profile-stats {
        display: flex;
        justify-content: space-around;
        padding-top: 1rem;
        border-top: 1px solid var(--gray-200);
    }
    
    .stat {
        text-align: center;
    }
    
    .stat-value {
        display: block;
        font-size: 1.25rem;
        font-weight: bold;
        color: var(--blue-600);
    }
    
    .stat-label {
        font-size: 0.75rem;
        color: var(--gray-600);
    }
    
    .profile-nav {
        background: var(--white);
        border-radius: 16px;
        padding: 1rem;
        box-shadow: 0 4px 16px rgba(0,0,0,0.05);
    }
    
    .profile-nav ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .profile-nav li {
        margin-bottom: 0.5rem;
    }
    
    .nav-link {
        display: flex;
        align-items: center;
        padding: 0.75rem 1rem;
        color: var(--gray-700);
        text-decoration: none;
        border-radius: 8px;
        transition: all 0.3s ease;
        font-weight: 500;
    }
    
    .nav-link:hover {
        background: var(--gray-100);
        color: var(--gray-900);
    }
    
    .nav-link.active {
        background: var(--blue-100);
        color: var(--blue-900);
    }
    
    .profile-content {
        flex: 1;
        background: var(--white);
        border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 4px 16px rgba(0,0,0,0.05);
    }
    
    .profile-section {
        display: none;
    }
    
    .profile-section.active {
        display: block;
    }
    
    .section-header {
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--gray-200);
    }
    
    .section-header h1 {
        margin: 0 0 0.5rem 0;
        color: var(--gray-900);
    }
    
    .section-header p {
        margin: 0;
        color: var(--gray-600);
    }
    
    /* لوحة التحكم */
    .dashboard-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }
    
    .stat-card {
        background: var(--gray-100);
        border-radius: 12px;
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .stat-icon {
        font-size: 2rem;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--white);
        border-radius: 12px;
    }
    
    .stat-info h3 {
        margin: 0;
        font-size: 1.5rem;
        color: var(--gray-900);
    }
    
    .stat-info p {
        margin: 0;
        color: var(--gray-600);
        font-size: 0.875rem;
    }
    
    /* النشاط الأخير */
    .recent-activity {
        margin-bottom: 2rem;
    }
    
    .recent-activity h3 {
        margin-bottom: 1rem;
        color: var(--gray-900);
    }
    
    .activity-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .activity-item {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        padding: 1rem;
        background: var(--gray-50);
        border-radius: 8px;
    }
    
    .activity-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        flex-shrink: 0;
    }
    
    .activity-icon.success {
        background: rgba(16, 185, 129, 0.1);
        color: var(--green-600);
    }
    
    .activity-icon.info {
        background: rgba(59, 130, 246, 0.1);
        color: var(--blue-600);
    }
    
    .activity-icon.warning {
        background: rgba(245, 158, 11, 0.1);
        color: var(--yellow-600);
    }
    
    .activity-content h4 {
        margin: 0 0 0.25rem 0;
        color: var(--gray-900);
        font-size: 1rem;
    }
    
    .activity-content p {
        margin: 0 0 0.5rem 0;
        color: var(--gray-600);
        font-size: 0.875rem;
    }
    
    .activity-time {
        font-size: 0.75rem;
        color: var(--gray-500);
    }
    
    /* التوصيات النشطة */
    .active-recommendations h3 {
        margin-bottom: 1rem;
        color: var(--gray-900);
    }
    
    .recommendations-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
    }
    
    .recommendation-mini {
        background: var(--gray-50);
        border-radius: 8px;
        padding: 1rem;
    }
    
    .coin-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
    }
    
    .coin-info img {
        border-radius: 50%;
    }
    
    .recommendation-status {
        font-size: 0.875rem;
        font-weight: 500;
        margin-bottom: 0.75rem;
    }
    
    .recommendation-status.bullish {
        color: var(--green-600);
    }
    
    .recommendation-status.bearish {
        color: var(--red-600);
    }
    
    .recommendation-progress {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .progress-bar {
        height: 6px;
        background: var(--gray-200);
        border-radius: 3px;
        overflow: hidden;
    }
    
    .progress-fill {
        height: 100%;
        background: var(--blue-500);
        transition: width 0.3s ease;
    }
    
    .recommendation-progress span {
        font-size: 0.75rem;
        color: var(--gray-600);
    }
    
    /* المفضلة */
    .favorites-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
    
    .favorite-item {
        background: var(--gray-50);
        border-radius: 12px;
        padding: 1.5rem;
    }
    
    .favorite-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .favorite-header .coin-info {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .favorite-header .coin-info h4 {
        margin: 0;
        color: var(--gray-900);
    }
    
    .favorite-header .coin-info p {
        margin: 0;
        color: var(--gray-600);
        font-size: 0.875rem;
    }
    
    .favorite-status {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
    }
    
    .status-badge.active {
        background: rgba(16, 185, 129, 0.1);
        color: var(--green-600);
    }
    
    .status-badge.pending {
        background: rgba(245, 158, 11, 0.1);
        color: var(--yellow-600);
    }
    
    .favorite-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
    }
    
    .detail-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .detail-item .label {
        font-size: 0.875rem;
        color: var(--gray-600);
    }
    
    .detail-item .value {
        font-weight: 600;
        color: var(--gray-900);
    }
    
    .detail-item .value.success {
        color: var(--green-600);
    }
    
    .detail-item .value.neutral {
        color: var(--blue-600);
    }
    
    /* الأداء */
    .performance-overview {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 2rem;
    }
    
    .performance-card {
        background: var(--gray-50);
        border-radius: 12px;
        padding: 1.5rem;
    }
    
    .performance-card h3 {
        margin-bottom: 1rem;
        color: var(--gray-900);
    }
    
    .chart-placeholder {
        height: 200px;
        background: var(--white);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--gray-600);
        font-size: 1.5rem;
    }
    
    .chart-placeholder p {
        margin: 0.5rem 0 0 0;
        font-size: 1rem;
        color: var(--green-600);
        font-weight: bold;
    }
    
    .performance-stats {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .stat-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        background: var(--white);
        border-radius: 8px;
    }
    
    .stat-row .stat-label {
        color: var(--gray-600);
        font-size: 0.875rem;
    }
    
    .stat-row .stat-value {
        font-weight: 600;
        color: var(--gray-900);
    }
    
    .stat-row .stat-value.success {
        color: var(--green-600);
    }
    
    .stat-row .stat-value.error {
        color: var(--red-600);
    }
    
    /* التنبيهات */
    .notifications-settings {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }
    
    .notification-group h3 {
        margin-bottom: 1rem;
        color: var(--gray-900);
    }
    
    .notification-item {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        padding: 1rem;
        background: var(--gray-50);
        border-radius: 8px;
        margin-bottom: 1rem;
    }
    
    .notification-info h4 {
        margin: 0 0 0.25rem 0;
        color: var(--gray-900);
        font-size: 1rem;
    }
    
    .notification-info p {
        margin: 0;
        color: var(--gray-600);
        font-size: 0.875rem;
    }
    
    /* مفتاح التبديل */
    .switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 24px;
        flex-shrink: 0;
    }
    
    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--gray-300);
        transition: 0.3s;
        border-radius: 24px;
    }
    
    .slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.3s;
        border-radius: 50%;
    }
    
    input:checked + .slider {
        background-color: var(--blue-500);
    }
    
    input:checked + .slider:before {
        transform: translateX(26px);
    }
    
    /* الإعدادات */
    .settings-groups {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }
    
    .settings-group {
        background: var(--gray-50);
        border-radius: 12px;
        padding: 1.5rem;
    }
    
    .settings-group h3 {
        margin-bottom: 1rem;
        color: var(--gray-900);
    }
    
    .settings-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .security-options {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }
    
    .preference-item {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        padding: 1rem;
        background: var(--white);
        border-radius: 8px;
        margin-bottom: 1rem;
    }
    
    .preference-info h4 {
        margin: 0 0 0.25rem 0;
        color: var(--gray-900);
        font-size: 1rem;
    }
    
    .preference-info p {
        margin: 0;
        color: var(--gray-600);
        font-size: 0.875rem;
    }
    
    .danger-zone {
        border: 2px solid var(--red-200);
        background: rgba(239, 68, 68, 0.05);
    }
    
    .danger-zone h3 {
        color: var(--red-600);
    }
    
    .btn-danger {
        background: var(--red-500);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .btn-danger:hover {
        background: var(--red-600);
    }
    
    .danger-zone p {
        margin: 0.5rem 0 0 0;
        color: var(--red-600);
        font-size: 0.875rem;
    }
    
    /* الاستجابة للشاشات الصغيرة */
    @media (max-width: 768px) {
        .profile-container {
            flex-direction: column;
            padding: 1rem;
        }
        
        .profile-sidebar {
            width: 100%;
        }
        
        .profile-stats {
            flex-direction: column;
            gap: 1rem;
        }
        
        .dashboard-stats {
            grid-template-columns: 1fr;
        }
        
        .performance-overview {
            grid-template-columns: 1fr;
        }
        
        .favorite-details {
            grid-template-columns: 1fr;
        }
        
        .security-options {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(profileStyles);
