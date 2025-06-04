// DOM要素の取得
const header = document.getElementById('header');
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.getElementById('navLinks');
const navLinksItems = document.querySelectorAll('.nav-link, .cta-button');
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

// スクロール位置の管理
let lastScroll = 0;
let ticking = false;

// ヘッダーの表示/非表示制御
function updateHeader() {
    const currentScroll = window.pageYOffset;
    
    // スクロール位置に応じてヘッダーにクラスを追加
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // スクロール方向に応じてヘッダーを表示/非表示
    if (currentScroll <= 0) {
        header.style.transform = 'translateY(0)';
    } else if (currentScroll > lastScroll && currentScroll > 200) {
        // 下スクロール時
        header.style.transform = 'translateY(-100%)';
        // モバイルメニューが開いている場合は閉じる
        if (navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    } else {
        // 上スクロール時
        header.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
    ticking = false;
}

// スクロールイベントの最適化
function requestTick() {
    if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
    }
}

// モバイルメニューの開閉
function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    navLinks.classList.remove('active');
    document.body.style.overflow = '';
}

// スムーススクロール
function smoothScroll(target) {
    const targetElement = document.querySelector(target);
    if (!targetElement) return;
    
    const headerHeight = header.offsetHeight;
    const targetPosition = targetElement.offsetTop - headerHeight - 20;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// タブ切り替え機能
function switchTab(tabName) {
    // すべてのタブボタンとコンテンツを非アクティブに
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // 選択されたタブをアクティブに
    const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
    const activeContent = document.getElementById(tabName);
    
    if (activeButton && activeContent) {
        activeButton.classList.add('active');
        activeContent.classList.add('active');
    }
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(30px)';
            
            // アニメーションを適用
            setTimeout(() => {
                entry.target.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 100);
            
            // 一度表示したら監視を解除
            animationObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// パフォーマンスカウンターアニメーション
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ページロード時の初期化
function init() {
    // スクロールイベントリスナー
    window.addEventListener('scroll', requestTick);
    
    // モバイルメニューのイベントリスナー
    if (mobileMenu) {
        mobileMenu.addEventListener('click', toggleMobileMenu);
    }
    
    // ナビゲーションリンクのイベントリスナー
    navLinksItems.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                smoothScroll(href);
                closeMobileMenu();
            }
        });
    });
    
    // タブボタンのイベントリスナー
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    // アンカーリンクのスムーススクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href && href !== '#') {
                e.preventDefault();
                smoothScroll(href);
            }
        });
    });
    
    // アニメーション要素の監視
    const animatedElements = document.querySelectorAll(
        '.problem-card, .reason-card, .service-card, .achievement-card, .section-header'
    );
    animatedElements.forEach(el => animationObserver.observe(el));
    
    // 統計数値のアニメーション
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statValues = entry.target.querySelectorAll('.stat-value');
                statValues.forEach(stat => {
                    const text = stat.textContent;
                    const match = text.match(/\d+/);
                    if (match) {
                        const value = parseInt(match[0]);
                        const suffix = text.replace(match[0], '');
                        stat.textContent = '0' + suffix;
                        setTimeout(() => {
                            animateCounter(stat, value);
                            setTimeout(() => {
                                stat.innerHTML = value + suffix.split('').map(char => 
                                    `<span class="${char === '+' ? 'stat-plus' : char === '%' ? 'stat-unit' : char === 'h' ? 'stat-unit' : ''}">${char}</span>`
                                ).join('');
                            }, 2000);
                        }, 200);
                    }
                });
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statObserver.observe(heroStats);
    }
    
    // ESCキーでモバイルメニューを閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // モバイルメニュー外クリックで閉じる
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !mobileMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // ページロード時のURLハッシュ処理
    if (window.location.hash) {
        setTimeout(() => {
            smoothScroll(window.location.hash);
        }, 100);
    }
}

// DOMContentLoadedで初期化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// リサイズ時の処理
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // モバイルメニューが開いている状態でデスクトップサイズになった場合
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    }, 250);
});

// フォーム送信処理（将来的な実装用）
function handleFormSubmit(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // フォームデータの取得
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // ここに送信処理を実装
        console.log('Form submitted:', data);
        
        // 成功メッセージの表示など
        alert('お問い合わせありがとうございます。24時間以内にご連絡いたします。');
        form.reset();
    });
}

// パフォーマンス最適化：画像の遅延読み込み
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
