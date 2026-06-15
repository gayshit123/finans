/* ============================================
   FAKE STREAMING CHAT SYSTEM - JAVASCRIPT
   ============================================ */

// ==================== DATA ARRAYS ====================

const usernames = [
    "ShadowX", "PixelPro", "CyberWolf", "NeonNinja", "DragonSlayer",
    "MoonWalker", "StarGazer", "TechMaster", "CodeBreaker", "GameLord",
    "NightOwl", "FireFox", "IceQueen", "ThunderBolt", "MysticMage",
    "PixelQueen", "StreamKing", "ChatMaster", "VibeLord", "MemeKing"
];

const colors = [
    "#ff0000", "#00ffff", "#00ff00", "#ffa500", 
    "#ff69b4", "#ffd700", "#9370db", "#00ced1",
    "#ff1493", "#7fff00", "#ff4500", "#da70d6"
];

const emojis = ["🔥", "😂", "💀", "❤️", "👍", "🎉", "💯", "👀", "🤔", "😎", "🚀", "💪"];

const messages = [
    "Hello everyone!", "This stream is amazing!", "First time here!", 
    "Can you play Fortnite?", "GG!", "That was insane!", 
    "Love the content!", "When is the next stream?", 
    "Subscribed!", "How long have you been streaming?",
    "This is so cool!", "Nice play!", "You're the best!",
    "Can I get a shoutout?", "Hello from Bulgaria!", 
    "What rank are you?", "That combo was fire!",
    "I'm learning so much!", "Best streamer ever!",
    "Let's gooooo!", "Poggers!", "Big brain play!"
];

const avatars = ["🎮", "👾", "🤖", "👽", "🐱", "🐶", "🦊", "🦁", "🐯", "🐼"];

const donationAmounts = [5, 10, 20, 50, 100, 200, 500, 1000];

const bannedWords = ["spam", "hate", "toxic", "badword"];

// ==================== STATE VARIABLES ====================

let chatInterval = null;
let isRunning = false;
let soundEnabled = true;
let totalDonations = 450;
const goalTarget = 1000;
let messageCount = 0;

// ==================== DOM ELEMENTS ====================

const chatContainer = document.getElementById('chatContainer');
const emptyState = document.getElementById('emptyState');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const viewerCount = document.getElementById('viewerCount');
const soundToggle = document.getElementById('soundToggle');
const goalProgress = document.getElementById('goalProgress');
const goalText = document.getElementById('goalText');

// ==================== HELPER FUNCTIONS ====================

// Random number generator
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Random item from array
function randomItem(arr) {
    return arr[random(0, arr.length - 1)];
}

// Generate random user
function generateUser() {
    const username = randomItem(usernames);
    const color = randomItem(colors);
    const isMod = random(1, 20) === 1;
    const isSub = random(1, 3) === 1;
    const avatar = randomItem(avatars);
    return { username, color, isMod, isSub, avatar };
}

// Check if message contains banned words
function isBanned(text) {
    return bannedWords.some(word => text.toLowerCase().includes(word));
}

// Play notification sound
function playSound(type = 'message') {
    if (!soundEnabled) return;
    
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        if (type === 'donation') {
            oscillator.frequency.value = 800;
            gainNode.gain.value = 0.1;
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.3);
        } else {
            oscillator.frequency.value = 400;
            gainNode.gain.value = 0.05;
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        }
    } catch (e) {
        // Silently fail if audio not supported
    }
}

// ==================== MESSAGE CREATION ====================

// Create regular chat message
function createMessage(user, text, isBannedMsg = false) {
    const div = document.createElement('div');
    div.className = `chat-message ${isBannedMsg ? 'banned-message' : ''}`;
    
    const badges = [];
    if (user.isMod) badges.push('<span class="mod-badge">MOD</span>');
    if (user.isSub) badges.push('<span class="subscriber-badge">SUB</span>');

    const hasEmoji = random(1, 10) <= 3;
    const emoji = hasEmoji ? randomItem(emojis) : '';

    div.innerHTML = `
        <div class="message-avatar">${user.avatar}</div>
        <div class="message-content">
            <div class="message-header">
                <span class="username neon-text" style="color: ${user.color}">${user.username}</span>
                ${badges.join('')}
            </div>
            <div class="message-text">${text} ${emoji}</div>
        </div>
    `;
    
    return div;
}

// Create donation message
function createDonation(user, amount) {
    const div = document.createElement('div');
    div.className = 'chat-message donation-message';
    
    div.innerHTML = `
        <div class="message-avatar">💎</div>
        <div class="message-content">
            <div class="message-header">
                <span class="username" style="color: #ffd700">${user.username}</span>
            </div>
            <div class="message-text">
                donated <span class="donation-amount">$${amount}</span>! 🔥
            </div>
        </div>
    `;
    
    return div;
}

// Create subscriber message
function createSubscriber(user) {
    const div = document.createElement('div');
    div.className = 'chat-message';
    div.style.background = 'rgba(145, 70, 255, 0.2)';
    div.style.borderLeft = '4px solid #9146ff';
    
    div.innerHTML = `
        <div class="message-avatar">⭐</div>
        <div class="message-content">
            <div class="message-header">
                <span class="username" style="color: #9146ff">${user.username}</span>
            </div>
            <div class="message-text">just subscribed! Welcome to the family! 🎉</div>
        </div>
    `;
    
    return div;
}

// ==================== CHAT FUNCTIONS ====================

// Add message to chat
function addMessage(element) {
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    
    chatContainer.appendChild(element);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    while (chatContainer.children.length > 100) {
        if (chatContainer.firstChild !== soundToggle) {
            chatContainer.removeChild(chatContainer.firstChild);
        } else {
            chatContainer.removeChild(chatContainer.children[1]);
        }
    }
}

// Generate random message
function generateRandomMessage() {
    const user = generateUser();
    const messageType = random(1, 100);
    
    if (messageType <= 10) {
        const amount = randomItem(donationAmounts);
        totalDonations += amount;
        updateGoal();
        playSound('donation');
        return createDonation(user, amount);
    }
    
    if (messageType > 10 && messageType <= 15) {
        playSound('donation');
        return createSubscriber(user);
    }
    
    let text = randomItem(messages);
    const banned = isBanned(text);
    
    if (random(1, 5) === 1) {
        text = `${randomItem(emojis)} ${text} ${randomItem(emojis)}`;
    }
    
    playSound('message');
    return createMessage(user, text, banned);
}

// Update stream goal
function updateGoal() {
    const percentage = Math.min((totalDonations / goalTarget) * 100, 100);
    goalProgress.style.width = percentage + '%';
    goalProgress.textContent = Math.floor(percentage) + '%';
    goalText.textContent = `$${totalDonations} / $${goalTarget}`;
}

// Update fake viewer count
function updateViewers() {
    const base = 1200;
    const variation = random(-100, 100);
    const count = base + variation;
    viewerCount.textContent = count.toLocaleString() + ' viewers';
}

// ==================== MAIN CONTROLS ====================

function startChat() {
    if (isRunning) return;
    
    isRunning = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;
    
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            addMessage(generateRandomMessage());
        }, i * 300);
    }
    
    chatInterval = setInterval(() => {
        addMessage(generateRandomMessage());
        updateViewers();
    }, random(1500, 3000));
    
    setInterval(updateViewers, 5000);
}

function stopChat() {
    isRunning = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    
    if (chatInterval) {
        clearInterval(chatInterval);
        chatInterval = null;
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
}

// ==================== EVENT LISTENERS ====================

startBtn.addEventListener('click', startChat);
stopBtn.addEventListener('click', stopChat);
soundToggle.addEventListener('click', toggleSound);

chatContainer.addEventListener('click', function(e) {
    const message = e.target.closest('.chat-message');
    if (message && !message.classList.contains('banned-message')) {
        message.classList.toggle('banned-message');
    }
});

// ==================== INITIALIZATION ====================

updateViewers();

console.log('🎮 Fake Streaming Chat System loaded!');
console.log('📋 Features: Auto-scroll, Random Colors, Emojis, Donations, Subscribers, Moderators, Stream Goals, Sound Effects, Banned Messages');