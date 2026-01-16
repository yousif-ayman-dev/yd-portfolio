/* ============================================
   📜 ملف JavaScript الرئيسي - النسخة النهائية المعدلة
   ============================================
   
   🎯 التعديلات الرئيسية:
   1. إصلاح نظام Dark Mode
   2. إضافة قائمة هامبرجر للجوال مع ترتيب Z-index محكم
   3. تحسين نموذج Formspree مع إشعارات Toast
   4. تحسين إمكانية الوصول (Accessibility)
   5. إضافة صفحة 404
   ============================================ */

// ⏳ انتظار تحميل DOM بالكامل
document.addEventListener("DOMContentLoaded", function () {

    // ============================================
    // 1. 🧭 شريط التنقل الثابت وقائمة الجوال
    // ============================================
    const nav = document.getElementById('main-nav');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileNavMenu = document.getElementById('mobileNavMenu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    function handleScroll() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // فتح/إغلاق قائمة الجوال
    if (hamburgerBtn && mobileNavMenu) {
        function toggleMobileMenu() {
            const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
            hamburgerBtn.classList.toggle('active');
            mobileNavMenu.classList.toggle('active');
            hamburgerBtn.setAttribute('aria-expanded', !isExpanded);

            // منع التمرير عند فتح القائمة
            document.body.style.overflow = mobileNavMenu.classList.contains('active') ? 'hidden' : '';
        }

        hamburgerBtn.addEventListener('click', toggleMobileMenu);

        // إغلاق القائمة عند النقر على رابط
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                mobileNavMenu.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', function (e) {
            if (mobileNavMenu.classList.contains('active') &&
                !mobileNavMenu.contains(e.target) &&
                !hamburgerBtn.contains(e.target)) {
                toggleMobileMenu();
            }
        });
    }

    // ============================================
    // 2. ✍️ تأثير الكتابة التلقائي
    // ============================================
    const textElement = document.getElementById('typewriter-text');
    if (textElement) {
        const phrases = ["Front-End Developer", "UI/UX Designer", "Cybersecurity Student"];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentPhrase = phrases[phraseIndex];
            if (isDeleting) {
                textElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                textElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }

            let typingSpeed = isDeleting ? 75 : 150;
            if (!isDeleting && charIndex === currentPhrase.length) {
                typingSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 500;
            }
            setTimeout(type, typingSpeed);
        }
        type();
    }

    // ============================================
    // 3. 🎯 التنقل النشط (للقائمتين)
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    function updateActiveNav() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // ============================================
    // 4. 🖼️ فلترة المعرض (مُحسَّنة للوصول)
    // ============================================
    const filterButtons = document.querySelectorAll('.filter-item');
    const portfolioItems = document.querySelectorAll('.project-item');

    function filterPortfolio(filterValue) {
        portfolioItems.forEach(item => {
            const category = item.getAttribute('data-category');
            if (filterValue === 'all' || category === filterValue) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }

    filterButtons.forEach(button => {
        // النقر
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filterValue = button.getAttribute('data-filter');
            filterPortfolio(filterValue);
        });

        // الدخول بالمفتاح (Enter/Space)
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });

    // ============================================
    // 5. 📝 معالجة نموذج الاتصال مع Formspree وإشعارات Toast
    // ============================================
    const contactForm = document.getElementById('contactForm');

    // دالة لعرض إشعارات Toast
    function showToast(message, type = 'success') {
        // إزالة أي إشعار قديم
        const oldToast = document.querySelector('.toast-notification');
        if (oldToast) oldToast.remove();

        // إنشاء الإشعار الجديد
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.textContent = message;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');

        document.body.appendChild(toast);

        // عرض الإشعار
        setTimeout(() => toast.classList.add('show'), 10);

        // إخفاء الإشعار بعد 5 ثوانٍ
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 500);
        }, 5000);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;
            const nameInput = this.querySelector('input[name="name"]');
            const name = nameInput.value || 'User';

            // حالة التحميل
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            try {
                const formData = new FormData(this);
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    // ✅ نجاح الإرسال
                    showToast(`Thank you ${name}! Your message has been sent. I'll respond soon.`, 'success');
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
                    submitBtn.style.backgroundColor = '#2ecc71';

                    // إعادة تعيين النموذج بعد 2 ثانية
                    setTimeout(() => {
                        this.reset();
                        submitBtn.innerHTML = originalHTML;
                        submitBtn.style.backgroundColor = '';
                        submitBtn.disabled = false;
                    }, 2000);
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                // ❌ فشل الإرسال
                console.error('Form error:', error);
                showToast(`Sorry ${name}, there was an error. Please email me directly.`, 'error');
                submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Try Again';
                submitBtn.style.backgroundColor = '#e74c3c';

                setTimeout(() => {
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }

    // ============================================
    // 6. 🔢 الأرقام المتحركة مع Intersection Observer
    // ============================================
    const factsSection = document.getElementById('facts');
    if (factsSection) {
        const factsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    $('.fact-number').each(function () {
                        const targetNum = parseInt($(this).attr('data-count'));
                        $(this).prop('Counter', 0).animate({
                            Counter: targetNum
                        }, {
                            duration: 2000,
                            easing: 'swing',
                            step: function (now) {
                                $(this).text('+' + Math.ceil(now));
                            },
                            complete: function () {
                                $(this).text('+' + targetNum)
                                    .css('transform', 'scale(1.1)')
                                    .animate({ transform: 'scale(1)' }, 300);
                            }
                        });
                    });
                    factsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        factsObserver.observe(factsSection);
    }

    // ============================================
    // 7. 🖱️ مؤشر الماوس المخصص (محسن للأداء)
    // ============================================
    const cursor = document.querySelector('.custom-cursor');
    const cursorFollower = document.querySelector('.custom-cursor-follower');

    if (cursor && cursorFollower) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;
        let animationId;

        setTimeout(() => {
            cursor.style.display = 'block';
            cursorFollower.style.display = 'block';
        }, 1000);

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        }, { passive: true });

        function animateFollower() {
            followerX += (mouseX - followerX) * 0.2;
            followerY += (mouseY - followerY) * 0.2;
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
            animationId = requestAnimationFrame(animateFollower);
        }
        animateFollower();

        const hoverElements = document.querySelectorAll('a, button, .project-item');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.3)';
                cursorFollower.style.opacity = '0.7';
            }, { passive: true });
            el.addEventListener('mouseleave', () => {
                cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorFollower.style.opacity = '0.5';
            }, { passive: true });
        });
    }

    // ============================================
    // 8. 📱 إصلاح ارتفاع الصفحة الرئيسية
    // ============================================
    function fixHeroHeight() {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.style.height = window.innerHeight + 'px';
        }
    }
    window.addEventListener('resize', fixHeroHeight, { passive: true });
    fixHeroHeight();

    // ============================================
    // 9. 👁️ ظهور الأقسام عند التمرير مع Animation
    // ============================================
    const allSections = document.querySelectorAll('section');
    function revealOnScroll() {
        allSections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (sectionTop < windowHeight - 100) {
                section.classList.add('animated');
            }
        });
    }
    window.addEventListener('scroll', revealOnScroll, { passive: true });
    revealOnScroll();

    // ============================================
    // 10. ⚙️ لوحة الإعدادات المربعة (Arlo Square Settings) - معدلة
    // ============================================
    const squareSettingsBtn = document.getElementById('arloSquareSettings');
    const squareSettingsPanel = document.getElementById('arloSquarePanel');
    const squareCloseBtn = document.querySelector('.arlo-square-close');
    const squareDarkModeToggle = document.getElementById('arloSquareDarkMode');
    const squareColorBtns = document.querySelectorAll('.arlo-square-color');
    const squareResetBtn = document.getElementById('arloSquareReset');

    // 10.1 فتح/إغلاق لوحة الإعدادات
    if (squareSettingsBtn && squareSettingsPanel) {
        squareSettingsBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            squareSettingsPanel.classList.toggle('show');
            if (squareSettingsPanel.classList.contains('show')) {
                this.style.transform = 'translateY(-5px) rotate(45deg)';
                this.style.borderRadius = '20px';
            } else {
                this.style.transform = 'translateY(0) rotate(0)';
                this.style.borderRadius = '12px';
            }
        });

        if (squareCloseBtn) {
            squareCloseBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                squareSettingsPanel.classList.remove('show');
                if (squareSettingsBtn) {
                    squareSettingsBtn.style.transform = 'translateY(0) rotate(0)';
                    squareSettingsBtn.style.borderRadius = '12px';
                }
            });
        }

        document.addEventListener('click', function (e) {
            if (squareSettingsPanel.classList.contains('show') &&
                !squareSettingsPanel.contains(e.target) &&
                !squareSettingsBtn.contains(e.target)) {
                squareSettingsPanel.classList.remove('show');
                if (squareSettingsBtn) {
                    squareSettingsBtn.style.transform = 'translateY(0) rotate(0)';
                    squareSettingsBtn.style.borderRadius = '12px';
                }
            }
        });
        squareSettingsPanel.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }

    // 10.2 الوضع الليلي - **مُصلح الآن (يستخدم dark-theme)**
    if (squareDarkModeToggle) {
        // تحميل الإعداد المحفوظ
        const savedSquareDarkMode = localStorage.getItem('arloSquareDarkMode') === 'true';
        squareDarkModeToggle.checked = savedSquareDarkMode;
        if (savedSquareDarkMode) {
            document.body.classList.add('dark-theme'); // تغيير من 'arlo-square-dark'
        }

        // التبديل
        squareDarkModeToggle.addEventListener('change', function () {
            document.body.classList.toggle('dark-theme', this.checked); // تغيير من 'arlo-square-dark'
            localStorage.setItem('arloSquareDarkMode', this.checked);
        });
    }

    // 10.3 تغيير الألوان
    function squareShadeColor(color, percent) {
        let R = parseInt(color.substring(1, 3), 16);
        let G = parseInt(color.substring(3, 5), 16);
        let B = parseInt(color.substring(5, 7), 16);
        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);
        R = (R < 255) ? R : 255;
        G = (G < 255) ? G : 255;
        B = (B < 255) ? B : 255;
        const RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
        const GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
        const BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));
        return "#" + RR + GG + BB;
    }

    squareColorBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            squareColorBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const color = this.getAttribute('data-color');
            document.documentElement.style.setProperty('--primary-color', color);
            localStorage.setItem('arloSquarePrimaryColor', color);
            const darkColor = squareShadeColor(color, -20);
            document.documentElement.style.setProperty('--primary-dark', darkColor);
            const lightColor = squareShadeColor(color, 40);
            document.documentElement.style.setProperty('--primary-light', lightColor);
        });
    });

    // 10.4 إعادة التعيين
    if (squareResetBtn) {
        squareResetBtn.addEventListener('click', function () {
            document.documentElement.style.setProperty('--primary-color', '#ff1e56');
            document.documentElement.style.setProperty('--primary-dark', '#d1194a');
            document.documentElement.style.setProperty('--primary-light', '#ff6b9d');
            squareColorBtns.forEach(btn => {
                if (btn.getAttribute('data-color') === '#ff1e56') {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            document.body.classList.remove('dark-theme'); // تغيير من 'arlo-square-dark'
            if (squareDarkModeToggle) {
                squareDarkModeToggle.checked = false;
            }
            localStorage.removeItem('arloSquareDarkMode');
            localStorage.removeItem('arloSquarePrimaryColor');
            showToast('Settings have been reset to default!', 'success');
        });
    }

    // 10.5 تحميل التفضيلات المحفوظة
    function loadSquarePreferences() {
        const savedSquareColor = localStorage.getItem('arloSquarePrimaryColor');
        if (savedSquareColor) {
            document.documentElement.style.setProperty('--primary-color', savedSquareColor);
            document.documentElement.style.setProperty('--primary-dark', squareShadeColor(savedSquareColor, -20));
            document.documentElement.style.setProperty('--primary-light', squareShadeColor(savedSquareColor, 40));
            squareColorBtns.forEach(btn => {
                if (btn.getAttribute('data-color') === savedSquareColor) {
                    btn.classList.add('active');
                }
            });
        }
    }
    loadSquarePreferences();

    // ============================================
    // 11. 🚨 محاكاة صفحة 404 للاختبار (تعمل عند زيارة رابط غير صحيح)
    // ============================================
    // في موقع حقيقي، هذه الصفحة تكون منفصلة (404.html)
    // هذه مجرد محاكاة للعرض
    function simulate404Page() {
        // إنصراف الصفحة إذا وجدت مسبقاً
        const oldPage = document.querySelector('.page-404');
        if (oldPage) oldPage.remove();

        const page404 = document.createElement('div');
        page404.className = 'page-404';
        page404.innerHTML = `
            <div class="error-content">
                <h1>404</h1>
                <h2>Page Not Found</h2>
                <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
                <a href="#home" class="btn-primary btn-float">Back to Homepage</a>
            </div>
        `;
        document.body.appendChild(page404);

        // إضافة حدث للزر للعودة للرئيسية
        const backBtn = page404.querySelector('a');
        if (backBtn) {
            backBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.hash = 'home';
                page404.classList.remove('active');
                setTimeout(() => {
                    if (page404.parentNode) page404.parentNode.removeChild(page404);
                }, 300);
            });
        }
        return page404;
    }

    // للاختبار فقط: عرض صفحة 404 عند الضغط على Ctrl+Alt+4
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.altKey && e.key === '4') {
            e.preventDefault();
            const page404 = simulate404Page();
            setTimeout(() => page404.classList.add('active'), 10);
        }
    });

    // للاختبار فقط: رابط لفتح 404 (يمكن حذفه)
    const test404Link = document.createElement('a');
    test404Link.href = '#';
    test404Link.textContent = 'Test 404 Page (Dev Only)';
    test404Link.style.cssText = 'position:fixed; bottom:10px; left:10px; background:#333; color:#fff; padding:5px 10px; border-radius:5px; z-index:99999; font-size:12px;';
    test404Link.addEventListener('click', function (e) {
        e.preventDefault();
        const page404 = simulate404Page();
        setTimeout(() => page404.classList.add('active'), 10);
    });
    // document.body.appendChild(test404Link); // فك التعليق للاختبار المحلي

});

// ============================================
// 12. 🚀 تأثير تحميل الصفحة
// ============================================
window.addEventListener('load', function () {
    document.body.classList.add('loaded');
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

// ============================================
// 13. 🛡️ معالجة الأخطاء العامة
// ============================================
window.addEventListener('error', function (e) {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', function (e) {
    console.error('Unhandled promise rejection:', e.reason);
});