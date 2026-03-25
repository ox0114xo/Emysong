/**
 * 懿美聲 K11 - 頂規智能行動 KTV 娛樂終端
 * 核心互動引擎：3D 物理傾斜引擎、Web Audio API 空間音效合成、極限倒數計時器、平滑滾動
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. 飢餓行銷：極限倒數計時器 (模擬即將完售)
    // ==========================================
    const hoursElem = document.getElementById('hours');
    const minutesElem = document.getElementById('minutes');
    const secondsElem = document.getElementById('seconds');
    
    // 設定初始倒數時間 (23小時 59分 59秒)
    let totalSeconds = 23 * 3600 + 59 * 60 + 59;

    function updateTimer() {
        if (totalSeconds <= 0) return;
        totalSeconds--;
        
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        
        hoursElem.textContent = h.toString().padStart(2, '0');
        minutesElem.textContent = m.toString().padStart(2, '0');
        secondsElem.textContent = s.toString().padStart(2, '0');
    }
    
    // 每秒更新一次
    setInterval(updateTimer, 1000);

    // ==========================================
    // 2. 空間聲學黑科技：Web Audio API 音效合成器
    // ==========================================
    // 直接調用瀏覽器底層 API，合成重低音效，無需外掛音檔
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx;

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    // 合成震撼的低頻音效 (模擬重低音)
    function playBassDrop() {
        initAudio();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        // 設定波形為正弦波，產生純淨低音
        oscillator.type = 'sine';
        
        // 頻率從 150Hz 瞬間下潛到 30Hz，創造空間感
        oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.5);
        
        // 音量控制：瞬間大聲後快速淡出
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.5);
    }

    // 綁定音效到主要行動按鈕
    const ctaButtons = document.querySelectorAll('.cta-button, .submit-btn');
    ctaButtons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            playBassDrop();
        });
        btn.addEventListener('click', (e) => {
            playBassDrop(); 
        });
    });

    // 確保瀏覽器允許播放聲音：在第一次全域點擊時初始化 AudioContext
    document.body.addEventListener('click', initAudio, { once: true });

    // ==========================================
    // 3. 視覺極限：3D 物理懸浮傾斜引擎 (Parallax Tilt)
    // ==========================================
    // 讓特點卡片、視覺區塊、表單與開票說明在滑鼠移動時產生 3D 旋轉
    const tiltElements = document.querySelectorAll('.feature-card, .visual-content, .price-box, .order-form, .invoice-notice');
    
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            // 計算滑鼠在元素內的 X Y 座標
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // 將座標轉換為百分比 (-0.5 到 0.5)
            const xPct = (x / rect.width) - 0.5;
            const yPct = (y / rect.height) - 0.5;
            
            // 計算旋轉角度 (乘數決定傾斜程度)
            const rotateX = yPct * -20; // 上下傾斜
            const rotateY = xPct * 20;  // 左右傾斜
            
            // 套用 3D 轉換矩陣
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            el.style.transition = 'none'; // 移除過渡以達到零延遲跟隨
            el.style.zIndex = '10';
        });
        
        // 滑鼠離開時，平滑回歸原位
        el.addEventListener('mouseleave', () => {
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            el.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            el.style.zIndex = '1';
        });
    });

    // ==========================================
    // 4. 平滑滾動導航 (Smooth Scroll)
    // ==========================================
    // 點擊「立即搶購」等錨點連結時，平滑滾動到對應區塊
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ==========================================
    // 5. 滾動視差進場動畫 (Intersection Observer)
    // ==========================================
    // 當元素進入畫面視窗時，觸發淡入並上浮的動畫
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0) scale(1)";
                observer.unobserve(entry.target); // 動畫只執行一次
            }
        });
    }, observerOptions);

    // 需動態進場的元素：特點卡片、視覺區塊、表單、開票說明
    const animatedElements = document.querySelectorAll('.feature-card, .visual-content, .order-form, .invoice-notice');
    animatedElements.forEach(el => {
        // 設定初始隱藏狀態
        el.style.opacity = "0";
        el.style.transform = "translateY(40px) scale(0.98)";
        // 設定動畫過渡曲線
        el.style.transition = "all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        observer.observe(el);
    });

});
