// State variables (Level 4/5)
let isScanning = false;
let currentTheme = 'light';

// Масив със съобщения (Level 1)
const scanMessages = [
    "Initializing bypass protocols...",
    "Accessing encrypted database...",
    "Scanning firewall vulnerabilities...",
    "Extracting metadata...",
    "Bypassing 2FA authentication...",
    "Root access granted.",
    "Analyzing user behavior with AI..."
];

// Функция за смяна на темата (Level 2)
function toggleTheme() {
    const body = document.body;
    if (body.classList.contains('light-mode')) {
        body.classList.replace('light-mode', 'dark-mode');
        currentTheme = 'dark';
    } else {
        body.classList.replace('dark-mode', 'light-mode');
        currentTheme = 'light';
    }
}

// Главна функция за сканиране (Level 4/5)
async function startScan() {
    if (isScanning) return;
    isScanning = true;
    
    // Нулиране на интерфейса
    const btn = document.getElementById('scan-btn');
    const msgList = document.getElementById('message-list');
    const progressBar = document.getElementById('progress-bar');
    const progressCont = document.getElementById('progress-container');
    const threatDisplay = document.getElementById('threat-level');
    
    btn.disabled = true;
    msgList.innerHTML = "";
    progressCont.style.display = "block";
    threatDisplay.classList.add('hidden');
    
    // Fake Progress Logic (Level 4)
    for (let i = 0; i <= 100; i += Math.floor(Math.random() * 10) + 1) {
        let displayWidth = i > 100 ? 100 : i;
        progressBar.style.width = displayWidth + "%";
        
        // Добавяне на случайно съобщение на определени интервали (Level 1)
        if (i % 20 === 0) {
            addMessage(scanMessages[Math.floor(Math.random() * scanMessages.length)]);
        }
        
        await new Promise(r => setTimeout(r, 200));
    }

    finishScan();
}

function addMessage(text) {
    const msgList = document.getElementById('message-list');
    const li = document.createElement('li');
    li.className = 'msg-item';
    li.innerText = `> ${text}`;
    msgList.appendChild(li);
}

function finishScan() {
    isScanning = false;
    document.getElementById('scan-btn').disabled = false;
    document.getElementById('status-text').innerText = "SCAN COMPLETE";
    
    // Threat Level Logic (Level 4)
    const threatDisplay = document.getElementById('threat-level');
    const threatValue = document.getElementById('level-value');
    threatDisplay.classList.remove('hidden');
    
    // AI/Random Logic за риск (Level 5)
    const risks = ["LOW", "MEDIUM", "CRITICAL", "HIGH"];
    const result = risks[Math.floor(Math.random() * risks.length)];
    
    threatValue.innerText = result;
    if (result === "CRITICAL" || result === "HIGH") {
        threatValue.className = "danger"; // Color effect
    } else {
        threatValue.className = "";
    }
}