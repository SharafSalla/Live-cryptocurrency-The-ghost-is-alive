// ===== محرك التحليل الفني المتقدم =====

// فئات التحليل الفني
class TechnicalAnalysisEngine {
    constructor() {
        this.indicators = new TechnicalIndicators();
        this.patterns = new PatternRecognition();
        this.scenarios = new ScenarioAnalysis();
        this.riskManager = new RiskManagement();
    }

    // التحليل الشامل للعملة
    async analyzeComprehensive(symbol, timeframe = '4h') {
        try {
            // جلب البيانات التاريخية
            const priceData = await this.fetchPriceData(symbol, timeframe);
            
            // تحليل المؤشرات الفنية
            const technicalAnalysis = this.indicators.analyzeAll(priceData);
            
            // تحليل الأنماط
            const patternAnalysis = this.patterns.detectPatterns(priceData);
            
            // تحليل السيناريوهات
            const scenarioAnalysis = this.scenarios.generateScenarios(priceData, technicalAnalysis);
            
            // تقييم المخاطر
            const riskAssessment = this.riskManager.assessRisk(priceData, technicalAnalysis);
            
            // توليد التوصية النهائية
            const recommendation = this.generateRecommendation({
                symbol,
                timeframe,
                technicalAnalysis,
                patternAnalysis,
                scenarioAnalysis,
                riskAssessment,
                priceData
            });
            
            return recommendation;
            
        } catch (error) {
            console.error('خطأ في التحليل الشامل:', error);
            return this.generateErrorRecommendation(symbol);
        }
    }

    // جلب بيانات الأسعار (محاكاة)
    async fetchPriceData(symbol, timeframe) {
        // في التطبيق الحقيقي، سيتم جلب البيانات من API
        return this.generateMockPriceData(symbol, timeframe);
    }

    // توليد بيانات وهمية للمحاكاة
    generateMockPriceData(symbol, timeframe) {
        const data = [];
        const basePrice = this.getBasePrice(symbol);
        let currentPrice = basePrice;
        
        // توليد 100 شمعة
        for (let i = 0; i < 100; i++) {
            const volatility = 0.02; // 2% تقلب
            const change = (Math.random() - 0.5) * volatility;
            
            const open = currentPrice;
            const close = open * (1 + change);
            const high = Math.max(open, close) * (1 + Math.random() * 0.01);
            const low = Math.min(open, close) * (1 - Math.random() * 0.01);
            const volume = Math.random() * 1000000;
            
            data.push({
                timestamp: Date.now() - (100 - i) * this.getTimeframeMs(timeframe),
                open,
                high,
                low,
                close,
                volume
            });
            
            currentPrice = close;
        }
        
        return data;
    }

    // الحصول على السعر الأساسي للعملة
    getBasePrice(symbol) {
        const basePrices = {
            'BTC': 43000,
            'ETH': 2500,
            'BNB': 300,
            'SOL': 100,
            'ADA': 0.5,
            'DOT': 7,
            'MATIC': 0.8,
            'LINK': 15,
            'UNI': 6,
            'AVAX': 35
        };
        
        return basePrices[symbol.replace('/USDT', '')] || 1;
    }

    // تحويل الإطار الزمني إلى ميلي ثانية
    getTimeframeMs(timeframe) {
        const timeframes = {
            '1m': 60 * 1000,
            '5m': 5 * 60 * 1000,
            '15m': 15 * 60 * 1000,
            '1h': 60 * 60 * 1000,
            '4h': 4 * 60 * 60 * 1000,
            '1d': 24 * 60 * 60 * 1000
        };
        
        return timeframes[timeframe] || timeframes['4h'];
    }

    // توليد التوصية النهائية
    generateRecommendation(analysisData) {
        const {
            symbol,
            timeframe,
            technicalAnalysis,
            patternAnalysis,
            scenarioAnalysis,
            riskAssessment,
            priceData
        } = analysisData;

        const currentPrice = priceData[priceData.length - 1].close;
        
        // حساب نقاط القوة الإجمالية
        const bullishScore = this.calculateBullishScore(technicalAnalysis, patternAnalysis);
        const bearishScore = this.calculateBearishScore(technicalAnalysis, patternAnalysis);
        
        // تحديد الاتجاه
        let direction, confidence;
        if (bullishScore > bearishScore + 20) {
            direction = 'bullish';
            confidence = Math.min(95, 60 + (bullishScore - bearishScore));
        } else if (bearishScore > bullishScore + 20) {
            direction = 'bearish';
            confidence = Math.min(95, 60 + (bearishScore - bullishScore));
        } else {
            direction = 'neutral';
            confidence = 50 + Math.abs(bullishScore - bearishScore);
        }

        // حساب الأهداف ووقف الخسارة
        const targets = this.calculateTargets(currentPrice, direction, technicalAnalysis);
        const stopLoss = this.calculateStopLoss(currentPrice, direction, riskAssessment);

        return {
            symbol,
            timeframe,
            timestamp: Date.now(),
            currentPrice,
            direction,
            confidence,
            targets,
            stopLoss,
            entryZone: this.calculateEntryZone(currentPrice, direction),
            technicalAnalysis,
            patternAnalysis,
            scenarioAnalysis,
            riskLevel: riskAssessment.level,
            timeHorizon: this.calculateTimeHorizon(timeframe, confidence),
            keyLevels: this.identifyKeyLevels(priceData),
            marketContext: this.analyzeMarketContext(technicalAnalysis),
            recommendation: this.generateTextRecommendation(direction, confidence, symbol)
        };
    }

    // حساب النقاط الصاعدة
    calculateBullishScore(technical, patterns) {
        let score = 0;
        
        // المؤشرات الفنية
        if (technical.rsi < 30) score += 20; // RSI مُفرط في البيع
        if (technical.rsi > 50 && technical.rsi < 70) score += 10;
        if (technical.macd.signal === 'bullish') score += 15;
        if (technical.bollinger.position === 'lower') score += 10;
        if (technical.stochastic < 20) score += 15;
        
        // المتوسطات المتحركة
        if (technical.movingAverages.trend === 'bullish') score += 20;
        if (technical.movingAverages.goldenCross) score += 25;
        
        // الأنماط
        patterns.bullishPatterns.forEach(pattern => {
            score += pattern.strength;
        });
        
        // مستويات الدعم والمقاومة
        if (technical.supportResistance.nearSupport) score += 15;
        
        return Math.min(100, score);
    }

    // حساب النقاط الهابطة
    calculateBearishScore(technical, patterns) {
        let score = 0;
        
        // المؤشرات الفنية
        if (technical.rsi > 70) score += 20; // RSI مُفرط في الشراء
        if (technical.rsi < 50 && technical.rsi > 30) score += 10;
        if (technical.macd.signal === 'bearish') score += 15;
        if (technical.bollinger.position === 'upper') score += 10;
        if (technical.stochastic > 80) score += 15;
        
        // المتوسطات المتحركة
        if (technical.movingAverages.trend === 'bearish') score += 20;
        if (technical.movingAverages.deathCross) score += 25;
        
        // الأنماط
        patterns.bearishPatterns.forEach(pattern => {
            score += pattern.strength;
        });
        
        // مستويات الدعم والمقاومة
        if (technical.supportResistance.nearResistance) score += 15;
        
        return Math.min(100, score);
    }

    // حساب الأهداف
    calculateTargets(currentPrice, direction, technical) {
        const targets = [];
        const multiplier = direction === 'bullish' ? 1 : -1;
        
        // الهدف الأول (محافظ)
        const target1 = currentPrice * (1 + multiplier * 0.03); // 3%
        targets.push({
            level: 1,
            price: target1,
            percentage: multiplier * 3,
            probability: 75
        });
        
        // الهدف الثاني (متوسط)
        const target2 = currentPrice * (1 + multiplier * 0.06); // 6%
        targets.push({
            level: 2,
            price: target2,
            percentage: multiplier * 6,
            probability: 60
        });
        
        // الهدف الثالث (طموح)
        const target3 = currentPrice * (1 + multiplier * 0.10); // 10%
        targets.push({
            level: 3,
            price: target3,
            percentage: multiplier * 10,
            probability: 40
        });
        
        return targets;
    }

    // حساب وقف الخسارة
    calculateStopLoss(currentPrice, direction, riskAssessment) {
        const riskMultiplier = {
            'low': 0.02,    // 2%
            'medium': 0.03, // 3%
            'high': 0.05    // 5%
        };
        
        const risk = riskMultiplier[riskAssessment.level] || 0.03;
        const multiplier = direction === 'bullish' ? -1 : 1;
        
        return {
            price: currentPrice * (1 + multiplier * risk),
            percentage: multiplier * risk * 100
        };
    }

    // حساب منطقة الدخول
    calculateEntryZone(currentPrice, direction) {
        const range = 0.015; // 1.5%
        
        return {
            min: currentPrice * (1 - range),
            max: currentPrice * (1 + range),
            optimal: currentPrice
        };
    }

    // حساب الأفق الزمني
    calculateTimeHorizon(timeframe, confidence) {
        const baseHours = {
            '1m': 1,
            '5m': 4,
            '15m': 12,
            '1h': 24,
            '4h': 72,
            '1d': 168
        };
        
        const base = baseHours[timeframe] || 72;
        const confidenceMultiplier = confidence / 100;
        
        return Math.round(base * confidenceMultiplier);
    }

    // تحديد المستويات الرئيسية
    identifyKeyLevels(priceData) {
        const prices = priceData.map(d => d.close);
        const highs = priceData.map(d => d.high);
        const lows = priceData.map(d => d.low);
        
        // حساب مستويات الدعم والمقاومة
        const resistance = Math.max(...highs.slice(-20));
        const support = Math.min(...lows.slice(-20));
        
        return {
            resistance,
            support,
            pivot: (resistance + support) / 2
        };
    }

    // تحليل سياق السوق
    analyzeMarketContext(technical) {
        let context = 'neutral';
        
        if (technical.volatility > 0.05) {
            context = 'high_volatility';
        } else if (technical.volatility < 0.02) {
            context = 'low_volatility';
        }
        
        if (technical.volume.trend === 'increasing') {
            context += '_high_volume';
        }
        
        return context;
    }

    // توليد التوصية النصية
    generateTextRecommendation(direction, confidence, symbol) {
        const coin = symbol.replace('/USDT', '');
        
        if (direction === 'bullish') {
            if (confidence > 80) {
                return `توصية قوية بالشراء لعملة ${coin}. الإشارات الفنية إيجابية جداً مع احتمالية عالية لتحقيق الأهداف.`;
            } else if (confidence > 60) {
                return `توصية بالشراء لعملة ${coin}. الإشارات الفنية إيجابية مع مراعاة إدارة المخاطر.`;
            } else {
                return `إشارة شراء ضعيفة لعملة ${coin}. يُنصح بالانتظار لإشارات أقوى.`;
            }
        } else if (direction === 'bearish') {
            if (confidence > 80) {
                return `توصية قوية بالبيع لعملة ${coin}. الإشارات الفنية سلبية جداً مع احتمالية عالية للانخفاض.`;
            } else if (confidence > 60) {
                return `توصية بالبيع لعملة ${coin}. الإشارات الفنية سلبية مع مراعاة إدارة المخاطر.`;
            } else {
                return `إشارة بيع ضعيفة لعملة ${coin}. يُنصح بالانتظار لإشارات أقوى.`;
            }
        } else {
            return `السوق في حالة تذبذب لعملة ${coin}. يُنصح بالانتظار لإشارات واضحة قبل اتخاذ قرار.`;
        }
    }

    // توليد توصية في حالة الخطأ
    generateErrorRecommendation(symbol) {
        return {
            symbol,
            error: true,
            message: 'حدث خطأ في تحليل العملة. يرجى المحاولة لاحقاً.',
            timestamp: Date.now()
        };
    }
}

// فئة المؤشرات الفنية
class TechnicalIndicators {
    analyzeAll(priceData) {
        return {
            rsi: this.calculateRSI(priceData),
            macd: this.calculateMACD(priceData),
            bollinger: this.calculateBollingerBands(priceData),
            stochastic: this.calculateStochastic(priceData),
            movingAverages: this.analyzeMovingAverages(priceData),
            supportResistance: this.findSupportResistance(priceData),
            volume: this.analyzeVolume(priceData),
            volatility: this.calculateVolatility(priceData)
        };
    }

    // حساب مؤشر القوة النسبية RSI
    calculateRSI(priceData, period = 14) {
        if (priceData.length < period + 1) return 50;
        
        let gains = 0;
        let losses = 0;
        
        for (let i = 1; i <= period; i++) {
            const change = priceData[priceData.length - i].close - priceData[priceData.length - i - 1].close;
            if (change > 0) {
                gains += change;
            } else {
                losses += Math.abs(change);
            }
        }
        
        const avgGain = gains / period;
        const avgLoss = losses / period;
        
        if (avgLoss === 0) return 100;
        
        const rs = avgGain / avgLoss;
        const rsi = 100 - (100 / (1 + rs));
        
        return Math.round(rsi * 100) / 100;
    }

    // حساب MACD
    calculateMACD(priceData) {
        const ema12 = this.calculateEMA(priceData, 12);
        const ema26 = this.calculateEMA(priceData, 26);
        const macdLine = ema12 - ema26;
        
        // محاكاة خط الإشارة
        const signalLine = macdLine * 0.9; // تبسيط
        
        return {
            macd: Math.round(macdLine * 100) / 100,
            signal: Math.round(signalLine * 100) / 100,
            histogram: Math.round((macdLine - signalLine) * 100) / 100,
            signal: macdLine > signalLine ? 'bullish' : 'bearish'
        };
    }

    // حساب المتوسط المتحرك الأسي
    calculateEMA(priceData, period) {
        if (priceData.length < period) return priceData[priceData.length - 1].close;
        
        const multiplier = 2 / (period + 1);
        let ema = priceData[priceData.length - period].close;
        
        for (let i = priceData.length - period + 1; i < priceData.length; i++) {
            ema = (priceData[i].close * multiplier) + (ema * (1 - multiplier));
        }
        
        return ema;
    }

    // حساب بولينجر باندز
    calculateBollingerBands(priceData, period = 20) {
        if (priceData.length < period) {
            const currentPrice = priceData[priceData.length - 1].close;
            return {
                upper: currentPrice * 1.02,
                middle: currentPrice,
                lower: currentPrice * 0.98,
                position: 'middle'
            };
        }
        
        const prices = priceData.slice(-period).map(d => d.close);
        const sma = prices.reduce((sum, price) => sum + price, 0) / period;
        
        const variance = prices.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / period;
        const stdDev = Math.sqrt(variance);
        
        const upper = sma + (stdDev * 2);
        const lower = sma - (stdDev * 2);
        const currentPrice = priceData[priceData.length - 1].close;
        
        let position = 'middle';
        if (currentPrice > upper * 0.95) position = 'upper';
        if (currentPrice < lower * 1.05) position = 'lower';
        
        return {
            upper: Math.round(upper * 100) / 100,
            middle: Math.round(sma * 100) / 100,
            lower: Math.round(lower * 100) / 100,
            position
        };
    }

    // حساب Stochastic
    calculateStochastic(priceData, period = 14) {
        if (priceData.length < period) return 50;
        
        const recentData = priceData.slice(-period);
        const highestHigh = Math.max(...recentData.map(d => d.high));
        const lowestLow = Math.min(...recentData.map(d => d.low));
        const currentClose = priceData[priceData.length - 1].close;
        
        const k = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
        
        return Math.round(k * 100) / 100;
    }

    // تحليل المتوسطات المتحركة
    analyzeMovingAverages(priceData) {
        const sma20 = this.calculateSMA(priceData, 20);
        const sma50 = this.calculateSMA(priceData, 50);
        const ema12 = this.calculateEMA(priceData, 12);
        const ema26 = this.calculateEMA(priceData, 26);
        
        const currentPrice = priceData[priceData.length - 1].close;
        
        let trend = 'neutral';
        if (currentPrice > sma20 && sma20 > sma50) trend = 'bullish';
        if (currentPrice < sma20 && sma20 < sma50) trend = 'bearish';
        
        const goldenCross = ema12 > ema26 && sma20 > sma50;
        const deathCross = ema12 < ema26 && sma20 < sma50;
        
        return {
            sma20: Math.round(sma20 * 100) / 100,
            sma50: Math.round(sma50 * 100) / 100,
            ema12: Math.round(ema12 * 100) / 100,
            ema26: Math.round(ema26 * 100) / 100,
            trend,
            goldenCross,
            deathCross
        };
    }

    // حساب المتوسط المتحرك البسيط
    calculateSMA(priceData, period) {
        if (priceData.length < period) return priceData[priceData.length - 1].close;
        
        const prices = priceData.slice(-period).map(d => d.close);
        return prices.reduce((sum, price) => sum + price, 0) / period;
    }

    // العثور على مستويات الدعم والمقاومة
    findSupportResistance(priceData) {
        const recentData = priceData.slice(-50);
        const currentPrice = priceData[priceData.length - 1].close;
        
        const highs = recentData.map(d => d.high);
        const lows = recentData.map(d => d.low);
        
        const resistance = Math.max(...highs);
        const support = Math.min(...lows);
        
        const nearResistance = currentPrice > resistance * 0.98;
        const nearSupport = currentPrice < support * 1.02;
        
        return {
            resistance: Math.round(resistance * 100) / 100,
            support: Math.round(support * 100) / 100,
            nearResistance,
            nearSupport
        };
    }

    // تحليل الحجم
    analyzeVolume(priceData) {
        if (priceData.length < 20) return { trend: 'neutral', average: 0 };
        
        const recentVolumes = priceData.slice(-10).map(d => d.volume);
        const olderVolumes = priceData.slice(-20, -10).map(d => d.volume);
        
        const recentAvg = recentVolumes.reduce((sum, vol) => sum + vol, 0) / recentVolumes.length;
        const olderAvg = olderVolumes.reduce((sum, vol) => sum + vol, 0) / olderVolumes.length;
        
        let trend = 'neutral';
        if (recentAvg > olderAvg * 1.2) trend = 'increasing';
        if (recentAvg < olderAvg * 0.8) trend = 'decreasing';
        
        return {
            trend,
            average: Math.round(recentAvg),
            change: Math.round(((recentAvg - olderAvg) / olderAvg) * 100)
        };
    }

    // حساب التقلبات
    calculateVolatility(priceData, period = 20) {
        if (priceData.length < period) return 0.02;
        
        const returns = [];
        for (let i = 1; i < period && i < priceData.length; i++) {
            const currentPrice = priceData[priceData.length - i].close;
            const previousPrice = priceData[priceData.length - i - 1].close;
            returns.push((currentPrice - previousPrice) / previousPrice);
        }
        
        const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
        const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
        
        return Math.round(Math.sqrt(variance) * 10000) / 10000;
    }
}

// فئة التعرف على الأنماط
class PatternRecognition {
    detectPatterns(priceData) {
        return {
            bullishPatterns: this.detectBullishPatterns(priceData),
            bearishPatterns: this.detectBearishPatterns(priceData),
            neutralPatterns: this.detectNeutralPatterns(priceData)
        };
    }

    detectBullishPatterns(priceData) {
        const patterns = [];
        
        // نمط المطرقة
        if (this.isHammer(priceData)) {
            patterns.push({
                name: 'Hammer',
                nameAr: 'المطرقة',
                strength: 15,
                description: 'نمط انعكاسي صاعد يشير لنهاية الاتجاه الهابط'
            });
        }
        
        // نمط الابتلاع الصاعد
        if (this.isBullishEngulfing(priceData)) {
            patterns.push({
                name: 'Bullish Engulfing',
                nameAr: 'الابتلاع الصاعد',
                strength: 20,
                description: 'نمط انعكاسي قوي يشير لبداية اتجاه صاعد'
            });
        }
        
        return patterns;
    }

    detectBearishPatterns(priceData) {
        const patterns = [];
        
        // نمط الشهاب
        if (this.isShooting Star(priceData)) {
            patterns.push({
                name: 'Shooting Star',
                nameAr: 'الشهاب',
                strength: 15,
                description: 'نمط انعكاسي هابط يشير لنهاية الاتجاه الصاعد'
            });
        }
        
        // نمط الابتلاع الهابط
        if (this.isBearishEngulfing(priceData)) {
            patterns.push({
                name: 'Bearish Engulfing',
                nameAr: 'الابتلاع الهابط',
                strength: 20,
                description: 'نمط انعكاسي قوي يشير لبداية اتجاه هابط'
            });
        }
        
        return patterns;
    }

    detectNeutralPatterns(priceData) {
        const patterns = [];
        
        // نمط الدوجي
        if (this.isDoji(priceData)) {
            patterns.push({
                name: 'Doji',
                nameAr: 'الدوجي',
                strength: 10,
                description: 'نمط تردد يشير لعدم وضوح الاتجاه'
            });
        }
        
        return patterns;
    }

    // التحقق من نمط المطرقة
    isHammer(priceData) {
        if (priceData.length < 2) return false;
        
        const current = priceData[priceData.length - 1];
        const bodySize = Math.abs(current.close - current.open);
        const lowerShadow = Math.min(current.open, current.close) - current.low;
        const upperShadow = current.high - Math.max(current.open, current.close);
        
        return lowerShadow > bodySize * 2 && upperShadow < bodySize * 0.5;
    }

    // التحقق من نمط الابتلاع الصاعد
    isBullishEngulfing(priceData) {
        if (priceData.length < 2) return false;
        
        const current = priceData[priceData.length - 1];
        const previous = priceData[priceData.length - 2];
        
        return previous.close < previous.open && // الشمعة السابقة حمراء
               current.close > current.open && // الشمعة الحالية خضراء
               current.open < previous.close && // فتح أقل من إغلاق السابقة
               current.close > previous.open;   // إغلاق أعلى من فتح السابقة
    }

    // التحقق من نمط الشهاب
    isShootingStar(priceData) {
        if (priceData.length < 2) return false;
        
        const current = priceData[priceData.length - 1];
        const bodySize = Math.abs(current.close - current.open);
        const upperShadow = current.high - Math.max(current.open, current.close);
        const lowerShadow = Math.min(current.open, current.close) - current.low;
        
        return upperShadow > bodySize * 2 && lowerShadow < bodySize * 0.5;
    }

    // التحقق من نمط الابتلاع الهابط
    isBearishEngulfing(priceData) {
        if (priceData.length < 2) return false;
        
        const current = priceData[priceData.length - 1];
        const previous = priceData[priceData.length - 2];
        
        return previous.close > previous.open && // الشمعة السابقة خضراء
               current.close < current.open && // الشمعة الحالية حمراء
               current.open > previous.close && // فتح أعلى من إغلاق السابقة
               current.close < previous.open;   // إغلاق أقل من فتح السابقة
    }

    // التحقق من نمط الدوجي
    isDoji(priceData) {
        if (priceData.length < 1) return false;
        
        const current = priceData[priceData.length - 1];
        const bodySize = Math.abs(current.close - current.open);
        const totalRange = current.high - current.low;
        
        return bodySize < totalRange * 0.1; // الجسم أقل من 10% من المدى الكلي
    }
}

// فئة تحليل السيناريوهات
class ScenarioAnalysis {
    generateScenarios(priceData, technicalAnalysis) {
        const currentPrice = priceData[priceData.length - 1].close;
        
        return {
            bullish: this.generateBullishScenario(currentPrice, technicalAnalysis),
            bearish: this.generateBearishScenario(currentPrice, technicalAnalysis),
            neutral: this.generateNeutralScenario(currentPrice, technicalAnalysis)
        };
    }

    generateBullishScenario(currentPrice, technical) {
        return {
            probability: this.calculateBullishProbability(technical),
            priceTarget: currentPrice * 1.15, // 15% ارتفاع
            timeframe: '1-2 أسابيع',
            keyFactors: [
                'كسر مستوى المقاومة الرئيسي',
                'زيادة في حجم التداول',
                'تحسن المؤشرات الفنية',
                'اتجاه السوق العام إيجابي'
            ],
            risks: [
                'مقاومة قوية عند مستويات عليا',
                'تراجع حجم التداول',
                'أخبار سلبية للسوق'
            ]
        };
    }

    generateBearishScenario(currentPrice, technical) {
        return {
            probability: this.calculateBearishProbability(technical),
            priceTarget: currentPrice * 0.85, // 15% انخفاض
            timeframe: '1-2 أسابيع',
            keyFactors: [
                'كسر مستوى الدعم الرئيسي',
                'ضعف في حجم التداول',
                'تدهور المؤشرات الفنية',
                'اتجاه السوق العام سلبي'
            ],
            risks: [
                'دعم قوي عند مستويات دنيا',
                'تدخل المشترين',
                'أخبار إيجابية مفاجئة'
            ]
        };
    }

    generateNeutralScenario(currentPrice, technical) {
        return {
            probability: 100 - this.calculateBullishProbability(technical) - this.calculateBearishProbability(technical),
            priceRange: {
                upper: currentPrice * 1.05,
                lower: currentPrice * 0.95
            },
            timeframe: '1-3 أسابيع',
            keyFactors: [
                'تذبذب بين مستويات الدعم والمقاومة',
                'عدم وضوح الاتجاه',
                'انتظار محفزات خارجية',
                'توازن بين القوى الشرائية والبيعية'
            ]
        };
    }

    calculateBullishProbability(technical) {
        let probability = 0;
        
        if (technical.rsi < 30) probability += 20;
        if (technical.macd.signal === 'bullish') probability += 15;
        if (technical.movingAverages.trend === 'bullish') probability += 20;
        if (technical.supportResistance.nearSupport) probability += 15;
        if (technical.volume.trend === 'increasing') probability += 10;
        
        return Math.min(70, probability);
    }

    calculateBearishProbability(technical) {
        let probability = 0;
        
        if (technical.rsi > 70) probability += 20;
        if (technical.macd.signal === 'bearish') probability += 15;
        if (technical.movingAverages.trend === 'bearish') probability += 20;
        if (technical.supportResistance.nearResistance) probability += 15;
        if (technical.volume.trend === 'decreasing') probability += 10;
        
        return Math.min(70, probability);
    }
}

// فئة إدارة المخاطر
class RiskManagement {
    assessRisk(priceData, technicalAnalysis) {
        const volatilityRisk = this.assessVolatilityRisk(technicalAnalysis.volatility);
        const technicalRisk = this.assessTechnicalRisk(technicalAnalysis);
        const marketRisk = this.assessMarketRisk(priceData);
        
        const overallRisk = this.calculateOverallRisk(volatilityRisk, technicalRisk, marketRisk);
        
        return {
            level: overallRisk.level,
            score: overallRisk.score,
            factors: {
                volatility: volatilityRisk,
                technical: technicalRisk,
                market: marketRisk
            },
            recommendations: this.generateRiskRecommendations(overallRisk.level)
        };
    }

    assessVolatilityRisk(volatility) {
        if (volatility > 0.05) return { level: 'high', score: 80 };
        if (volatility > 0.03) return { level: 'medium', score: 50 };
        return { level: 'low', score: 20 };
    }

    assessTechnicalRisk(technical) {
        let riskScore = 0;
        
        // RSI في المناطق المتطرفة
        if (technical.rsi > 80 || technical.rsi < 20) riskScore += 30;
        
        // تضارب في الإشارات
        if (technical.macd.signal !== technical.movingAverages.trend) riskScore += 20;
        
        // قرب مستويات حرجة
        if (technical.supportResistance.nearResistance || technical.supportResistance.nearSupport) {
            riskScore += 25;
        }
        
        if (riskScore > 60) return { level: 'high', score: riskScore };
        if (riskScore > 30) return { level: 'medium', score: riskScore };
        return { level: 'low', score: riskScore };
    }

    assessMarketRisk(priceData) {
        // تحليل بسيط لمخاطر السوق
        const recentPrices = priceData.slice(-10).map(d => d.close);
        const priceChanges = [];
        
        for (let i = 1; i < recentPrices.length; i++) {
            priceChanges.push(Math.abs((recentPrices[i] - recentPrices[i-1]) / recentPrices[i-1]));
        }
        
        const avgChange = priceChanges.reduce((sum, change) => sum + change, 0) / priceChanges.length;
        
        if (avgChange > 0.03) return { level: 'high', score: 70 };
        if (avgChange > 0.015) return { level: 'medium', score: 40 };
        return { level: 'low', score: 15 };
    }

    calculateOverallRisk(volatilityRisk, technicalRisk, marketRisk) {
        const weightedScore = (volatilityRisk.score * 0.4) + (technicalRisk.score * 0.4) + (marketRisk.score * 0.2);
        
        let level;
        if (weightedScore > 60) level = 'high';
        else if (weightedScore > 35) level = 'medium';
        else level = 'low';
        
        return { level, score: Math.round(weightedScore) };
    }

    generateRiskRecommendations(riskLevel) {
        const recommendations = {
            low: [
                'يمكن استخدام حجم مركز عادي',
                'وقف خسارة عند 2-3%',
                'مناسب للمتداولين المبتدئين'
            ],
            medium: [
                'استخدم حجم مركز متوسط',
                'وقف خسارة عند 3-4%',
                'راقب السوق عن كثب',
                'مناسب للمتداولين ذوي الخبرة'
            ],
            high: [
                'استخدم حجم مركز صغير',
                'وقف خسارة ضيق عند 2%',
                'تجنب إذا كنت مبتدئاً',
                'راقب السوق باستمرار',
                'كن مستعداً للخروج السريع'
            ]
        };
        
        return recommendations[riskLevel] || recommendations.medium;
    }
}

// تصدير المحرك الرئيسي
const analysisEngine = new TechnicalAnalysisEngine();

// وظائف مساعدة للاستخدام في الصفحات الأخرى
window.AnalysisEngine = {
    analyze: (symbol, timeframe) => analysisEngine.analyzeComprehensive(symbol, timeframe),
    getQuickAnalysis: (symbol) => analysisEngine.analyzeComprehensive(symbol, '4h')
};
