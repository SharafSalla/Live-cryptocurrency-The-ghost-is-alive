// ===== إعدادات API =====
const API_KEY = 'CG-jBGDkjUwcAQ1Es7XdqPvQzoA';
const BASE_URL = 'https://api.coingecko.com/api/v3';

// ===== متغيرات عامة =====
let allCoins = [];
let marketData = {};

// ===== تحميل البيانات عند بدء الصفحة =====
document.addEventListener('DOMContentLoaded', async () => {
    showLoadingState();
    await loadInitialData();
    setupEventListeners();
    startAutoRefresh();
});

// ===== عرض حالة التحميل =====
function showLoadingState() {
    const elements = [
        'crypto-table-container',
        'trending-coins',
        'market-summary'
    ];
    
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = '<div class="loading">جاري التحميل...</div>';
        }
    });
}

// ===== تحميل البيانات الأولية =====
async function loadInitialData() {
    try {
        // تحميل بيانات السوق العامة
        await loadGlobalMarketData();
        
        // تحميل قائمة العملات الرئيسية
        await loadTopCoins();
        
        // تحميل العملات الرائجة
        await loadTrendingCoins();
        
        // تحديث الإحصائيات
        updateStats();
        
    } catch (error) {
        console.error('خطأ في تحميل البيانات:', error);
        showErrorMessage('فشل في تحميل البيانات. يرجى إعادة تحميل الصفحة.');
    }
}

// ===== تحميل بيانات السوق العامة =====
async function loadGlobalMarketData() {
    try {
        const response = await fetch(`${BASE_URL}/global?x_cg_demo_api_key=${API_KEY}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        marketData = data.data;
        
        displayMarketSummary(marketData);
    } catch (error) {
        console.error('خطأ في تحميل بيانات السوق:', error);
    }
}

// ===== عرض ملخص السوق =====
function displayMarketSummary(data) {
    const container = document.getElementById('market-summary');
    if (!container) return;
    
    const totalMarketCap = data.total_market_cap?.usd || 0;
    const totalVolume = data.total_volume?.usd || 0;
    const btcDominance = data.market_cap_percentage?.btc || 0;
    const ethDominance = data.market_cap_percentage?.eth || 0;
    
    container.innerHTML = `
        <div class="market-stats">
            <div class="market-stat">
                <div class="stat-label">إجمالي القيمة السوقية</div>
                <div class="stat-value">$${formatNumber(totalMarketCap)}</div>
            </div>
            <div class="market-stat">
                <div class="stat-label">حجم التداول (24 ساعة)</div>
                <div class="stat-value">$${formatNumber(totalVolume)}</div>
            </div>
            <div class="market-stat">
                <div class="stat-label">هيمنة البيتكوين</div>
                <div class="stat-value">${btcDominance.toFixed(1)}%</div>
            </div>
            <div class="market-stat">
                <div class="stat-label">هيمنة الإيثريوم</div>
                <div class="stat-value">${ethDominance.toFixed(1)}%</div>
            </div>
        </div>
    `;
}

// ===== تحميل أهم العملات =====
async function loadTopCoins() {
    try {
        const response = await fetch(
            `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=1h,24h,7d&x_cg_demo_api_key=${API_KEY}`
        );
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const coins = await response.json();
        allCoins = coins;
        
        displayCryptoTable(coins.slice(0, 20)); // عرض أول 20 عملة
        
    } catch (error) {
        console.error('خطأ في تحميل العملات:', error);
        document.getElementById('crypto-table-container').innerHTML = 
            '<p style="color: var(--red-500); text-align: center;">فشل في تحميل بيانات العملات. يرجى المحاولة مرة أخرى.</p>';
    }
}

// ===== عرض جدول العملات =====
function displayCryptoTable(coins) {
    const container = document.getElementById('crypto-table-container');
    if (!container) return;
    
    let tableHTML = `
        <table class="crypto-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>العملة</th>
                    <th>السعر</th>
                    <th>1 ساعة</th>
                    <th>24 ساعة</th>
                    <th>7 أيام</th>
                    <th>القيمة السوقية</th>
                    <th>الحجم (24 ساعة)</th>
                    <th>العرض المتداول</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    coins.forEach((coin, index) => {
        const priceChange1h = coin.price_change_percentage_1h_in_currency || 0;
        const priceChange24h = coin.price_change_percentage_24h || 0;
        const priceChange7d = coin.price_change_percentage_7d_in_currency || 0;
        
        tableHTML += `
            <tr onclick="showCoinDetails('${coin.id}')" style="cursor: pointer;">
                <td>${coin.market_cap_rank || index + 1}</td>
                <td>
                    <div class="coin-info">
                        <img src="${coin.image}" alt="${coin.name}" width="24" height="24">
                        <div>
                            <strong>${coin.name}</strong>
                            <br><small>${coin.symbol.toUpperCase()}</small>
                        </div>
                    </div>
                </td>
                <td>$${formatPrice(coin.current_price)}</td>
                <td class="${priceChange1h >= 0 ? 'price-up' : 'price-down'}">
                    ${priceChange1h >= 0 ? '+' : ''}${priceChange1h.toFixed(2)}%
                </td>
                <td class="${priceChange24h >= 0 ? 'price-up' : 'price-down'}">
                    ${priceChange24h >= 0 ? '+' : ''}${priceChange24h.toFixed(2)}%
                </td>
                <td class="${priceChange7d >= 0 ? 'price-up' : 'price-down'}">
                    ${priceChange7d >= 0 ? '+' : ''}${priceChange7d.toFixed(2)}%
                </td>
                <td>$${formatNumber(coin.market_cap)}</td>
                <td>$${formatNumber(coin.total_volume)}</td>
                <td>${formatNumber(coin.circulating_supply)} ${coin.symbol.toUpperCase()}</td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table>';
    container.innerHTML = tableHTML;
}

// ===== تحميل العملات الرائجة =====
async function loadTrendingCoins() {
    try {
        const response = await fetch(`${BASE_URL}/search/trending?x_cg_demo_api_key=${API_KEY}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        displayTrendingCoins(data.coins);
        
    } catch (error) {
        console.error('خطأ في تحميل العملات الرائجة:', error);
        document.getElementById('trending-coins').innerHTML = 
            '<li style="color: var(--red-500);">فشل في تحميل البيانات</li>';
    }
}

// ===== عرض العملات الرائجة =====
function displayTrendingCoins(coins) {
    const container = document.getElementById('trending-coins');
    if (!container) return;
    
    const trendingHTML = coins.slice(0, 10).map((item, index) => {
        const coin = item.item;
        return `
            <li onclick="showCoinDetails('${coin.id}')" style="cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-weight: bold; color: var(--blue-500);">${index + 1}.</span>
                <img src="${coin.small}" alt="${coin.name}" width="20" height="20">
                <span>${coin.name} (${coin.symbol})</span>
                <span style="margin-right: auto; font-size: 0.875rem; color: var(--gray-600);">
                    #${coin.market_cap_rank || 'N/A'}
                </span>
            </li>
        `;
    }).join('');
    
    container.innerHTML = trendingHTML;
}

// ===== البحث عن العملات =====
function setupEventListeners() {
    const searchInput = document.getElementById('main-search');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchInput);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchCoin();
            }
        });
    }
}

// ===== معالجة إدخال البحث =====
function handleSearchInput(event) {
    const query = event.target.value.toLowerCase().trim();
    const suggestionsContainer = document.getElementById('search-suggestions');
    
    if (query.length < 2) {
        suggestionsContainer.style.display = 'none';
        return;
    }
    
    const matches = allCoins.filter(coin => 
        coin.name.toLowerCase().includes(query) || 
        coin.symbol.toLowerCase().includes(query)
    ).slice(0, 5);
    
    if (matches.length > 0) {
        const suggestionsHTML = matches.map(coin => `
            <div class="suggestion-item" onclick="selectCoin('${coin.id}')">
                <img src="${coin.image}" alt="${coin.name}" width="20" height="20">
                <span>${coin.name} (${coin.symbol.toUpperCase()})</span>
                <span style="margin-right: auto;">$${formatPrice(coin.current_price)}</span>
            </div>
        `).join('');
        
        suggestionsContainer.innerHTML = suggestionsHTML;
        suggestionsContainer.style.display = 'block';
    } else {
        suggestionsContainer.style.display = 'none';
    }
}

// ===== اختيار عملة من الاقتراحات =====
function selectCoin(coinId) {
    document.getElementById('search-suggestions').style.display = 'none';
    showCoinDetails(coinId);
}

// ===== البحث عن عملة =====
function searchCoin() {
    const query = document.getElementById('main-search').value.toLowerCase().trim();
    if (!query) return;
    
    const coin = allCoins.find(c => 
        c.name.toLowerCase().includes(query) || 
        c.symbol.toLowerCase().includes(query)
    );
    
    if (coin) {
        showCoinDetails(coin.id);
    } else {
        alert('لم يتم العثور على العملة. يرجى المحاولة مرة أخرى.');
    }
}

// ===== عرض تفاصيل العملة =====
function showCoinDetails(coinId) {
    // سيتم تنفيذ هذه الوظيفة في صفحة منفصلة
    window.location.href = `coin-details.html?id=${coinId}`;
}

// ===== إرسال رسالة دعم سريعة =====
function sendQuickMessage() {
    const message = document.getElementById('quick-message').value.trim();
    if (!message) {
        alert('يرجى كتابة رسالة قبل الإرسال.');
        return;
    }
    
    // محاكاة إرسال الرسالة
    alert('تم إرسال رسالتك بنجاح! شكراً لك على دعم المشروع.');
    document.getElementById('quick-message').value = '';
}

// ===== تحديث الإحصائيات =====
function updateStats() {
    // محاكاة تحديث الإحصائيات
    const stats = {
        recommendations: Math.floor(Math.random() * 100) + 1200,
        successRate: (Math.random() * 10 + 80).toFixed(1),
        users: Math.floor(Math.random() * 1000) + 15000,
        profit: '+' + (Math.random() * 1000 + 2000).toFixed(0)
    };
    
    const elements = {
        'total-recommendations': stats.recommendations.toLocaleString(),
        'success-rate': stats.successRate + '%',
        'active-users': stats.users.toLocaleString(),
        'total-profit': stats.profit + '%'
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

// ===== تحديث تلقائي للبيانات =====
function startAutoRefresh() {
    // تحديث كل 30 ثانية
    setInterval(async () => {
        try {
            await loadTopCoins();
            await loadGlobalMarketData();
            updateStats();
        } catch (error) {
            console.error('خطأ في التحديث التلقائي:', error);
        }
    }, 30000);
}

// ===== وظائف مساعدة =====
function formatNumber(num) {
    if (!num) return '0';
    
    if (num >= 1e12) {
        return (num / 1e12).toFixed(2) + 'T';
    } else if (num >= 1e9) {
        return (num / 1e9).toFixed(2) + 'B';
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(2) + 'M';
    } else if (num >= 1e3) {
        return (num / 1e3).toFixed(2) + 'K';
    }
    
    return num.toLocaleString();
}

function formatPrice(price) {
    if (!price) return '0.00';
    
    if (price >= 1) {
        return price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    } else if (price >= 0.01) {
        return price.toFixed(4);
    } else {
        return price.toFixed(8);
    }
}

function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--red-500);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        z-index: 10000;
        max-width: 300px;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        document.body.removeChild(errorDiv);
    }, 5000);
}

// ===== تحسين الأداء =====
// تحميل الصور بشكل تدريجي
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy-load');
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== إضافة أنماط CSS للاقتراحات =====
const style = document.createElement('style');
style.textContent = `
    .search-suggestions {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid var(--gray-300);
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        z-index: 1000;
        max-height: 300px;
        overflow-y: auto;
    }
    
    .suggestion-item {
        padding: 0.75rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        transition: background-color 0.2s;
    }
    
    .suggestion-item:hover {
        background-color: var(--gray-100);
    }
    
    .search-container {
        position: relative;
    }
    
    .market-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 1rem;
    }
    
    .market-stat {
        text-align: center;
        padding: 1rem;
        background: var(--gray-100);
        border-radius: 8px;
    }
    
    .market-stat .stat-label {
        font-size: 0.875rem;
        color: var(--gray-600);
        margin-bottom: 0.5rem;
    }
    
    .market-stat .stat-value {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--gray-900);
    }
    
    .error-message {
        animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
