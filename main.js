/**
 * 懿美聲 K11 - 浮誇極致版行動 KTV 娛樂終端
 * 核心互動引擎：動態粒子畫布、自定義光圈鼠標、極限 3D 傾斜、空間音效合成
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. 浮誇前置作業：動態插入必備的 HTML 元素
    // ==========================================
    // 插入背景粒子畫布
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    document.body.prepend(canvas);

    // 插入自定義鼠標
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    const cursorOutline = document.createElement('div');
    cursorOutline.className = 'custom-cursor-outline';
    document.body.appendChild(cursor);
    document.body.appendChild(cursorOutline);

    // ==========================================
    // 1. 賽博龐克：全螢幕動態粒子星空背景
    // ==========================================
    const ctx = canvas.getContext('2d');
    let particlesArray;

    function initCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    initCanvas();
    window.addEventListener('resize', initCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1.5 - 0.75;
            // 隨機顏色：金、藍、紫、粉
            const colors = ['#f1c40f', '#00f2fe', '#bc13fe', '#ff00de', '#ffffff'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            // 讓粒子從邊緣消失後從另一邊出現
            if (this.x > canvas.width) this.x = 0;
            else if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            else if (this.y < 0) this.y = canvas.height;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            // 為粒子添加微微發光效果
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
        }
    }

    function initParticles() {
        particlesArray = [];
        const numberOfParticles = (canvas.width * canvas.height) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }
    
    initParticles();
    animateParticles();

    // ==========================================
    // 2. 未來科技：自定義鼠標追蹤與吸附特效
    // ==========================================
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        
        // 實心點無延遲跟隨
        cursor.style.left = `${posX - 10}px`;
        cursor.style.top = `${posY - 10}px`;
        
        // 外圈帶有稍微延遲的平滑感
        cursorOutline.animate({
            left: `${posX - 20}px`,
            top: `${posY - 20}px`
        }, { duration: 150, fill: "forwards" });
    });

    // 當滑鼠移過可點擊元素時，光圈放大並變色
    const interactables = document.querySelectorAll('a, button, input, select, .feature-card, .price-box');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = 'scale(1.5)';
            cursorOutline.style.borderColor = '#f1c40f';
            cursorOutline.style.boxShadow = '0 0 15px rgba(241, 196, 15, 0.8)';
            cursor.style.transform = 'scale(0.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = 'scale(1)';
            cursorOutline.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            cursorOutline.style.boxShadow = 'none';
            cursor.style.transform = 'scale(1)';
        });
    });

    // ==========================================
    // 3. 飢餓行銷：極限倒數計時器 (模擬即將完售)
    // ==========================================
    const hoursElem = document.getElementById('hours');
    const minutesElem = document.getElementById('minutes');
    const secondsElem = document.getElementById('seconds');
    
    if(hoursElem && minutesElem && secondsElem) {
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
        setInterval(updateTimer, 1000);
    }

    // ==========================================
    // 4. 空間聲學黑科技：Web Audio API 音效合成器
    // ==========================================
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

    function playBassDrop() {
        initAudio();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.6);
        gainNode.gain.setValueAtTime(0.6, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.6);
    }

    const ctaButtons = document.querySelectorAll('.cta-button, .submit-btn');
    ctaButtons.forEach(btn => {
        btn.addEventListener('mouseenter', playBassDrop);
        btn.addEventListener('click', playBassDrop);
    });

    document.body.addEventListener('click', initAudio, { once: true });

    // ==========================================
    // 5. 視覺極限：3D 物理懸浮傾斜引擎 (Parallax Tilt) 強化版
    // ==========================================
    const tiltElements = document.querySelectorAll('.feature-card, .visual-content, .price-box, .order-form, .invoice-notice, .hero-image-wrapper, .infographic-wrapper');
    
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xPct = (x / rect.width) - 0.5;
            const yPct = (y / rect.height) - 0.5;
            
            // 增加傾斜倍率，使 3D 效果更加劇烈浮誇
            const rotateX = yPct * -30; 
            const rotateY = xPct * 30;  
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            el.style.transition = 'none'; 
            el.style.zIndex = '10';
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            // 增加回彈的彈性過渡曲線
            el.style.transition = 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            el.style.zIndex = '1';
        });
    });

    // ==========================================
    // 6. 平滑滾動導航 (Smooth Scroll)
    // ==========================================
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
    // 7. 滾動視差進場動畫 (Intersection Observer)
    // ==========================================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -100px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0) scale(1) rotateX(0deg)";
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.feature-card, .visual-content, .order-form, .invoice-notice');
    animatedElements.forEach((el, index) => {
        el.style.opacity = "0";
        // 加入 3D 翻轉進場與交錯延遲
        el.style.transform = "translateY(80px) scale(0.9) rotateX(20deg)";
        el.style.transition = `all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index * 0.1}s`;
        observer.observe(el);
    });

});
