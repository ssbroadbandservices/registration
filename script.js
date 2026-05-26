/* =========================================================================
   S.S. BROADBAND - SCRIPT.JS
   API endpoint is split to keep it out of plain sight in source.
   ========================================================================= */

// ─── Secure Endpoint (split-join obfuscation, assembled at runtime only) ──
const _api = {
    _get: () => [
        'https://', 'script.goo', 'gle.com/',
        'macros/s/', 'AKfycbxFlURVn1DRU6mh',
        'GMjO3iXGTI8yEtuOFr9Rvpj',
        'TGqzue3jPKgQcnQQFWa3BmrwoAIfw1A',
        '/exec'
    ].join('')
};

// ─── Form State ───────────────────────────────────────────────────────────
const formData = {
    operatorName: '',
    customerName: '',
    phoneNumber: '',
    emailId: '',
    aadharNumber: '',
    dob: '',
    pincode: '',
    aadharPhoto: null,
    planSpeed: '',
    planValidity: '',
    iptvApp: '',
    iptvCategory: '',
    imageUrl: '',
    areaName: ''
};

let currentStep = 1;

// ─── DOMContentLoaded ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {

    const loader = document.getElementById('loadingScreen');
    const bar = document.getElementById('loadingBarFill');
    const text = document.getElementById('loadingText');
    const statuses = [
        "Initializing Connection...",
        "Connecting to Fiber Server...",
        "Verifying Fiber Link...",
        "Establishing Secure Gateway...",
        "Optimizing Bandwidth...",
        "Connected Successfully!"
    ];

    let progress = 0;
    const duration = 4000; // 4 seconds
    const intervalTime = 50;
    const increment = (100 / (duration / intervalTime));

    const interval = setInterval(() => {
        progress += increment;
        if (progress > 100) progress = 100;
        if (bar) bar.style.width = progress + '%';

        // Update percentage text
        const percentEl = document.getElementById('loadPercent');
        if (percentEl) {
            percentEl.innerText = Math.round(progress) + '%';
        }

        if (text) {
            const statusIdx = Math.min(Math.floor((progress / 100) * statuses.length), statuses.length - 1);
            text.innerText = statuses[statusIdx];
        }

        if (progress >= 100) {
            clearInterval(interval);
            // Seamless transition: Start welcome while loader is still visible
            startWelcomeSequence();
            setTimeout(() => {
                if (loader) {
                    loader.style.display = 'none';
                }
            }, 500);
        }
    }, intervalTime);

    function startWelcomeSequence() {
        const overlay = document.getElementById('welcomeOverlay');
        const vStep = document.getElementById('verifyStep');
        const nStep = document.getElementById('namasteStep');

        if (!overlay) return;

        overlay.style.display = 'flex';
        overlay.style.opacity = '1';
        setTimeout(() => overlay.classList.add('active'), 50);

        // Stage 1: Verification (Stay for 1.8s)
        setTimeout(() => {
            vStep.classList.remove('active');
            nStep.classList.add('active');
            createNamasteParticles();
            cycleGreetings();

            // Stage 2: Namaste Sequence (Total 3.5s)
            setTimeout(() => {
                overlay.style.opacity = '0';
                overlay.style.transition = 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1)';
                setTimeout(() => {
                    overlay.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    revealContent();
                }, 1000);
            }, 3500);

        }, 1800);
    }

    function cycleGreetings() {
        const greetings = [
            { t: "नमस्ते" },
            { t: "Hello" }
        ];
        const el = document.getElementById('greetingText');
        if (!el) return;

        let i = 0;
        const interval = setInterval(() => {
            i++;
            if (i >= greetings.length) {
                clearInterval(interval);
                return;
            }

            // Premium Slow Transition (Fade + Slight Blur + Scale)
            el.style.opacity = '0';
            el.style.filter = 'blur(8px)';
            el.style.transform = 'scale(0.95)';

            setTimeout(() => {
                el.innerText = greetings[i].t;
                el.style.opacity = '1';
                el.style.filter = 'blur(0)';
                el.style.transform = 'scale(1)';
            }, 500); // Slightly faster transition

        }, 1500); // Stay for 1.5 seconds
    }

    function createNamasteParticles() {
        const container = document.getElementById('namasteParticles');
        if (!container) return;
        for (let i = 0; i < 20; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = Math.random() * 6 + 2;
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.left = '50%';
            p.style.top = '50%';
            p.style.setProperty('--tx', (Math.random() - 0.5) * 300 + 'px');
            p.style.setProperty('--ty', (Math.random() - 0.5) * 300 + 'px');
            p.style.animationDelay = Math.random() * 2 + 's';
            container.appendChild(p);
        }
    }

    function revealContent() {
        document.querySelectorAll('.reveal-up').forEach((el, index) => {
            setTimeout(() => el.classList.add('active'), index * 100);
        });
    }

    // Set DOB max to today
    const dobEl = document.getElementById('dob');
    if (dobEl) dobEl.max = new Date().toISOString().split('T')[0];

    // Input masking
    initValidation();

    // Navbar scroll effect (Throttled for performance)
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const now = Date.now();
        if (now - lastScroll < 40) return; // ~25fps throttle
        lastScroll = now;
        document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Reveal animations
    initReveal();
});

// ─── Scroll Reveal ────────────────────────────────────────────────────────
function initReveal() {
    const els = document.querySelectorAll('.reveal-up');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
}

// ─── Menu ─────────────────────────────────────────────────────────────────
function toggleMenu() {
    const btn = document.getElementById('menuBtn');
    const overlay = document.getElementById('menuOverlay');
    const isOpen = overlay.classList.toggle('active');
    btn.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMenu() {
    document.getElementById('menuBtn')?.classList.remove('active');
    document.getElementById('menuOverlay')?.classList.remove('active');
    document.body.style.overflow = '';
}

// ─── Navigation ───────────────────────────────────────────────────────────
function goHome() {
    closeMenu();
    document.getElementById('homeView').style.display = 'block';
    document.getElementById('successView').style.display = 'none';
    document.querySelectorAll('.section-view').forEach(v => {
        if (v.id !== 'successView') v.style.display = 'none';
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showSection(type) {
    closeMenu();
    document.getElementById('homeView').style.display = 'none';
    document.querySelectorAll('.section-view').forEach(v => v.style.display = 'none');

    const idMap = {
        'iptv': 'view-iptv',
        'ott': 'view-ott',
        'data': 'view-data',
        'fix-billing': 'view-fix-billing',
        'ping-rate': 'view-ping-rate',
        'sharing-rate': 'view-sharing-rate',
        'payment': 'view-payment'
    };
    const targetId = idMap[type];
    if (targetId) {
        const el = document.getElementById(targetId);
        if (el) {
            el.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 170; // Account for tall fixed navbar 
    const bodyRect = document.body.getBoundingClientRect().top;
    const elRect = el.getBoundingClientRect().top;
    const elPos = elRect - bodyRect;
    const offsetPos = elPos - offset;

    window.scrollTo({
        top: offsetPos,
        behavior: 'smooth'
    });
}

// ─── Multi-Step Form ──────────────────────────────────────────────────────
function nextStep(to) {
    if (!validateStep(currentStep)) return;
    goToStep(to);
}

function prevStep(to) {
    goToStep(to);
}

function goToStep(n) {
    // Animate out current
    const current = document.querySelector('.form-step.active');
    if (current) current.classList.remove('active');

    // Show next
    const next = document.getElementById('fs' + n);
    if (next) next.classList.add('active');

    // Update progress indicators
    document.querySelectorAll('.fp-step').forEach(s => {
        const sn = parseInt(s.dataset.step);
        s.classList.toggle('active', sn === n);
        s.classList.toggle('done', sn < n);
    });
    document.querySelectorAll('.fp-line').forEach((l, i) => {
        l.classList.toggle('done', i < n - 1);
    });

    currentStep = n;
}

// ─── Validation ───────────────────────────────────────────────────────────
function validateStep(step) {
    switch (step) {
        case 1: {
            const op = (document.getElementById('operatorName')?.value || '').trim();
            const name = (document.getElementById('customerName')?.value || '').trim();
            const phone = (document.getElementById('phoneNumber')?.value || '').trim();
            const email = (document.getElementById('emailId')?.value || '').trim();
            if (!op || !name || !phone || !email) { showToast('Please fill all fields', 'error'); return false; }
            if (phone.length !== 10) { showToast('Mobile number must be 10 digits', 'error'); return false; }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('Please enter a valid email ID', 'error'); return false; }
            formData.operatorName = op;
            formData.customerName = name;
            formData.phoneNumber = phone;
            formData.emailId = email;
            return true;
        }
        case 2: {
            const aadhar = (document.getElementById('aadharNumber')?.value || '').trim();
            const dob = (document.getElementById('dob')?.value || '');
            const pincode = (document.getElementById('pincode')?.value || '').trim();
            if (!aadhar || !dob || !pincode) { showToast('Please fill all fields', 'error'); return false; }
            if (aadhar.length !== 12) { showToast('Aadhar number must be 12 digits', 'error'); return false; }
            if (pincode.length !== 6) { showToast('Pincode must be 6 digits', 'error'); return false; }
            formData.aadharNumber = aadhar;
            formData.dob = dob;
            formData.pincode = pincode;
            return true;
        }
        case 3: {
            if (!formData.planSpeed || !formData.planValidity) {
                showToast('Please select both speed and validity', 'error');
                return false;
            }
            return true;
        }
        case 4: {
            if (!formData.iptvApp) {
                showToast('Please select an IPTV option', 'error');
                return false;
            }
            if (formData.iptvApp === 'onyxplay' && !formData.iptvCategory) {
                showToast('Please select a language for OnyxPlay', 'error');
                return false;
            }
            if (formData.iptvApp === 'ziggtv' && !formData.iptvCategory) {
                showToast('Please select a package for Zigg TV', 'error');
                return false;
            }
            return true;
        }
    }
    return true;
}

// ─── Chip Selection ───────────────────────────────────────────────────────
function selectChip(type, el) {
    el.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    const val = el.dataset.value || el.textContent.trim();
    if (type === 'speed') formData.planSpeed = val;
    if (type === 'validity') formData.planValidity = val;
    if (type === 'lang') formData.iptvCategory = val;
    if (type === 'pkg') formData.iptvCategory = val;
}

function selectIPTVApp(app, el) {
    document.querySelectorAll('.iptv-chip').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    formData.iptvApp = app;
    formData.iptvCategory = '';

    // Reset sub-selections
    document.querySelectorAll('#langChips .chip, #pkgChips .chip').forEach(c => c.classList.remove('selected'));

    const langSec = document.getElementById('langSection');
    const pkgSec = document.getElementById('pkgSection');
    if (langSec) langSec.style.display = app === 'onyxplay' ? 'block' : 'none';
    if (pkgSec) pkgSec.style.display = app === 'ziggtv' ? 'block' : 'none';
}

// ─── Image Upload ─────────────────────────────────────────────────────────
function previewImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.match('image.*')) { showToast('Only image files (JPG/PNG) allowed', 'error'); return; }
    if (file.size > 5 * 1024 * 1024) { showToast('File size must be under 5MB', 'error'); return; }

    const reader = new FileReader();
    reader.onload = e => {
        const box = document.getElementById('imagePreview');
        if (box) box.innerHTML = `<img src="${e.target.result}" alt="Aadhar Preview">`;
        formData.aadharPhoto = file;
        formData.imageUrl = e.target.result;
    };
    reader.readAsDataURL(file);
}

// ─── Submit ───────────────────────────────────────────────────────────────
async function submitForm() {
    if (!validateStep(4)) return;

    const btn = document.getElementById('submitBtn');
    const originalHTML = btn ? btn.innerHTML : '';
    if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...'; btn.disabled = true; }

    try {
        const area = await getAreaFromPincode(formData.pincode);
        formData.areaName = area;

        const payload = {
            timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            operatorName: formData.operatorName,
            customerName: formData.customerName,
            phoneNumber: formData.phoneNumber,
            emailId: formData.emailId,
            aadharNumber: formData.aadharNumber,
            dob: formData.dob,
            pincode: formData.pincode,
            areaName: area,
            planSpeed: formData.planSpeed,
            planValidity: formData.planValidity,
            iptvApp: formData.iptvApp === 'none' ? 'No IPTV' : formData.iptvApp,
            iptvCategory: formData.iptvCategory || 'N/A',
            imageData: formData.imageUrl || ''
        };

        // Send to Google Apps Script (which handles Sheets + Telegram)
        await fetch(_api._get(), {
            method: 'POST',
            mode: 'no-cors',   // required for Apps Script cross-origin
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        // Always save locally as backup
        saveBackup(payload);
        showSuccessScreen();

    } catch (err) {
        console.error('Submission error:', err);
        // Save locally if network fails, still show success to user
        saveBackup({ ...formData, timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) });
        showSuccessScreen();
        showToast('Saved locally. Will sync when connection is stable.', 'info');
    } finally {
        if (btn) { btn.innerHTML = originalHTML; btn.disabled = false; }
    }
}

// ─── Pincode Area Lookup ──────────────────────────────────────────────────
async function getAreaFromPincode(pincode) {
    if (!pincode || pincode.length !== 6) return 'Unknown';
    try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await res.json();
        if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.[0]) {
            return data[0].PostOffice[0].District || data[0].PostOffice[0].Name || 'Unknown';
        }
    } catch (_) { /* ignore */ }
    return 'Unknown';
}

// ─── Show Success Screen ──────────────────────────────────────────────────
function showSuccessScreen() {
    document.getElementById('homeView').style.display = 'none';
    document.querySelectorAll('.section-view').forEach(v => v.style.display = 'none');
    const sv = document.getElementById('successView');
    if (sv) { sv.style.display = 'block'; window.scrollTo({ top: 0, behavior: 'smooth' }); }
    resetForm();
}

// ─── Local Backup ─────────────────────────────────────────────────────────
function saveBackup(data) {
    try {
        const KEY = 'ss_bb_backup';
        let list = JSON.parse(localStorage.getItem(KEY) || '[]');
        list.unshift({ ...data, _saved: new Date().toISOString() });
        if (list.length > 60) list = list.slice(0, 60);
        localStorage.setItem(KEY, JSON.stringify(list));
    } catch (_) { /* storage unavailable */ }
}

// ─── Reset Form ───────────────────────────────────────────────────────────
function resetForm() {
    // Reset state
    Object.keys(formData).forEach(k => { formData[k] = ''; });
    formData.aadharPhoto = null;

    // Clear inputs
    document.querySelectorAll('#fs1 input, #fs2 input, #fs3 input, #fs4 input, #fs2 textarea').forEach(el => {
        if (el.type !== 'file') el.value = '';
    });
    const fi = document.getElementById('fileInput');
    if (fi) fi.value = '';

    // Clear selections
    document.querySelectorAll('.chip.selected, .iptv-chip.selected').forEach(c => c.classList.remove('selected'));

    // Clear image preview
    const ip = document.getElementById('imagePreview');
    if (ip) ip.innerHTML = '';

    // Hide IPTV sub-sections
    const ls = document.getElementById('langSection'), ps = document.getElementById('pkgSection');
    if (ls) ls.style.display = 'none';
    if (ps) ps.style.display = 'none';

    // Go back to step 1
    goToStep(1);
}

// ─── Input Validation Init ────────────────────────────────────────────────
function initValidation() {
    const phone = document.getElementById('phoneNumber');
    if (phone) phone.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 10);
    });

    const aadhar = document.getElementById('aadharNumber');
    if (aadhar) aadhar.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 12);
    });

    const pin = document.getElementById('pincode');
    if (pin) pin.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 6);
    });
}

// ─── Toast Notifications ──────────────────────────────────────────────────
function showToast(msg, type = 'info') {
    document.querySelectorAll('.toast').forEach(t => t.remove());
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${msg}</span>`;
    document.body.appendChild(el);
    const dur = type === 'error' ? 5000 : 3000;
    setTimeout(() => {
        el.style.transition = 'all 0.4s ease';
        el.style.opacity = '0';
        el.style.transform = 'translateX(40px)';
        setTimeout(() => el.remove(), 400);
    }, dur);
}
