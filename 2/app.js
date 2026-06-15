// ===== CONFIGURATION =====
const CONFIG = {
    username: 'admin',
    password: '1234',
    maxAttempts: 3,
    lockDuration: 30, // seconds
    securityMessages: [
        'BIOMETRIC FAILED',
        'FIREWALL ACTIVE',
        'IP TRACKED',
        'UNAUTHORIZED ACCESS DETECTED',
        'SECURITY BREACH ALERT',
        'INTRUSION COUNTERMEASURES ACTIVATED'
    ]
};

// ===== STATE =====
let state = {
    attempts: 0,
    isLocked: false,
    lockTimer: null,
    countdown: null
};

// ===== DOM ELEMENTS =====
const elements = {
    username: document.getElementById('username'),
    password: document.getElementById('password'),
    loginBtn: document.getElementById('loginBtn'),
    messageDisplay: document.getElementById('messageDisplay'),
    attemptsLeft: document.getElementById('attemptsLeft'),
    attemptCounter: document.getElementById('attemptCounter'),
    lockTimer: document.getElementById('lockTimer'),
    timerCount: document.getElementById('timerCount'),
    capsWarning: document.getElementById('capsWarning'),
    strengthMeter: document.getElementById('strengthMeter'),
    strengthText: document.getElementById('strengthText'),
    bars: document.querySelectorAll('.bar'),
    loadingScreen: document.getElementById('loadingScreen'),
    loadingLog: document.getElementById('loadingLog'),
    faceScanOverlay: document.getElementById('faceScanOverlay'),
    scanProgress: document.getElementById('scanProgress'),
    loginBox: document.getElementById('loginBox'),
    successScreen: document.getElementById('successScreen'),
    terminalBody: document.getElementById('terminalBody'),
    fingerprintContainer: document.getElementById('fingerprintContainer'),
    ipDisplay: document.getElementById('ipDisplay'),
    clock: document.getElementById('clock')
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    generateRandomIP();
    updateClock();
    setInterval(updateClock, 1000);
    setupEventListeners();
});

// ===== CLOCK =====
function updateClock() {
    const now = new Date();
    elements.clock.textContent = now.toLocaleTimeString('en-US', { hour12: false });
}

// ===== RANDOM IP GENERATOR =====
function generateRandomIP() {
    const ip = Array(4).fill(0).map(() => Math.floor(Math.random() * 256)).join('.');
    elements.ipDisplay.textContent = `IP: ${ip}`;
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Caps Lock detection
    elements.password.addEventListener('keydown', (e) => {
        if (e.getModifierState && e.getModifierState('CapsLock')) {
            elements.capsWarning.classList.add('show');
        } else {
            elements.capsWarning.classList.remove('show');
        }
    });

    elements.password.addEventListener('keyup', (e) => {
        if (e.getModifierState && e.getModifierState('CapsLock')) {
            elements.capsWarning.classList.add('show');
        } else {
            elements.capsWarning.classList.remove('show');
        }
        checkPasswordStrength(e.target.value);
    });

    // Enter key support
    elements.password.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !state.isLocked) {
            attemptLogin();
        }
    });

    elements.username.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !state.isLocked) {
            elements.password.focus();
        }
    });
}

// ===== PASSWORD STRENGTH CHECKER =====
function checkPasswordStrength(password) {
    if (!password) {
        elements.strengthMeter.classList.remove('active');
        return;
    }

    elements.strengthMeter.classList.add('active');
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    // Normalize to 0-4
    let level = 0;
    if (strength >= 5) level = 4;
    else if (strength >= 4) level = 3;
}