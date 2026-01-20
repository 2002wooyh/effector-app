const tutors = [
    {
        id: 1,
        name: "로봇공학",
        subject: "Engineering",
        subjectDisplay: "로봇시스템 제어",
        tagline: "미래를 설계하는 로봇 공학의 모든 것",
        price: 45000,
        rating: 4.9,
        reviews: 120,
        img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=400&q=80",
        bio: "휴머노이드 로봇 개발자 출신. 이론부터 실무까지 확실하게 잡아드립니다.",
        education: "MIT 기계공학 박사",
        experience: "로봇 연구소 7년",
        methodology: "실습 위주, 프로젝트 기반 학습"
    },
    {
        id: 2,
        name: "항공우주",
        subject: "Aerospace",
        subjectDisplay: "항공우주역학",
        tagline: "우주를 향한 도전, 항공우주 공학",
        price: 50000,
        rating: 5.0,
        reviews: 85,
        img: "https://images.unsplash.com/photo-1454789548728-85d1c47baba0?auto=format&fit=crop&w=400&q=80",
        bio: "NASA 프로젝트 참여 경험. 항공 역학의 핵심 원리를 꿰뚫어 드립니다.",
        education: "KAIST 항공우주공학 석사",
        experience: "항공 우주 연구원 5년",
        methodology: "심화 이론, 최신 논문 분석"
    },
    {
        id: 3,
        name: "경제학",
        subject: "Economics",
        subjectDisplay: "거시경제학",
        tagline: "복잡한 경제 흐름, 한눈에 읽어드립니다",
        price: 40000,
        rating: 4.8,
        reviews: 210,
        img: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=400&q=80",
        bio: "증권사 애널리스트 출신. 실전 경제 지식과 이론을 접목해 설명합니다.",
        education: "서울대학교 경제학부",
        experience: "금융권 10년",
        methodology: "사례 중심, 뉴스 분석"
    }
];

const reels = [
    {
        id: 1,
        tutorId: 1,
        title: "로봇, 어디까지 발전했나?",
        desc: "최신 휴머노이드 로봇의 제어 알고리즘 시연 영상입니다. 실제 움직임을 확인해보세요!",
        tags: ["#로봇공학", "#제어이론", "#휴머노이드"],
        likes: "1.2k",
        comments: 42,
        videoSrc: "videos/video1.mp4"
    },
    {
        id: 2,
        tutorId: 2,
        title: "화성 탐사선 발사 순간",
        desc: "역사적인 순간! 추진체 분리부터 궤도 진입까지, 항공우주 역학의 결정체입니다.",
        tags: ["#항공우주", "#NASA", "#로켓과학"],
        likes: "3.5k",
        comments: 156,
        videoSrc: "videos/video2.mp4"
    },
    {
        id: 3,
        tutorId: 3,
        title: "금리 인상, 내 지갑엔 어떤 영향?",
        desc: "복잡한 경제 뉴스를 1분 만에 정리해드립니다. 환율과 주가의 상관관계는?",
        tags: ["#경제학", "#재테크", "#시사상식"],
        likes: "890",
        comments: 34,
        videoSrc: "videos/video3.mp4"
    }
];

const quizQuestions = [
    {
        q: "가상 공간을 넘어, 실제 물리적 세계와 상호작용하는 차세대 AI는?",
        options: ["생성형 AI", "피지컬 AI", "메타버스", "블록체인"],
        answer: 1
    },
    {
        q: "대한민국이 독자 개발에 성공한 한국형 우주 발사체(KSLV-II)의 이름은?",
        options: ["나로호", "다누리", "누리호", "우리별 1호"],
        answer: 2
    },
    {
        q: "기준 금리가 오르면 일반적으로 주가는 어떻게 될까요?",
        options: ["오른다", "내린다", "변화 없다"],
        answer: 1
    }
];

/* --- App Logic --- */
const app = {
    state: {
        tutors: tutors,
        filteredTutors: tutors,
        currentSubject: 'all',
        reels: reels, // Initialize with static data
        savedReels: new Set(), // Store IDs of saved reels
        quizScore: 0,
        currentQuestion: 0
    },

    /* --- VISUAL DEBUGGER --- */
    /* --- VISUAL DEBUGGER (DISABLED FOR PRODUCTION) --- */
    log: (msg) => {
        // console.log(msg); // Optional: Keep console logs for dev, or comment out for production.
        // Visual overlay disabled for release.
    },

    /* --- Video Observer (Autoplay/Pause) --- */
    observer: null,

    createObserver: () => {
        const options = {
            root: document.getElementById('mobile-container'),
            threshold: 0.6
        };

        app.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target.querySelector('video');
                if (!video) return;

                if (entry.isIntersecting) {
                    // 1. Always ensure muted first for browser policy
                    video.muted = true;

                    // 2. Play
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise.then(() => {
                            // 3. If Global State says UNMUTED, try to unmute
                            if (!app.state.isMuted) {
                                video.muted = false;
                            }
                        }).catch(error => {
                            console.warn("Autoplay blocked/failed:", error);
                        });
                    }
                } else {
                    video.pause();
                    video.currentTime = 0;
                }
            });
        }, options);
    },

    init: async () => {
        app.log("App Init Started");
        // Initial State
        app.state = {
            currentTab: 'home',
            reels: [...reels], // Ensure we start with a COPY of static reels
            savedReels: new Set(), // Store IDs
            tutors: tutors, // Mock data
            currentSubject: 'all',
            filteredTutors: tutors,
            quizScore: 0,
            currentQuestion: 0,
            timerInterval: null,
            isMuted: false, // Global mute state for all reels
            documents: [
                { id: 1, title: "[샘플] 대학 강의자료 요약", ext: "PDF", date: "2026-01-18", category: "Chapter 4" },
                { id: 2, title: "[샘플] 딥러닝 논문", ext: "PDF", date: "2026-01-18", category: "Deep Learning" },
                { id: 3, title: "양자역학의 이해", ext: "YOUTUBE", date: "2026-01-18", category: "Physics" }
            ]
        };

        // Navigation
        app.bottomNavItems = document.querySelectorAll('.nav-item');
        app.screens = document.querySelectorAll('.screen');

        // Load content
        app.createObserver(); // Initialize observer

        // Initialize Study Timer
        // 45 min 20 sec = 2720 sec
        app.state.studySeconds = 2720;
        app.startStudyTimer();

        // Start at Home (Tab 1: Status/Dashboard) IMMEDIATELY
        app.navigate('status');

        app.renderReels();

        app.renderDocuments(); // Render initial docs

        // Async discovery can happen in background
        app.discoverNewVideos().then(() => {
            app.renderReels(); // Re-render if new videos found
        });

        app.log("App Init Completed");
    },

    /* --- Auto Discovery Logic --- */
    discoverNewVideos: async () => {
        const MAX_CHECK = 10; // Check up to video10.mp4
        const existingSrcs = new Set(app.state.reels.map(r => r.videoSrc));

        // Helper to check file existence via fetch (HEAD request simulation)
        const checkFile = (num) => {
            return new Promise(resolve => {
                const src = `videos/video${num}.mp4`;
                const vid = document.createElement('video');
                vid.src = src;
                vid.onloadedmetadata = () => resolve({ exists: true, src });
                vid.onerror = () => resolve({ exists: false, src });
            });
        };

        const checks = [];
        for (let i = 1; i <= MAX_CHECK; i++) {
            checks.push(checkFile(i));
        }

        const results = await Promise.all(checks);

        results.forEach((res, idx) => {
            if (res.exists && !existingSrcs.has(res.src)) {
                // New video found! Add to state
                app.state.reels.push({
                    id: Date.now() + idx, // Unique ID
                    tutorId: (idx % 3) + 1, // Cycle tutors
                    title: `새로운 동영상 ${idx + 1}`,
                    desc: "폴더에서 자동으로 감지된 영상입니다.",
                    tags: ["#New", "#Auto"],
                    likes: "0",
                    comments: 0,
                    videoSrc: res.src
                });
            }
        });
    },

    /* --- Sound Logic --- */
    toggleGlobalMute: () => {
        // Toggle global mute state
        app.state.isMuted = !app.state.isMuted;

        // Apply to ALL videos
        const videos = document.querySelectorAll('.reel-video');
        videos.forEach(video => {
            video.muted = app.state.isMuted;
        });

        // Update button icon
        const btn = document.getElementById('global-sound-toggle');
        const icon = btn.querySelector('i');
        icon.className = app.state.isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
    },

    navigate: (screenId) => {
        app.log(`Navigate called: ${screenId}`);
        // Track History for Chat
        if (screenId === 'chat') {
            const currentActive = document.querySelector('.screen.active');
            if (currentActive && currentActive.id !== 'chat-screen') {
                app.state.lastScreen = currentActive.id.replace('-screen', '');
            } else if (!app.state.lastScreen) {
                app.state.lastScreen = 'home'; // Default fallback
            }
        }

        // 1. Show Screen
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(screenId + '-screen');
        if (target) {
            target.classList.add('active');
            app.log(`Screen activated: #${screenId}-screen`);
        } else {
            app.log(`Target screen NOT FOUND: #${screenId}-screen`);
        }

        // Animation Trigger Logic
        if (screenId === 'status') {
            app.playGreetingAnimation();
        }

        if (screenId === 'stats') {
            app.log("Screen IS stats -> Triggering startMessageRotation");
            app.startMessageRotation();
        } else {
            // Only stop if we are NOT in stats
            // Wait, if I navigate to 'home', I should stop stats rotation
            app.log("Screen NOT stats -> Stopping rotation");
            app.stopMessageRotation();
        }

        // 2. Reels Mode & Chat Mode Check
        const container = document.getElementById('mobile-container');

        // Reset Modes
        container.classList.remove('reels-mode');
        container.classList.remove('chat-mode');

        if (screenId === 'home') {
            container.classList.add('reels-mode');

            // Critical Fix: Double RAF to ensure layout is fully painted before calculating heights
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    app.setupInfiniteScroll();
                });
            });
        } else if (screenId === 'chat') {
            container.classList.add('chat-mode');
        } else if (screenId === 'upload') {
            app.renderDocuments(); // Ensure docs are rendered
        }

        // 3. Update Nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            const clickAttr = item.getAttribute('onclick');
            if (clickAttr && clickAttr.includes(`'${screenId}'`)) {
                item.classList.add('active');
            }
        });

        // Reset scroll unless home
        if (screenId !== 'home') {
            window.scrollTo(0, 0);

            // Pause all Reels videos when leaving the tab
            const videos = document.querySelectorAll('.reel-video');
            videos.forEach(v => {
                v.pause();
                v.currentTime = 0; // Optional: RESET to start
            });
        } else {
            // Optional: Resume the first video if needed, or let observer handle it
        }
    },

    playGreetingAnimation: () => {
        const title = document.querySelector('.greeting-title');
        const subtitle = document.querySelector('.greeting-subtitle');
        if (!title || !subtitle) return;

        // Clear previous timeouts
        if (app.typingTimeouts) app.typingTimeouts.forEach(clearTimeout);
        app.typingTimeouts = [];

        const name = app.userName;
        const line1 = `${name}님, 안녕하세요.`;
        const line2 = "오늘도 공부할 준비 되셨나요?";

        title.innerText = '';
        subtitle.innerText = '';
        title.classList.add('typing');
        subtitle.classList.remove('typing');

        let i = 0;
        const typeLine1 = () => {
            if (i < line1.length) {
                title.textContent += line1.charAt(i);
                i++;
                app.typingTimeouts.push(setTimeout(typeLine1, 70));
            } else {
                title.classList.remove('typing');
                // Restore span structure
                title.innerHTML = `<span id="display-name">${name}</span>님, 안녕하세요.`;

                // Start Line 2
                subtitle.classList.add('typing');
                let j = 0;
                const typeLine2 = () => {
                    if (j < line2.length) {
                        subtitle.textContent += line2.charAt(j);
                        j++;
                        app.typingTimeouts.push(setTimeout(typeLine2, 50));
                    } else {
                        subtitle.classList.remove('typing');
                    }
                };
                app.typingTimeouts.push(setTimeout(typeLine2, 200));
            }
        };

        app.typingTimeouts.push(setTimeout(typeLine1, 300));
    },

    /* --- Study Timer Logic --- */
    startStudyTimer: () => {
        if (app.state.studyTimerInterval) clearInterval(app.state.studyTimerInterval);

        app.state.studyTimerInterval = setInterval(() => {
            app.state.studySeconds++;

            const timerEl = document.getElementById('study-timer');
            if (timerEl) {
                const total = app.state.studySeconds;
                const min = Math.floor(total / 60);
                const sec = total % 60;

                timerEl.innerHTML = `${min}<span>분</span> ${sec}<span>초</span>`;
            }
        }, 1000);
    },

    /* --- Message Rotation Logic --- */
    startMessageRotation: () => {
        app.stopMessageRotation(); // Guarantee cleanup first
        app.log("startMessageRotation: Called");

        const messages = [
            "\"이 정도면 A+는 거뜬해요! 😎\"",
            "\"퀴즈 풀기로 학습 진도율을 올려보세요!\""
        ];
        let index = 0;

        // Start Interval
        app.state.messageRotationInterval = setInterval(() => {
            const msgEl = document.getElementById('progress-message');
            // Safety check: if element is gone (e.g. removed from DOM), stop.
            if (!msgEl) {
                app.log("Interval Tick: msgEl missing! Stopping.");
                app.stopMessageRotation();
                return;
            }

            app.log(`Interval Tick: Rotated to index ${(index + 1) % messages.length}`);

            // Force reflow to ensure restart of animation if needed
            void msgEl.offsetWidth;

            // 1. Slide Down (Disappear)
            msgEl.classList.add('hide-down');

            // 2. Change Text & Slide Up (Appear)
            setTimeout(() => {
                // Double check existence inside timeout
                if (!msgEl) return;

                index = (index + 1) % messages.length;
                msgEl.innerText = messages[index];
                msgEl.classList.remove('hide-down');
            }, 500); // 500ms matches CSS transition
        }, 5000);

        app.log(`Timer Started: ${app.state.messageRotationInterval}`);
    },

    stopMessageRotation: () => {
        if (app.state.messageRotationInterval) {
            app.log(`stopMessageRotation: Clearing timer ${app.state.messageRotationInterval}`);
            clearInterval(app.state.messageRotationInterval);
            app.state.messageRotationInterval = null;
        } else {
            // app.log("stopMessageRotation: No timer to clear");
        }
    },

    /* --- Reels Logic --- */
    renderReels: () => {
        const container = document.getElementById('reels-container');
        if (!container) return;
        container.innerHTML = '';

        // Momentum-Safe Infinite Scroll Strategy:
        // 1. Render enough sets (5) so user never hits edge during a single momentum scroll.
        // 2. Re-center to Middle Set (Set 2) ONLY when scrolling stops (via debounce).
        // This avoids killing momentum by modifying scrollTop during animation.

        const originalReels = [...app.state.reels];
        const loopCount = 5; // Sets 0, 1, 2, 3, 4

        for (let cycle = 0; cycle < loopCount; cycle++) {
            originalReels.forEach((dataReel) => {
                const tutor = app.state.tutors.find(t => t.id === dataReel.tutorId);
                const realId = dataReel.id;

                const el = document.createElement('div');
                el.className = 'reel-item';

                el.innerHTML = `
                    <!-- 1. The Video (Background) -->
                    <video class="reel-video" src="${dataReel.videoSrc || ''}" loop playsinline autoplay muted></video>
                    
                    <!-- 2. Overlay Gradient -->
                    <div class="reel-overlay-gradient"></div>

                    <!-- Interaction Layer -->
                     <div class="reel-interaction-layer" 
                          onclick="app.toggleGlobalMute(); event.stopPropagation();"
                          ondblclick="app.handleDoubleTap(event, ${realId})">
                        <div class="reel-info">
                            <div class="reel-tutor" onclick="app.openChat(${tutor.id}, '${dataReel.title.replace(/'/g, "\\'")}')">
                                <img src="${tutor.img}" class="tutor-face">
                                <span>${tutor.name}</span>
                                <button class="follow-pill">질문하기</button>
                            </div>
                            <p class="reel-desc">${dataReel.desc}</p>
                            <div class="reel-music"><i class="fas fa-music"></i> ${dataReel.title}</div>
                        </div>
                        <div class="reel-actions">
                            <div class="reel-btn like-btn" 
                                 data-reel-id="${realId}"
                                 onclick="app.toggleLike(${realId}, this); event.stopPropagation();" 
                                 ondblclick="event.stopPropagation();">
                                <i class="far fa-heart icon-like"></i>
                                <span class="count">${dataReel.likes}</span>
                            </div>
                            <div class="reel-btn ${app.state.savedReels.has(dataReel.id) ? 'active' : ''}" 
                                 data-reel-id="${dataReel.id}"
                                 onclick="app.toggleSave(${realId}, this); event.stopPropagation();" ondblclick="event.stopPropagation();">
                                <i class="${app.state.savedReels.has(dataReel.id) ? 'fas' : 'far'} fa-bookmark icon-save"></i>
                            </div>
                        </div>
                    </div>
                `;
                container.appendChild(el);
                if (app.observer) app.observer.observe(el);
            });
        }

        // Defers to setupInfiniteScroll
        setTimeout(() => app.setupInfiniteScroll(), 50);
        window.addEventListener('resize', () => app.setupInfiniteScroll());
    },

    setupInfiniteScroll: () => {
        const container = document.getElementById('reels-container');
        if (!container || container.offsetParent === null) return;
        if (container.clientHeight === 0) return;

        const reelCount = app.state.reels.length;
        if (reelCount === 0) return;

        const currentLoopCount = 5; // Hardcoded matches render loop

        // Critical Fix: Use clientHeight instead of scrollHeight ratio for robustness
        const setHeight = container.clientHeight * reelCount;

        // Initial Jump if near top
        if (container.scrollTop < 100) {
            // Temporarily disable snap AND smooth scroll to force instant jump
            container.style.scrollSnapType = 'none';
            container.style.scrollBehavior = 'auto';
            container.scrollTop = setHeight * 2; // Jump to Set 2 (Middle)

            // Restore Snap & Scroll Behavior immediately
            requestAnimationFrame(() => {
                container.style.scrollSnapType = '';
                container.style.scrollBehavior = '';
                // No opacity transition needed - should be instant
            });
        } else {
            // In case we resize or recall, ensure visible
            container.style.opacity = '1';
        }

        // Debounce Logic for Momentum Safety
        let scrollTimeout;
        container.onscroll = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                // User stopped scrolling. Now we check position.
                const scrollTop = container.scrollTop;
                const currentSetIndex = Math.floor(scrollTop / setHeight);

                // Target Center Set Index (Middle)
                const centerIndex = Math.floor(currentLoopCount / 2);

                // If we drifted out of the center set, bring us back to the center set
                // This ensures we always have buffer above and below.
                if (currentSetIndex !== centerIndex) {
                    const offsetInSet = scrollTop % setHeight;
                    const targetScrollTop = (setHeight * centerIndex) + offsetInSet;

                    // CRITICAL: Disable Snap Temporarily to prevent "Fighting" or Backwards-Animation
                    container.style.scrollSnapType = 'none';
                    container.style.scrollBehavior = 'auto'; // Force instant

                    container.scrollTop = targetScrollTop;

                    // Restore Snap
                    requestAnimationFrame(() => {
                        container.style.scrollSnapType = '';
                        container.style.scrollBehavior = '';
                    });
                }
            }, 150); // 150ms debounce
        };
    },

    handleDoubleTap: (e, id) => {
        app.showHeartAnimation(e.clientX, e.clientY);

        // Find the like button programmatically
        const reelItem = e.target.closest('.reel-item');
        if (reelItem) {
            const likeBtn = reelItem.querySelector('.like-btn'); // Use specific class
            if (likeBtn) {
                // Always trigger like if not liked, or just animate
                if (!likeBtn.classList.contains('active')) {
                    app.toggleLike(id, likeBtn);
                } else {
                    const icon = likeBtn.querySelector('i');
                    icon.style.transform = 'scale(1.3)';
                    setTimeout(() => icon.style.transform = 'scale(1)', 200);
                }
            }
        }
    },

    showHeartAnimation: (x, y) => {
        const heart = document.createElement('i');
        heart.className = 'fas fa-heart big-heart-pop';
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        document.body.appendChild(heart);
        setTimeout(() => { heart.remove(); }, 1000);
    },

    parseLikeCount: (str) => {
        if (typeof str === 'number') return str;
        str = str.toLowerCase();
        if (str.includes('k')) {
            return parseFloat(str.replace('k', '')) * 1000;
        }
        if (str.includes('m')) {
            return parseFloat(str.replace('m', '')) * 1000000;
        }
        return parseInt(str.replace(/,/g, '')) || 0;
    },

    formatLikeCount: (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num.toLocaleString();
    },

    toggleLike: (id, clickedBtn) => {
        // Find all buttons for this ID to sync them
        const allBtns = document.querySelectorAll(`.like-btn[data-reel-id="${id}"]`);

        // Determine action based on the clicked button's state
        const isLiking = !clickedBtn.classList.contains('active');

        // Calculate New Count properly once
        const countSpan = clickedBtn.querySelector('.count');
        let currentRaw = app.parseLikeCount(countSpan.innerText);
        let newCount = isLiking ? currentRaw + 1 : currentRaw - 1;
        const newText = app.formatLikeCount(newCount);

        allBtns.forEach(btn => {
            const icon = btn.querySelector('i');
            const btnCountSpan = btn.querySelector('.count');

            if (isLiking) {
                btn.classList.add('active');
                icon.classList.remove('far');
                icon.classList.add('fas');

                // App-like bounce
                icon.style.transform = 'scale(1.2)';
                setTimeout(() => icon.style.transform = 'scale(1)', 200);
            } else {
                btn.classList.remove('active');
                icon.classList.remove('fas');
                icon.classList.add('far');
            }

            // Sync text
            btnCountSpan.innerText = newText;
        });
    },

    toggleSave: (id, btn) => {
        const icon = btn.querySelector('i');
        const reelId = parseInt(id); // Ensure number

        if (app.state.savedReels.has(reelId)) {
            // Unsave
            app.state.savedReels.delete(reelId);
            btn.classList.remove('active');
            icon.classList.remove('fas');
            icon.classList.add('far');
            app.showToast('보관함에서 삭제됨');

            // If we are in saved screen, re-render to remove it immediately? 
            // Better to stay and let user see it's unchecked, or remove?
            // User usually expects it to stay until refresh or navigate away, but dynamic removal is also fine.
            // For now, if active screen is 'saved', re-render.
            if (document.getElementById('saved-screen').classList.contains('active')) {
                app.renderSavedReels();
            }

        } else {
            // Save
            app.state.savedReels.add(reelId);
            btn.classList.add('active');
            icon.classList.remove('far');
            icon.classList.add('fas');
            app.showToast('보관함에 저장됨');
        }
    },

    openSavedReels: () => {
        app.navigate('saved');
        app.renderSavedReels();
    },

    openStats: () => {
        app.navigate('stats');

        // Reset animations (set to 0)
        const progressBars = document.querySelectorAll('.progress-bar-fill');
        const graphBars = document.querySelectorAll('.graph-bar');
        const percentEl = document.querySelector('.percent');

        progressBars.forEach(b => b.style.width = '0%');
        graphBars.forEach(b => b.style.height = '0%');

        // Reset Number
        if (percentEl) {
            // Save target if not already saved
            if (!percentEl.dataset.target) {
                const numeric = parseInt(percentEl.innerText.replace(/\D/g, '')) || 0;
                percentEl.dataset.target = numeric;
            }
            percentEl.innerText = "0%";
        }

        // Trigger animations (set to target) after slight delay for screen transition
        setTimeout(() => {
            progressBars.forEach(b => {
                if (b.dataset.width) b.style.width = b.dataset.width;
            });
            graphBars.forEach((b, idx) => {
                // Stagger graph bars slightly for fun
                setTimeout(() => {
                    if (b.dataset.height) b.style.height = b.dataset.height;
                }, idx * 50);
            });

            // Animate Number
            if (percentEl && percentEl.dataset.target) {
                app.animateValue(percentEl, 0, parseInt(percentEl.dataset.target), 1000);
            }
        }, 300); // 300ms matches start of card fade-up
    },

    animateValue: (obj, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Ease-out effect: 1 - Math.pow(1 - progress, 3)
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            obj.innerText = Math.floor(easeProgress * (end - start) + start) + "%";
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    },

    openNotifications: () => {
        app.navigate('notification');
    },

    openQuiz: () => {
        app.navigate('quiz');
        app.renderQuizIntro();
    },

    renderSavedReels: () => {
        const container = document.getElementById('saved-feed');
        if (!container) return;
        container.innerHTML = '';

        if (app.state.savedReels.size === 0) {
            container.innerHTML = `
                <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:#868e96;">
                    <i class="far fa-bookmark" style="font-size:3rem; margin-bottom:15px; opacity:0.5;"></i>
                    <p>아직 저장된 학습자료가 없습니다.</p>
                </div>
            `;
            return;
        }

        // Render saved items
        app.state.savedReels.forEach(id => {
            const reel = app.state.reels.find(r => r.id === id);
            if (!reel) return;
            const tutor = app.state.tutors.find(t => t.id === reel.tutorId);

            const el = document.createElement('div');
            el.className = 'reel-item';
            // Specific style for saved list? Or reuse full reel?
            // "Saved Reels" usually implies seeing the content again. 
            // We can reuse the same structure, but usually saved lists are grids. 
            // However, the user asked for "When clicked... saved reels appear". 
            // Reusing the full vertical scroll view is easiest and consistent.

            el.innerHTML = `
                <!-- Video (Match Main Feed Style) -->
                <video class="reel-video" src="${reel.videoSrc || ''}" loop playsinline muted autoplay style="object-fit:cover;"></video>
                
                 <div class="reel-overlay-gradient"></div>

                 <div class="reel-interaction-layer">
                    <div class="reel-info">
                        <div class="reel-tutor">
                            <img src="${tutor.img}" class="tutor-face">
                            <span>${tutor.name}</span>
                        </div>
                        <p class="reel-desc">${reel.desc}</p>
                        <div class="reel-music"><i class="fas fa-music"></i> ${reel.title}</div>
                    </div>

                    <div class="reel-actions">
                         <div class="reel-btn active" 
                              data-reel-id="${reel.id}"
                              onclick="app.toggleSave(${reel.id}, this); event.stopPropagation();">
                            <i class="fas fa-bookmark icon-save"></i>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(el);
        });
    },

    renderQuizIntro: () => {
        const content = document.getElementById('quiz-content');
        content.innerHTML = `
            <div class="quiz-card" style="text-align:center; padding:40px 20px;">
                <i class="fas fa-book-open" style="font-size:4rem; color:#339af0; margin-bottom:20px;"></i>
                <h2 style="font-size:1.5rem; margin-bottom:10px;">오늘의 학습 퀴즈</h2>
                <p style="color:#868e96; margin-bottom:30px;">3초 안에 정답을 맞춰보세요!<br>총 ${quizQuestions.length}문제가 준비되어 있습니다.</p>
                <button class="btn-primary" onclick="app.startQuiz()" style="width:100%; padding:15px; font-size:1.1rem; border-radius:12px; font-weight:bold;">
                    퀴즈 시작하기
                </button>
            </div>
        `;
    },

    startQuiz: () => {
        app.state.quizScore = 0;
        app.state.currentQuestion = 0;
        app.renderQuestion();
    },

    renderQuestion: () => {
        const qData = quizQuestions[app.state.currentQuestion];
        const total = quizQuestions.length;
        const current = app.state.currentQuestion + 1;
        const content = document.getElementById('quiz-content');

        content.innerHTML = `
            <div class="quiz-card fade-up">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <span style="font-weight:bold; color:#0095f6;">Q${current}</span>
                    <span style="color:#868e96; font-size:0.9rem;">${current}/${total}</span>
                </div>

                <!-- Timer Bar -->
                <div class="timer-container">
                    <div id="quiz-timer-bar" class="timer-bar"></div>
                </div>
                <div id="quiz-timer-text" style="text-align:center; color:#e03131; font-weight:bold; margin-bottom:15px;">3초 남았어요!</div>

                <div class="quiz-question">${qData.q}</div>
                
                <div class="quiz-options">
                    ${qData.options.map((opt, idx) => `
                        <button class="quiz-btn" onclick="app.checkAnswer(${idx}, this)">${opt}</button>
                    `).join('')}
                </div>

                <button id="quiz-next-btn" class="btn-white" 
                        style="visibility:hidden; background:#0095f6; color:white; width:100%; padding:15px; margin-top:20px; font-weight:bold; border-radius:12px;" 
                        onclick="app.nextQuestion()">
                    다음 문제 <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        `;

        // Start Timer
        app.startQuizTimer();
    },

    startQuizTimer: () => {
        if (app.state.timerInterval) clearInterval(app.state.timerInterval);

        let timeLeft = 3;
        const timerBar = document.getElementById('quiz-timer-bar');
        const timerText = document.getElementById('quiz-timer-text');

        // Reset visuals
        if (timerBar) {
            timerBar.style.width = '100%';
            timerBar.style.transition = 'width 3s linear';
            // Force reflow
            void timerBar.offsetWidth;
            timerBar.style.width = '0%';
        }

        app.state.timerInterval = setInterval(() => {
            timeLeft--;
            if (timerText) timerText.textContent = `${timeLeft}초 남았어요!`;

            if (timeLeft <= 0) {
                clearInterval(app.state.timerInterval);
                if (timerText) timerText.textContent = "시간 종료!";
                app.handleTimeout();
            }
        }, 1000);
    },

    handleTimeout: () => {
        // Hide Timer UI (Stable)
        const timerContainer = document.querySelector('.timer-container');
        const timerText = document.getElementById('quiz-timer-text');
        if (timerContainer) timerContainer.style.visibility = 'hidden';
        if (timerText) timerText.style.visibility = 'hidden';

        // Disable options
        const buttons = document.querySelectorAll('.quiz-btn');
        buttons.forEach(b => b.onclick = null);

        // Reuse Next Button for "View Answer"
        const nextBtn = document.getElementById('quiz-next-btn');
        if (nextBtn) {
            nextBtn.style.visibility = 'visible';
            nextBtn.style.background = '#495057'; // Grey for secondary action
            nextBtn.innerHTML = '정답 보기';
            nextBtn.onclick = app.revealAnswer;
        }
    },

    revealAnswer: () => {
        const qData = quizQuestions[app.state.currentQuestion];
        const buttons = document.querySelectorAll('.quiz-btn');

        // Highlight correct answer
        buttons[qData.answer].classList.add('correct');

        // Change Button to "Next"
        const nextBtn = document.getElementById('quiz-next-btn');
        if (nextBtn) {
            nextBtn.style.visibility = 'visible';
            nextBtn.style.background = '#0095f6'; // Blue for primary action
            nextBtn.innerHTML = '다음 문제 <i class="fas fa-arrow-right"></i>';
            nextBtn.onclick = app.nextQuestion;
        }
    },

    checkAnswer: (selectedIdx, btn) => {
        // Stop timer
        if (app.state.timerInterval) clearInterval(app.state.timerInterval);

        // Hide Timer UI
        const timerContainer = document.querySelector('.timer-container');
        const timerText = document.getElementById('quiz-timer-text');
        if (timerContainer) timerContainer.style.visibility = 'hidden';
        if (timerText) timerText.style.visibility = 'hidden';

        const qData = quizQuestions[app.state.currentQuestion];
        const buttons = document.querySelectorAll('.quiz-btn');

        // Disable all buttons
        buttons.forEach(b => b.onclick = null);

        if (selectedIdx === qData.answer) {
            btn.classList.add('correct');
            app.state.quizScore++;
        } else {
            btn.classList.add('wrong');
            buttons[qData.answer].classList.add('correct'); // Show correct answer
        }

        // Show Next Button
        const nextBtn = document.getElementById('quiz-next-btn');
        if (nextBtn) {
            nextBtn.style.visibility = 'visible';
            nextBtn.style.background = '#0095f6'; // Ensure Blue
            nextBtn.innerHTML = '다음 문제 <i class="fas fa-arrow-right"></i>';
            nextBtn.onclick = app.nextQuestion;
        }
    },

    nextQuestion: () => {
        // Stop timer just in case
        if (app.state.timerInterval) clearInterval(app.state.timerInterval);

        app.state.currentQuestion++;
        if (app.state.currentQuestion < quizQuestions.length) {
            app.renderQuestion();
        } else {
            app.showQuizResult();
        }
    },

    showQuizResult: () => {
        const content = document.getElementById('quiz-content');
        const score = app.state.quizScore;
        const total = quizQuestions.length;

        let msg = "아쉬워요! 다시 도전해보세요.";
        if (score === total) msg = "완벽해요! 모든 내용을 이해하셨군요! 🎉";
        else if (score >= total / 2) msg = "잘했어요! 조금만 더 공부하면 완벽해요.";

        content.innerHTML = `
            <div class="quiz-card" style="text-align:center;">
                <i class="fas fa-trophy" style="font-size:3rem; color:#ffd43b; margin-bottom:20px;"></i>
                <h2>퀴즈 완료!</h2>
                <div class="quiz-score">${score} / ${total}</div>
                <p style="color:#868e96; margin: 10px 0 30px;">${msg}</p>
                <button class="btn-white" style="background:#20c997; color:white; width:100%; padding:15px;" onclick="app.navigate('home')">
                    더 공부하러 가기 (릴스)
                </button>
                <button onclick="app.startQuiz()" style="margin-top:20px; color:#868e96; font-size:0.9rem; background:none; border:none; cursor:pointer;">다시 풀기</button>
            </div>
        `;
    },

    /* --- File Upload Logic --- */
    /* --- Document Management --- */
    renderDocuments: () => {
        const grid = document.querySelector('.doc-grid');
        if (!grid) return;

        // Clear existing (except the hidden input if it was outside, but here we rebuild all)
        grid.innerHTML = `
            <!-- NEW Card -->
            <div class="doc-card new-card" onclick="document.getElementById('fileInput').click()">
                <input type="file" id="fileInput" hidden onchange="app.handleFile(this.files)">
                <div class="plus-icon"><i class="fas fa-plus"></i></div>
                <span>신규</span>
            </div>
        `;

        // Render from state
        app.state.documents.forEach(doc => {
            let iconClass = "fas fa-file-pdf";
            if (doc.ext === "YOUTUBE") iconClass = "fab fa-youtube";

            const el = document.createElement('div');
            el.className = 'doc-card';
            el.innerHTML = `
                <div class="doc-thumb text-thumb" style="position:relative; display:flex; align-items:center; justify-content:center; background:#f8f9fa;">
                    <i class="${iconClass}" style="font-size:3rem; color:#fa5252;"></i>
                </div>
                <div class="doc-info">
                    <h4>${doc.title}</h4>
                    <div class="doc-meta">
                        <span class="file-type">${doc.ext}</span> <span>• ${doc.date}</span>
                        <i class="fas fa-trash-alt" style="margin-left:auto; color:#fa5252; cursor:pointer;" onclick="app.confirmDelete(${doc.id}); event.stopPropagation();"></i>
                    </div>
                </div>
            `;
            el.onclick = (e) => {
                // Ignore if clicked on trash
                if (e.target.closest('.fa-trash-alt')) return;
                app.showToast('문서 열기: ' + doc.title);
            };
            grid.appendChild(el);
        });
    },

    /* --- Modal Logic --- */
    confirmDelete: (id) => {
        app.state.pendingDeleteId = id;
        const modal = document.getElementById('delete-modal');
        if (modal) {
            modal.style.display = 'flex';
            // Trigger animation if using classes like fade-up
            const content = modal.querySelector('.modal-content');
            if (content) {
                content.classList.remove('fade-up');
                void content.offsetWidth; // Trigger reflow
                content.classList.add('fade-up');
            }
        }
    },

    closeModal: () => {
        app.state.pendingDeleteId = null;
        const modal = document.getElementById('delete-modal');
        if (modal) modal.style.display = 'none';
    },

    executeDelete: () => {
        const id = app.state.pendingDeleteId;
        if (!id) return;

        app.state.documents = app.state.documents.filter(d => d.id !== id);
        app.renderDocuments();
        app.showToast('문서가 삭제되었습니다.');
        app.closeModal();
    },

    deleteDocument: (id) => {
        // Deprecated: redirected to confirmDelete
        app.confirmDelete(id);
    },

    handleFile: (files) => {
        if (!files || files.length === 0) return;

        const file = files[0];
        // Instant Add
        const newDoc = {
            id: Date.now(),
            title: file.name,
            ext: file.name.split('.').pop().toUpperCase() || 'FILE',
            date: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD in local time
            category: 'User Upload'
        };
        app.state.documents.unshift(newDoc); // Add to top

        app.renderDocuments();
        app.showToast(`'${file.name}' 문서함에 추가됨!`);
    },

    /* --- Chat Logic --- */
    handleHomeSearch: () => {
        const input = document.getElementById('home-search-input');
        if (!input) return;

        const text = input.value.trim();
        if (!text) return; // Do nothing if empty

        // Open chat with the text as a direct query
        app.openChat(null, text, true);
        input.value = ''; // Clear input
    },

    openChat: (tutorId, topic = null, isDirectQuery = false) => {
        const tutor = tutors.find(t => t.id === tutorId);

        // Switch Screen
        app.navigate('chat');

        // Clear previous messages to start fresh (User request: "Start with ME")
        const container = document.getElementById('chat-messages');
        if (container) container.innerHTML = `
            <div style="text-align: center; margin: 10px 0;">
                <span style="background: rgba(0,0,0,0.1); color: #868e96; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem;">
                    ${new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                </span>
            </div>
        `;

        // If topic exists
        if (topic) {
            setTimeout(() => {
                // If it's a direct query (from search bar), use as is. 
                // If it's a Topic (from Reel title), append "tell me more" format.
                const userText = isDirectQuery ? topic : `${topic}에 대해서 자세히 알려줘!`;

                app.renderUserMessage(userText);
                setTimeout(() => app.replyAI(), 600);
            }, 300);
        } else {
            // Default greeting logic if entered without topic (fallback)
            // app.replyAI("안녕하세요! 무엇을 도와드릴까요?"); // Optional
        }
    },

    closeChat: () => {
        const target = app.state.lastScreen || 'home';
        app.navigate(target);
    },

    sendMessage: () => {
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (!text) return;

        app.renderUserMessage(text);
        input.value = '';

        setTimeout(() => app.replyAI(), 600);
    },

    renderUserMessage: (text) => {
        const container = document.getElementById('chat-messages');
        const time = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

        const userMsg = document.createElement('div');
        userMsg.className = 'chat-message sent';
        userMsg.style.cssText = 'align-self: flex-end; max-width: 70%; display: flex; flex-direction: column; align-items: flex-end;';
        userMsg.innerHTML = `
            <div style="background: #f1f3f5; padding: 10px 14px; border-radius: 12px; border-top-right-radius: 2px; font-size: 0.95rem; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">
                ${text}
            </div>
            <span style="font-size: 0.7rem; color: #555; margin-right: 4px; margin-top: 4px;">${time}</span>
        `;
        container.appendChild(userMsg);
        container.scrollTop = container.scrollHeight;
    },

    replyAI: () => {
        const container = document.getElementById('chat-messages');
        const time = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

        const aiMsg = document.createElement('div');
        aiMsg.className = 'chat-message received';
        aiMsg.style.cssText = 'align-self: flex-start; max-width: 90%; margin-top: 10px; padding: 0 10px;';

        // Container for text
        const textDiv = document.createElement('div');
        textDiv.style.cssText = 'background: transparent; padding: 0; font-size: 1rem; line-height: 1.6; color: #111;';

        // Time span
        const timeSpan = document.createElement('span');
        timeSpan.style.cssText = 'font-size: 0.7rem; color: #999; margin-top: 6px; display: block;';
        timeSpan.innerText = time;

        aiMsg.appendChild(textDiv);
        aiMsg.appendChild(timeSpan);
        container.appendChild(aiMsg);
        container.scrollTop = container.scrollHeight;

        const targetText = "좋은 질문입니다! 잠시만 기다려주시면 상세히 답변해드릴게요. 🤖";
        let i = 0;

        const typeInterval = setInterval(() => {
            textDiv.textContent += targetText.charAt(i);
            i++;
            container.scrollTop = container.scrollHeight; // Auto scroll
            if (i >= targetText.length) {
                clearInterval(typeInterval);
            }
        }, 50);
    },

    /* --- Profile Logic --- */
    userName: "스제융",

    openProfileModal: function () {
        const modal = document.getElementById('profile-modal');
        if (modal) {
            modal.style.display = 'flex';
            const input = document.getElementById('username-input');
            if (input) {
                input.value = this.userName;
                input.focus();
            }
        }
    },

    closeProfileModal: function () {
        const modal = document.getElementById('profile-modal');
        if (modal) modal.style.display = 'none';
    },

    saveProfileName: function () {
        const input = document.getElementById('username-input');
        if (input && input.value.trim() !== "") {
            this.userName = input.value.trim();

            // Update display
            const displayEl = document.getElementById('display-name');
            if (displayEl) displayEl.innerText = this.userName;

            this.showToast(`이름이 '${this.userName}'(으)로 변경되었습니다.`);
            this.closeProfileModal();
        } else {
            this.showToast("이름을 입력해주세요.");
        }
    },

    showToast: (msg) => {
        const toast = document.createElement('div');
        toast.style.cssText = `
position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
background: rgba(0, 0, 0, 0.8); color: white; padding: 12px 24px;
border-radius: 50px; font-size: 0.9rem; z-index: 2000;
animation: fadeIn 0.3s;
`;
        toast.innerText = msg;
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 2000);
    },

    checkReelsMode: (screenId) => {
        // Defined explicitly to prevent errors if missing
        // This was likely the missing function
        // Or it does nothing?
    }
};

document.addEventListener('DOMContentLoaded', app.init);
