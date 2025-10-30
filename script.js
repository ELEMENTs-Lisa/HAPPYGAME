// 遊戲狀態
let currentLevel = 1;
let score = 0;
let timeLeft = 60;
let gameTimer;
let currentWordIndex = 0;
let isGameActive = false;
let gameMode = 'practice'; // 新增遊戲模式變數: 'practice' (自己練習) 或 'battle' (人機對戰)

// 10個關卡的英文句子
const gameLevels = [
    {
        level: 1,
        title: "基礎問候語",
        sentences: [
            "Hello, how are you?",
            "I am fine, thank you.",
            "What is your name?",
            "My name is Alex.",
            "Nice to meet you.",
            "Good morning, everyone.",
            "Have a good day.",
            "See you later.",
            "Excuse me, please.",
            "Thank you very much."
        ]
    },
    {
        level: 2,
        title: "日常對話",
        sentences: [
            "Where are you from?",
            "I am from Taiwan.",
            "What do you do?",
            "I am a student.",
            "How old are you?",
            "I am ten years old.",
            "Do you like apples?",
            "Yes, I like apples.",
            "Can you help me?",
            "Of course, I can."
        ]
    },
    {
        level: 3,
        title: "學校生活",
        sentences: [
            "I go to school every day.",
            "My favorite subject is English.",
            "I have many friends at school.",
            "We learn new things in class.",
            "The teacher is very kind.",
            "I read a book in the library.",
            "We play games during break time.",
            "I finish my homework every night.",
            "School starts at eight o'clock.",
            "I enjoy my school life."
        ]
    },
    {
        level: 4,
        title: "家庭與活動",
        sentences: [
            "I live with my family.",
            "My mom cooks delicious food.",
            "My dad plays with me.",
            "I have a younger sister.",
            "We go to the park on weekends.",
            "I like playing computer games.",
            "We watch movies together.",
            "I help with housework.",
            "My grandparents visit us often.",
            "We are a happy family."
        ]
    },
    {
        level: 5,
        title: "食物與飲料",
        sentences: [
            "I like to eat noodles.",
            "Do you want some juice?",
            "I usually eat breakfast at home.",
            "My favorite fruit is watermelon.",
            "We often have dinner together.",
            "I drink milk every morning.",
            "She bakes a cake for my birthday.",
            "He likes to eat fast food.",
            "Let's go to a restaurant.",
            "The pizza is very tasty."
        ]
    },
    {
        level: 6,
        title: "天氣與季節",
        sentences: [
            "What's the weather like today?",
            "It is sunny and warm.",
            "I like spring the most.",
            "It often rains in summer.",
            "The leaves turn yellow in autumn.",
            "It is cold and snowy in winter.",
            "Don't forget your umbrella.",
            "The wind is blowing hard.",
            "I love to watch the clouds.",
            "Let's go play outside."
        ]
    },
    {
        level: 7,
        title: "動物世界",
        sentences: [
            "The lion is a wild animal.",
            "Dogs are friendly pets.",
            "Birds can fly high in the sky.",
            "The elephant has a long trunk.",
            "Monkeys like to eat bananas.",
            "Fish live in the water.",
            "Cats like to chase mice.",
            "The rabbit eats carrots.",
            "Snakes can be dangerous.",
            "Butterflies have beautiful wings."
        ]
    },
    {
        level: 8,
        title: "顏色與形狀",
        sentences: [
            "My favorite color is blue.",
            "The grass is green.",
            "Red is a bright color.",
            "The sun is yellow.",
            "A square has four equal sides.",
            "A circle is round.",
            "The triangle has three corners.",
            "The sky is blue today.",
            "Her dress is pink.",
            "The car is black."
        ]
    },
    {
        level: 9,
        title: "地點與方向",
        sentences: [
            "Where is the post office?",
            "Go straight and turn left.",
            "The park is next to the school.",
            "I live near the supermarket.",
            "How can I get to the station?",
            "It's on your right side.",
            "Let's meet at the cafe.",
            "The library is far from here.",
            "Walk across the street.",
            "It's a beautiful city."
        ]
    },
    {
        level: 10,
        title: "形容詞與動作",
        sentences: [
            "She is a very tall girl.",
            "He is running fast.",
            "The flower smells sweet.",
            "This is a big house.",
            "I feel happy today.",
            "He jumps over the fence.",
            "She sings a beautiful song.",
            "I like to read interesting books.",
            "They are playing football.",
            "The water is cold."
        ]
    }
];

// 鼓勵詞彙
const encouragements = [
    "太棒了！", "做得很好！", "繼續加油！", "你真聰明！", 
    "太厲害了！", "保持下去！", "你做得很好！", "真不錯！"
];

// 初始化遊戲
function initGame() {
    currentLevel = 1;
    score = 0;
    timeLeft = 60;
    currentWordIndex = 0;
    isGameActive = false;
    clearInterval(gameTimer); // 清除可能存在的計時器
    updateDisplay();
    document.getElementById('feedback-area').innerHTML = ''; // 清除反饋訊息
    document.getElementById('word-input').value = '';
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('level-complete-screen').style.display = 'none';
    document.getElementById('game-over-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
}

// 開始遊戲
function startGame(mode) {
    gameMode = mode; // 設定遊戲模式
    initGame();
    showGameScreen();
    loadLevel(currentLevel);
    startTimer();
    isGameActive = true;
    document.getElementById('word-input').focus();

    if (gameMode === 'battle') {
        // 顯示 AI 相關元素，並啟動 AI 對手
        document.getElementById('ai-progress-container').style.display = 'flex';
        startAITyping();
    } else {
        document.getElementById('ai-progress-container').style.display = 'none';
    }
}

// 顯示遊戲畫面
function showGameScreen() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'flex';
    document.getElementById('level-complete-screen').style.display = 'none';
    document.getElementById('game-over-screen').style.display = 'none';
}

// 載入關卡
function loadLevel(level) {
    const levelData = gameLevels[level - 1];
    currentWordIndex = 0; // 現在是句子，但仍使用此索引
    updateDisplay();
    showNextSentence();
    
    // 更新關卡標題
    const wordDisplay = document.querySelector('.word-display h3');
    wordDisplay.textContent = `第${level}關：${levelData.title} - 請輸入以下句子：`;
}

// 顯示下一個句子
function showNextSentence() {
    const levelData = gameLevels[currentLevel - 1];
    if (currentWordIndex < levelData.sentences.length) {
        const sentence = levelData.sentences[currentWordIndex];
        document.getElementById('target-word').textContent = sentence;
        document.getElementById('word-input').value = '';
        document.getElementById('word-input').focus();
        updateProgress();
    } else {
        completeLevel();
    }
}

// 更新進度條
function updateProgress() {
    const levelData = gameLevels[currentLevel - 1];
    const progress = (currentWordIndex / levelData.sentences.length) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';

    if (gameMode === 'battle') {
        updateAIProgress();
    }
}

// 檢查輸入
function checkInput() {
    const input = document.getElementById('word-input').value;
    const targetSentence = document.getElementById('target-word').textContent;
    
    if (input === targetSentence) {
        handleCorrectInput();
    } else if (input.length > 0 && targetSentence.startsWith(input)) {
        showPartialCorrect();
    } else if (input.length > 0 && !targetSentence.startsWith(input)) {
        showWrongInput();
    }
}

// 處理正確輸入
let correctChars = 0;
let typedEntries = 0; // 追蹤完成的單字/句子數
let startTime = 0;

function handleCorrectInput() {
    const targetSentence = document.getElementById('target-word').textContent;
    score += targetSentence.length; // 每個字元計分
    correctChars += targetSentence.length;
    typedEntries++;
    currentWordIndex++;
    updateDisplay();
    
    showFeedback('correct', '🎉 ' + getRandomEncouragement());
    
    setTimeout(() => {
        const levelData = gameLevels[currentLevel - 1];
        if (currentWordIndex < levelData.sentences.length) {
            showNextSentence();
        } else {
            completeLevel();
        }
    }, 1000);
}

// 顯示部分正確
function showPartialCorrect() {
    const input = document.getElementById('word-input');
    input.classList.remove('wrong-typing');
    input.classList.add('correct-typing');
}

// 顯示錯誤輸入
function showWrongInput() {
    const input = document.getElementById('word-input');
    input.classList.remove('correct-typing');
    input.classList.add('wrong-typing');
    
    setTimeout(() => {
        input.classList.remove('wrong-typing');
    }, 300);
}

// 顯示反饋
function showFeedback(type, message) {
    const feedbackArea = document.getElementById('feedback-area');
    feedbackArea.innerHTML = `<div class="feedback-${type}">${message}</div>`;
    
    setTimeout(() => {
        feedbackArea.innerHTML = '';
    }, 2000);
}

// 完成關卡
function completeLevel() {
    isGameActive = false;
    clearInterval(gameTimer);
    
    document.getElementById('completed-level').textContent = currentLevel;
    document.getElementById('level-score').textContent = score;
    
    if (currentLevel < gameLevels.length) {
        document.getElementById('game-screen').style.display = 'none';
        document.getElementById('level-complete-screen').style.display = 'flex';
    } else {
        document.getElementById('final-score').textContent = score;
        document.getElementById('game-screen').style.display = 'none';
        document.getElementById('game-over-screen').style.display = 'flex';
    }

    if (gameMode === 'battle') {
        clearInterval(aiTimer);
        // 判斷勝負並顯示結果
        const playerProgress = currentWordIndex / gameLevels[currentLevel - 1].sentences.length;
        const aiProgress = aiCurrentWordIndex / gameLevels[currentLevel - 1].sentences.length;
        let battleResult = '';
        if (playerProgress > aiProgress) {
            battleResult = '你贏了！';
        } else if (aiProgress > playerProgress) {
            battleResult = 'AI 贏了！';
        } else {
            battleResult = '平手！';
        }
        showFeedback('info', `對戰結果：${battleResult}`);
    }
}

// 下一關
function nextLevel() {
    currentLevel++;
    showGameScreen();
    loadLevel(currentLevel);
    startTimer();
    isGameActive = true;
    document.getElementById('word-input').focus();
    if (gameMode === 'battle') {
        startAITyping(); // 重新啟動 AI
    }
}

// 重新開始遊戲
function restartGame() {
    initGame();
    if (gameMode === 'battle') {
        clearInterval(aiTimer);
        document.getElementById('ai-progress-container').style.display = 'none';
    }
}

// 開始計時器
function startTimer() {
    timeLeft = 60;
    updateDisplay();
    startTime = new Date().getTime(); // 記錄開始時間
    
    gameTimer = setInterval(() => {
        timeLeft--;
        updateDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            isGameActive = false;
            showFeedback('wrong', '⏰ 時間到了！');
            // 自動跳到下一關或結束遊戲
            setTimeout(() => {
                if (currentLevel < gameLevels.length) {
                    nextLevel();
                } else {
                    completeLevel();
                }
            }, 2000);
        }
    }, 1000);
}

// 計算 WPM 和準確率
function calculateWPM() {
    const elapsedTimeInMinutes = (new Date().getTime() - startTime) / 60000;
    if (elapsedTimeInMinutes <= 0) return 0;
    return Math.round((correctChars / 5) / elapsedTimeInMinutes); // 假設一個單字平均5個字元
}

function calculateAccuracy() {
    const input = document.getElementById('word-input').value;
    const targetSentence = document.getElementById('target-word').textContent;
    let correctCharacters = 0;
    for (let i = 0; i < input.length; i++) {
        if (input[i] === targetSentence[i]) {
            correctCharacters++;
        }
    }
    if (input.length === 0) return 100;
    return Math.round((correctCharacters / input.length) * 100);
}

// 更新顯示
function updateDisplay() {
    document.getElementById('current-level').textContent = currentLevel;
    document.getElementById('score').textContent = score;
    document.getElementById('timer').textContent = timeLeft;

    // 顯示 WPM 和準確率 (僅在自己練習模式下)
    if (gameMode === 'practice') {
        const wpm = calculateWPM();
        const accuracy = calculateAccuracy();
        document.getElementById('wpm-display').textContent = wpm;
        document.getElementById('accuracy-display').textContent = accuracy;
        document.getElementById('wpm-accuracy-container').style.display = 'flex';
    } else {
        document.getElementById('wpm-accuracy-container').style.display = 'none';
    }

    // 更新玩家和 AI 進度條顯示
    const levelData = gameLevels[currentLevel - 1];
    const playerProgress = (currentWordIndex / levelData.sentences.length) * 100;
    document.getElementById('player-progress-display').textContent = `${playerProgress.toFixed(0)}%`;
    document.getElementById('player-progress-fill').style.width = playerProgress + '%';

    if (gameMode === 'battle') {
        const aiProgress = (aiCurrentWordIndex / levelData.sentences.length) * 100;
        document.getElementById('ai-progress-display').textContent = `${aiProgress.toFixed(0)}%`;
        document.getElementById('ai-progress-fill').style.width = aiProgress + '%';
    }
}

// 獲取隨機鼓勵詞彙
function getRandomEncouragement() {
    return encouragements[Math.floor(Math.random() * encouragements.length)];
}

// AI 對戰邏輯
let aiCurrentWordIndex = 0;
let aiTimer;
let aiTypingSpeed = 50; // AI 打字速度 (字元/秒)

function startAITyping() {
    aiCurrentWordIndex = 0;
    updateAIProgress();
    const levelData = gameLevels[currentLevel - 1];
    const totalSentenceLength = levelData.sentences.reduce((sum, sentence) => sum + sentence.length, 0);
    const estimatedTime = totalSentenceLength / aiTypingSpeed * 1000; // 估計完成時間 (毫秒)
    const interval = estimatedTime / levelData.sentences.length; // 每句的平均時間

    clearInterval(aiTimer);
    aiTimer = setInterval(() => {
        if (aiCurrentWordIndex < levelData.sentences.length) {
            aiCurrentWordIndex++;
            updateAIProgress();
        } else {
            clearInterval(aiTimer);
        }
    }, interval);
}

function updateAIProgress() {
    const levelData = gameLevels[currentLevel - 1];
    const aiProgress = (aiCurrentWordIndex / levelData.sentences.length) * 100;
    document.getElementById('ai-progress-fill').style.width = aiProgress + '%';
}

// 事件監聽器
document.addEventListener('DOMContentLoaded', function() {
    const wordInput = document.getElementById('word-input');
    
    wordInput.addEventListener('input', function() {
        if (isGameActive) {
            checkInput();
            if (gameMode === 'practice') {
                updateDisplay(); // 即時更新 WPM 和準確率
            }
        }
    });
    
    wordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && isGameActive) {
            const input = this.value;
            const targetSentence = document.getElementById('target-word').textContent;
            
            if (input === targetSentence) {
                handleCorrectInput();
            } else {
                showFeedback('wrong', '再試一次！');
            }
        }
    });
    
    wordInput.addEventListener('blur', function() {
        if (isGameActive) {
            setTimeout(() => this.focus(), 100);
        }
    });
    initGame(); // 初始化遊戲狀態
});

// 添加音效（簡單的Web Audio API實現）
function playSound(type) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        if (type === 'correct') {
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
        } else if (type === 'wrong') {
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        }
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        // 如果音效無法播放，靜默失敗
    }
}

// 修改handleCorrectInput函數以包含音效
const originalHandleCorrectInput = handleCorrectInput;
handleCorrectInput = function() {
    playSound('correct');
    originalHandleCorrectInput();
};

// 修改showWrongInput函數以包含音效
const originalShowWrongInput = showWrongInput;
showWrongInput = function() {
    playSound('wrong');
    originalShowWrongInput();
};
