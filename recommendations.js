// ===== محرك التحليل الفني والتوصيات =====

// متغيرات التوصيات
let currentRecommendations = [];
let filteredRecommendations = [];
let currentFilter = 'all';

// تحميل التوصيات عند بدء الصفحة
document.addEventListener('DOMContentLoaded', async () => {
    if (window.location.pathname.includes('recommendations.html')) {
        await loadRecommendations();
        setupRecommendationFilters();
    }
});

// ===== تحميل وتوليد التوصيات =====
async function loadRecommendations() {
    try {
        // جلب بيانات العملات الرئيسية
        const response = await fetch(
            `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=1h,24h,7d&x_cg_demo_api_key=${API_KEY}`
        );
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const coins = await response.json();
        
        // تحليل كل عملة وتوليد التوصيات
        currentRecommendations = [];
        for (const coin of coins) {
            const analysis = await analyzeCoin(coin);
            if (analysis.hasSignal) {
                currentRecommendations.push(analysis);
            }
        }
        
        // ترتيب التوصيات حسب نسبة الثقة
        currentRecommendations.sort((a, b) => b.confidence - a.confidence);
        
        filteredRecommendations = [...currentRecommendations];
        displayRecommendations();
        updateRecommendationStats();
        
    } catch (error) {
        console.error('خطأ في تحميل التوصيات:', error);
        document.getElementById('recommendations-container').innerHTML = 
            '<p style="color: var(--red-500); text-align: center;">فشل في تحميل التوصيات. يرجى إعادة تحميل الصفحة.</p>';
    }
}

// ===== تحليل العملة وتوليد التوصية =====
async function analyzeCoin(coin) {
    const analysis = {
        coin: coin,
        hasSignal: false,
        type: null, // 'bullish' أو 'bearish'
        confidence: 0,
        entryPrice: 0,
        targets: [],
        stopLoss: 0,
        leverage: 1,
        reasoning: [],
        technicalData: {}
    };
    
    // حساب المؤشرات الفنية
    const technicalIndicators = calculateTechnicalIndicators(coin);
    analysis.technicalData = technicalIndicators;
    
    // تحليل الاتجاه العام
    const trendAnalysis = analyzeTrend(coin, technicalIndicators);
    
    // تحديد نوع الإشارة
    if (trendAnalysis.isBullish && trendAnalysis.strength > 0.6) {
        analysis.type = 'bullish';
        analysis.hasSignal = true;
        analysis = generateBullishRecommendation(analysis, coin, technicalIndicators);
    } else if (trendAnalysis.isBearish && trendAnalysis.strength > 0.6) {
        analysis.type = 'bearish';
        analysis.hasSignal = true;
        analysis = generateBearishRecommendation(analysis, coin, technicalIndicators);
    }
    
    return analysis;
}

// ===== حساب المؤشرات الفنية =====
function calculateTechnicalIndicators(coin) {
    const currentPrice = coin.current_price;
    const priceChange24h = coin.price_change_percentage_24h || 0;
    const priceChange7d = coin.price_change_percentage_7d_in_currency || 0;
    const volume = coin.total_volume;
    const marketCap = coin.market_cap;
    
    // محاكاة حساب المؤشرات (في التطبيق الحقيقي، ستحتاج لبيانات تاريخية أكثر)
    const indicators = {
        rsi: calculateRSI(priceChange24h, priceChange7d),
        macd: calculateMACD(priceChange24h, priceChange7d),
        volumeRatio: calculateVolumeRatio(volume, marketCap),
        supportLevel: currentPrice * (1 - Math.abs(priceChange24h) / 100 * 0.5),
        resistanceLevel: currentPrice * (1 + Math.abs(priceChange24h) / 100 * 0.5),
        pivotPoint: calculatePivotPoint(currentPrice, priceChange24h),
        volatility: Math.abs(priceChange24h) + Math.abs(priceChange7d) / 7
    };
    
    return indicators;
}

// ===== حساب RSI مبسط =====
function calculateRSI(change24h, change7d) {
    // محاكاة RSI بناءً على التغيرات الأخيرة
    const avgGain = Math.max(change24h, 0) + Math.max(change7d / 7, 0);
    const avgLoss = Math.abs(Math.min(change24h, 0)) + Math.abs(Math.min(change7d / 7, 0));
    
    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
}

// ===== حساب MACD مبسط =====
function calculateMACD(change24h, change7d) {
    // محاكاة MACD
    const ema12 = change24h * 0.7 + change7d * 0.3;
    const ema26 = change24h * 0.3 + change7d * 0.7;
    const macdLine = ema12 - ema26;
    const signalLine = macdLine * 0.8;
    
    return {
        macd: macdLine,
        signal: signalLine,
        histogram: macdLine - signalLine
    };
}

// ===== حساب نسبة الحجم =====
function calculateVolumeRatio(volume, marketCap) {
    return (volume / marketCap) * 100;
}

// ===== حساب نقطة الارتكاز =====
function calculatePivotPoint(currentPrice, change24h) {
    const high = currentPrice * (1 + Math.abs(change24h) / 100);
    const low = currentPrice * (1 - Math.abs(change24h) / 100);
    const close = currentPrice;
    
    return (high + low + close) / 3;
}

// ===== تحليل الاتجاه =====
function analyzeTrend(coin, indicators) {
    let bullishSignals = 0;
    let bearishSignals = 0;
    let totalSignals = 0;
    
    // تحليل RSI
    if (indicators.rsi < 30) {
        bullishSignals += 2; // إشارة قوية للشراء
    } else if (indicators.rsi > 70) {
        bearishSignals += 2; // إشارة قوية للبيع
    } else if (indicators.rsi < 50) {
        bullishSignals += 1;
    } else {
        bearishSignals += 1;
    }
    totalSignals += 2;
    
    // تحليل MACD
    if (indicators.macd.histogram > 0) {
        bullishSignals += 1;
    } else {
        bearishSignals += 1;
    }
    totalSignals += 1;
    
    // تحليل الحجم
    if (indicators.volumeRatio > 5) {
        if (coin.price_change_percentage_24h > 0) {
            bullishSignals += 1;
        } else {
            bearishSignals += 1;
        }
    }
    totalSignals += 1;
    
    // تحليل التغيير السعري
    if (coin.price_change_percentage_24h > 2) {
        bullishSignals += 1;
    } else if (coin.price_change_percentage_24h < -2) {
        bearishSignals += 1;
    }
    totalSignals += 1;
    
    const bullishStrength = bullishSignals / totalSignals;
    const bearishStrength = bearishSignals / totalSignals;
    
    return {
        isBullish: bullishStrength > bearishStrength,
        isBearish: bearishStrength > bullishStrength,
        strength: Math.max(bullishStrength, bearishStrength)
    };
}

// ===== توليد توصية صاعدة =====
function generateBullishRecommendation(analysis, coin, indicators) {
    const currentPrice = coin.current_price;
    
    // تحديد سعر الدخول (عند كسر المقاومة)
    analysis.entryPrice = indicators.resistanceLevel;
    
    // تحديد الأهداف
    const target1 = analysis.entryPrice * 1.03; // 3%
    const target2 = analysis.entryPrice * 1.06; // 6%
    const target3 = analysis.entryPrice * 1.10; // 10%
    
    analysis.targets = [target1, target2, target3];
    
    // تحديد وقف الخسارة
    analysis.stopLoss = indicators.supportLevel;
    
    // حساب الرافعة المالية الديناميكية
    const riskRewardRatio = (target1 - analysis.entryPrice) / (analysis.entryPrice - analysis.stopLoss);
    analysis.leverage = Math.min(Math.max(Math.floor(riskRewardRatio * 2), 1), 10);
    
    // حساب نسبة الثقة
    analysis.confidence = calculateConfidence(analysis, indicators, 'bullish');
    
    // أسباب التوصية
    analysis.reasoning = generateBullishReasoning(indicators, coin);
    
    return analysis;
}

// ===== توليد توصية هابطة =====
function generateBearishRecommendation(analysis, coin, indicators) {
    const currentPrice = coin.current_price;
    
    // تحديد سعر الدخول (عند كسر الدعم)
    analysis.entryPrice = indicators.supportLevel;
    
    // تحديد الأهداف (للبيع على المكشوف)
    const target1 = analysis.entryPrice * 0.97; // -3%
    const target2 = analysis.entryPrice * 0.94; // -6%
    const target3 = analysis.entryPrice * 0.90; // -10%
    
    analysis.targets = [target1, target2, target3];
    
    // تحديد وقف الخسارة
    analysis.stopLoss = indicators.resistanceLevel;
    
    // حساب الرافعة المالية الديناميكية
    const riskRewardRatio = (analysis.entryPrice - target1) / (analysis.stopLoss - analysis.entryPrice);
    analysis.leverage = Math.min(Math.max(Math.floor(riskRewardRatio * 2), 1), 10);
    
    // حساب نسبة الثقة
    analysis.confidence = calculateConfidence(analysis, indicators, 'bearish');
    
    // أسباب التوصية
    analysis.reasoning = generateBearishReasoning(indicators, coin);
    
    return analysis;
}

// ===== حساب نسبة الثقة =====
function calculateConfidence(analysis, indicators, type) {
    let confidence = 50; // نقطة البداية
    
    // عوامل الثقة للاتجاه الصاعد
    if (type === 'bullish') {
        if (indicators.rsi < 30) confidence += 20;
        else if (indicators.rsi < 50) confidence += 10;
        
        if (indicators.macd.histogram > 0) confidence += 15;
        if (indicators.volumeRatio > 5) confidence += 10;
        if (analysis.coin.price_change_percentage_24h > 0) confidence += 5;
    }
    
    // عوامل الثقة للاتجاه الهابط
    if (type === 'bearish') {
        if (indicators.rsi > 70) confidence += 20;
        else if (indicators.rsi > 50) confidence += 10;
        
        if (indicators.macd.histogram < 0) confidence += 15;
        if (indicators.volumeRatio > 5) confidence += 10;
        if (analysis.coin.price_change_percentage_24h < 0) confidence += 5;
    }
    
    // تعديل حسب التقلبات
    if (indicators.volatility > 10) confidence -= 10;
    else if (indicators.volatility < 3) confidence += 5;
    
    return Math.min(Math.max(confidence, 30), 95);
}

// ===== توليد أسباب التوصية الصاعدة =====
function generateBullishReasoning(indicators, coin) {
    const reasons = [];
    
    if (indicators.rsi < 30) {
        reasons.push('مؤشر RSI في منطقة التشبع البيعي');
    }
    if (indicators.macd.histogram > 0) {
        reasons.push('إشارة إيجابية من مؤشر MACD');
    }
    if (indicators.volumeRatio > 5) {
        reasons.push('حجم تداول مرتفع يدعم الحركة');
    }
    if (coin.price_change_percentage_24h > 2) {
        reasons.push('زخم إيجابي في آخر 24 ساعة');
    }
    
    reasons.push('اقتراب السعر من مستوى الدعم القوي');
    reasons.push('نسبة مخاطرة/عائد مناسبة');
    
    return reasons;
}

// ===== توليد أسباب التوصية الهابطة =====
function generateBearishReasoning(indicators, coin) {
    const reasons = [];
    
    if (indicators.rsi > 70) {
        reasons.push('مؤشر RSI في منطقة التشبع الشرائي');
    }
    if (indicators.macd.histogram < 0) {
        reasons.push('إشارة سلبية من مؤشر MACD');
    }
    if (indicators.volumeRatio > 5) {
        reasons.push('حجم تداول مرتفع يدعم الحركة');
    }
    if (coin.price_change_percentage_24h < -2) {
        reasons.push('زخم سلبي في آخر 24 ساعة');
    }
    
    reasons.push('اقتراب السعر من مستوى المقاومة القوي');
    reasons.push('نسبة مخاطرة/عائد مناسبة');
    
    return reasons;
}

// ===== عرض التوصيات =====
function displayRecommendations() {
    const container = document.getElementById('recommendations-container');
    if (!container) return;
    
    if (filteredRecommendations.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--gray-600);">لا توجد توصيات متاحة حالياً.</p>';
        return;
    }
    
    const recommendationsHTML = filteredRecommendations.map(rec => {
        const confidenceClass = rec.confidence >= 80 ? 'confidence-high' : 
                               rec.confidence >= 60 ? 'confidence-medium' : 'confidence-low';
        
        const typeClass = rec.type === 'bullish' ? 'bullish' : 'bearish';
        const typeIcon = rec.type === 'bullish' ? '🟢' : '🔴';
        const typeText = rec.type === 'bullish' ? 'سيناريو ارتفاع' : 'سيناريو انخفاض';
        
        return `
            <div class="recommendation-card ${typeClass}" id="${rec.coin.id}">
                <div class="recommendation-header">
                    <div class="coin-info">
                        <img src="${rec.coin.image}" alt="${rec.coin.name}" width="32" height="32">
                        <div>
                            <h3>${rec.coin.name} (${rec.coin.symbol.toUpperCase()})</h3>
                            <p>${typeIcon} ${typeText}</p>
                        </div>
                    </div>
                    <div class="confidence-badge ${confidenceClass}">
                        ${rec.confidence.toFixed(0)}% ثقة
                    </div>
                </div>
                
                <div class="recommendation-body">
                    <div class="price-info">
                        <div class="current-price">
                            <span class="label">السعر الحالي:</span>
                            <span class="value">$${formatPrice(rec.coin.current_price)}</span>
                        </div>
                        <div class="entry-price">
                            <span class="label">سعر الدخول:</span>
                            <span class="value">$${formatPrice(rec.entryPrice)}</span>
                        </div>
                    </div>
                    
                    <div class="targets-grid">
                        <div class="target-item">
                            <div class="target-label">الهدف الأول</div>
                            <div class="target-value">$${formatPrice(rec.targets[0])}</div>
                        </div>
                        <div class="target-item">
                            <div class="target-label">الهدف الثاني</div>
                            <div class="target-value">$${formatPrice(rec.targets[1])}</div>
                        </div>
                        <div class="target-item">
                            <div class="target-label">الهدف الثالث</div>
                            <div class="target-value">$${formatPrice(rec.targets[2])}</div>
                        </div>
                        <div class="target-item">
                            <div class="target-label">وقف الخسارة</div>
                            <div class="target-value">$${formatPrice(rec.stopLoss)}</div>
                        </div>
                    </div>
                    
                    <div class="additional-info">
                        <div class="info-item">
                            <span class="label">الرافعة المالية:</span>
                            <span class="value">${rec.leverage}x</span>
                        </div>
                        <div class="info-item">
                            <span class="label">نسبة المخاطرة/العائد:</span>
                            <span class="value">${calculateRiskReward(rec).toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <div class="reasoning">
                        <h4>أسباب التوصية:</h4>
                        <ul>
                            ${rec.reasoning.map(reason => `<li>${reason}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="recommendation-actions">
                        <button class="btn btn-primary" onclick="copyRecommendation('${rec.coin.id}')">
                            📋 نسخ التوصية
                        </button>
                        <button class="btn btn-secondary" onclick="voteRecommendation('${rec.coin.id}', 'up')">
                            👍 مفيدة
                        </button>
                        <button class="btn btn-secondary" onclick="voteRecommendation('${rec.coin.id}', 'down')">
                            👎 غير مفيدة
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = recommendationsHTML;
}

// ===== حساب نسبة المخاطرة/العائد =====
function calculateRiskReward(recommendation) {
    const potentialProfit = Math.abs(recommendation.targets[0] - recommendation.entryPrice);
    const potentialLoss = Math.abs(recommendation.entryPrice - recommendation.stopLoss);
    
    return potentialLoss > 0 ? potentialProfit / potentialLoss : 0;
}

// ===== تصفية التوصيات =====
function filterRecommendations(filterType) {
    currentFilter = filterType;
    
    // إزالة الفئة النشطة من جميع الأزرار
    document.querySelectorAll('.recommendation-filters .btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // إضافة الفئة النشطة للزر المحدد
    event.target.classList.add('active');
    
    switch (filterType) {
        case 'all':
            filteredRecommendations = [...currentRecommendations];
            break;
        case 'bullish':
            filteredRecommendations = currentRecommendations.filter(rec => rec.type === 'bullish');
            break;
        case 'bearish':
            filteredRecommendations = currentRecommendations.filter(rec => rec.type === 'bearish');
            break;
        case 'high-confidence':
            filteredRecommendations = currentRecommendations.filter(rec => rec.confidence >= 80);
            break;
    }
    
    displayRecommendations();
}

// ===== إعداد مرشحات التوصيات =====
function setupRecommendationFilters() {
    // تم إعداد الأحداث في HTML مباشرة
}

// ===== تحديث إحصائيات التوصيات =====
function updateRecommendationStats() {
    const totalCount = currentRecommendations.length;
    const bullishCount = currentRecommendations.filter(rec => rec.type === 'bullish').length;
    const bearishCount = currentRecommendations.filter(rec => rec.type === 'bearish').length;
    const avgConfidence = currentRecommendations.reduce((sum, rec) => sum + rec.confidence, 0) / totalCount;
    
    const elements = {
        'total-today-recommendations': totalCount,
        'bullish-count': bullishCount,
        'bearish-count': bearishCount,
        'avg-confidence': avgConfidence.toFixed(1) + '%'
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

// ===== نسخ التوصية =====
function copyRecommendation(coinId) {
    const recommendation = currentRecommendations.find(rec => rec.coin.id === coinId);
    if (!recommendation) return;
    
    const text = `
🎯 توصية ${recommendation.coin.name} (${recommendation.coin.symbol.toUpperCase()})
${recommendation.type === 'bullish' ? '🟢 سيناريو ارتفاع' : '🔴 سيناريو انخفاض'}

💰 السعر الحالي: $${formatPrice(recommendation.coin.current_price)}
🎯 سعر الدخول: $${formatPrice(recommendation.entryPrice)}

🎯 الأهداف:
الهدف الأول: $${formatPrice(recommendation.targets[0])}
الهدف الثاني: $${formatPrice(recommendation.targets[1])}
الهدف الثالث: $${formatPrice(recommendation.targets[2])}

🛡️ وقف الخسارة: $${formatPrice(recommendation.stopLoss)}
⚡ الرافعة المالية: ${recommendation.leverage}x
🎯 نسبة الثقة: ${recommendation.confidence.toFixed(0)}%

📊 SH-Ghost-Crypto-Analysis
    `.trim();
    
    navigator.clipboard.writeText(text).then(() => {
        alert('تم نسخ التوصية بنجاح!');
    }).catch(() => {
        alert('فشل في نسخ التوصية. يرجى المحاولة مرة أخرى.');
    });
}

// ===== التصويت على التوصية =====
function voteRecommendation(coinId, voteType) {
    // محاكاة التصويت
    const message = voteType === 'up' ? 
        'شكراً لك على تقييمك الإيجابي!' : 
        'شكراً لك على ملاحظتك. سنعمل على تحسين التوصيات.';
    
    alert(message);
}

// ===== إضافة أنماط CSS للتوصيات =====
const recommendationStyles = document.createElement('style');
recommendationStyles.textContent = `
    .recommendation-filters {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 1.5rem;
    }
    
    .recommendation-filters .btn.active {
        background-color: var(--blue-900);
        color: var(--white);
    }
    
    .recommendation-card {
        margin-bottom: 2rem;
        transition: all 0.3s ease;
    }
    
    .recommendation-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 32px rgba(0,0,0,0.15);
    }
    
    .recommendation-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }
    
    .recommendation-header .coin-info {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .recommendation-header h3 {
        margin: 0;
        font-size: 1.25rem;
    }
    
    .recommendation-header p {
        margin: 0;
        color: var(--gray-600);
        font-size: 0.875rem;
    }
    
    .price-info {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1.5rem;
        padding: 1rem;
        background: var(--gray-100);
        border-radius: 8px;
    }
    
    .price-info .label {
        display: block;
        font-size: 0.875rem;
        color: var(--gray-600);
        margin-bottom: 0.25rem;
    }
    
    .price-info .value {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--gray-900);
    }
    
    .additional-info {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
        background: var(--gray-50);
        border-radius: 6px;
    }
    
    .reasoning {
        margin: 1.5rem 0;
    }
    
    .reasoning h4 {
        margin-bottom: 0.75rem;
        color: var(--gray-800);
        font-size: 1rem;
    }
    
    .reasoning ul {
        list-style: none;
        padding: 0;
    }
    
    .reasoning li {
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--gray-200);
        position: relative;
        padding-right: 1.5rem;
    }
    
    .reasoning li:before {
        content: "✓";
        position: absolute;
        right: 0;
        color: var(--green-500);
        font-weight: bold;
    }
    
    .recommendation-actions {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
        margin-top: 1.5rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--gray-200);
    }
    
    .performance-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
    }
    
    .performance-card {
        background: var(--white);
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.05);
    }
    
    .performance-card h3 {
        margin-bottom: 1.5rem;
        color: var(--gray-900);
        text-align: center;
    }
    
    .performance-stats .stat {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 0;
        border-bottom: 1px solid var(--gray-200);
    }
    
    .performance-stats .stat:last-child {
        border-bottom: none;
    }
    
    .performance-stats .value.success {
        color: var(--green-500);
        font-weight: 600;
    }
    
    .alerts-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .alert {
        padding: 1rem;
        border-radius: 8px;
        border-right: 4px solid;
    }
    
    .alert-warning {
        background: rgba(245, 158, 11, 0.1);
        border-color: var(--yellow-500);
        color: #92400e;
    }
    
    .alert-info {
        background: rgba(59, 130, 246, 0.1);
        border-color: var(--blue-500);
        color: #1e40af;
    }
    
    .alert-success {
        background: rgba(16, 185, 129, 0.1);
        border-color: var(--green-500);
        color: #065f46;
    }
    
    @media (max-width: 768px) {
        .recommendation-filters {
            flex-direction: column;
            align-items: center;
        }
        
        .price-info {
            grid-template-columns: 1fr;
        }
        
        .additional-info {
            grid-template-columns: 1fr;
        }
        
        .recommendation-actions {
            flex-direction: column;
        }
        
        .performance-grid {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(recommendationStyles);
