// 遊戲狀態
let currentLevel = 1;
let score = 0;
let timeLeft = 60;
let gameTimer;
let currentWordIndex = 0;
let isGameActive = false;

// 10個關卡的英文單字（適合12歲以下兒童）
const gameLevels = [
    // 第1關：基礎動物
    {
        level: 1,
        title: "可愛動物",
        words: ["cat", "dog", "pig", "cow", "duck", "bird", "fish", "bee", "ant", "owl"]
    },
    // 第2關：顏色
    {
        level: 2,
        title: "美麗顏色",
        words: ["red", "blue", "green", "yellow", "pink", "black", "white", "brown", "orange", "purple"]
    },
    // 第3關：數字
    {
        level: 3,
        title: "數字世界",
        words: ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"]
    },
    // 第4關：家庭成員
    {
        level: 4,
        title: "我的家庭",
        words: ["mom", "dad", "sister", "brother", "baby", "grandma", "grandpa", "aunt", "uncle", "cousin"]
    },
    // 第5關：食物
    {
        level: 5,
        title: "美味食物",
        words: ["apple", "banana", "cake", "milk", "bread", "rice", "meat", "fish", "egg", "soup"]
    },
    // 第6關：身體部位
    {
        level: 6,
        title: "我的身體",
        words: ["head", "eye", "nose", "mouth", "hand", "foot", "arm", "leg", "ear", "tooth"]
    },
    // 第7關：學校用品
    {
        level: 7,
        title: "學校用品",
        words: ["book", "pen", "pencil", "paper", "bag", "desk", "chair", "board", "ruler", "eraser"]
    },
    // 第8關：交通工具
    {
        level: 8,
        title: "交通工具",
        words: ["car", "bus", "train", "plane", "bike", "boat", "truck", "taxi", "ship", "helicopter"]
    },
    // 第9關：天氣
    {
        level: 9,
        title: "天氣變化",
        words: ["sun", "rain", "snow", "wind", "cloud", "storm", "hot", "cold", "warm", "cool"]
    },
    // 第10關：動作
    {
        level: 10,
        title: "動作詞彙",
        words: ["run", "jump", "walk", "swim", "fly", "dance", "sing", "play", "read", "write"]
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
    updateDisplay();
}

// 開始遊戲
function startGame() {
    initGame();
    showGameScreen();
    loadLevel(currentLevel);
    startTimer();
    isGameActive = true;
    document.getElementById('word-input').focus();
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
    currentWordIndex = 0;
    updateDisplay();
    showNextWord();
    
    // 更新關卡標題
    const wordDisplay = document.querySelector('.word-display h3');
    wordDisplay.textContent = `第${level}關：${levelData.title} - 請輸入以下單字：`;
}

// 顯示下一個單字
function showNextWord() {
    const levelData = gameLevels[currentLevel - 1];
    if (currentWordIndex < levelData.words.length) {
        const word = levelData.words[currentWordIndex];
        document.getElementById('target-word').textContent = word;
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
    const progress = (currentWordIndex / levelData.words.length) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
}

// 檢查輸入
function checkInput() {
    const input = document.getElementById('word-input').value.toLowerCase().trim();
    const targetWord = document.getElementById('target-word').textContent.toLowerCase();
    
    if (input === targetWord) {
        handleCorrectInput();
    } else if (input.length > 0 && targetWord.startsWith(input)) {
        // 部分正確，給予視覺反饋
        showPartialCorrect();
    } else if (input.length > 0 && !targetWord.startsWith(input)) {
        // 錯誤輸入
        showWrongInput();
    }
}

// 處理正確輸入
function handleCorrectInput() {
    score += 10;
    currentWordIndex++;
    updateDisplay();
    
    // 顯示正確反饋
    showFeedback('correct', '🎉 ' + getRandomEncouragement());
    
    // 短暫延遲後顯示下一個單字
    setTimeout(() => {
        if (currentWordIndex < gameLevels[currentLevel - 1].words.length) {
            showNextWord();
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
    
    // 短暫顯示錯誤後恢復
    setTimeout(() => {
        input.classList.remove('wrong-typing');
    }, 300);
}

// 顯示反饋
function showFeedback(type, message) {
    const feedbackArea = document.getElementById('feedback-area');
    feedbackArea.innerHTML = `<div class="feedback-${type}">${message}</div>`;
    
    // 清除之前的反饋
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
    
    if (currentLevel < 10) {
        // 顯示關卡完成畫面
        document.getElementById('game-screen').style.display = 'none';
        document.getElementById('level-complete-screen').style.display = 'flex';
    } else {
        // 遊戲完成
        document.getElementById('final-score').textContent = score;
        document.getElementById('game-screen').style.display = 'none';
        document.getElementById('game-over-screen').style.display = 'flex';
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
}

// 重新開始遊戲
function restartGame() {
    initGame();
    document.getElementById('start-screen').style.display = 'flex';
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('level-complete-screen').style.display = 'none';
    document.getElementById('game-over-screen').style.display = 'none';
}

// 開始計時器
function startTimer() {
    timeLeft = 60;
    updateDisplay();
    
    gameTimer = setInterval(() => {
        timeLeft--;
        updateDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            isGameActive = false;
            showFeedback('wrong', '⏰ 時間到了！');
            setTimeout(() => {
                if (currentLevel < 10) {
                    nextLevel();
                } else {
                    completeLevel();
                }
            }, 2000);
        }
    }, 1000);
}

// 更新顯示
function updateDisplay() {
    document.getElementById('current-level').textContent = currentLevel;
    document.getElementById('score').textContent = score;
    document.getElementById('timer').textContent = timeLeft;
}

// 獲取隨機鼓勵詞彙
function getRandomEncouragement() {
    return encouragements[Math.floor(Math.random() * encouragements.length)];
}

// 事件監聽器
document.addEventListener('DOMContentLoaded', function() {
    const wordInput = document.getElementById('word-input');
    
    // 輸入事件
    wordInput.addEventListener('input', function() {
        if (isGameActive) {
            checkInput();
        }
    });
    
    // 按鍵事件
    wordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && isGameActive) {
            const input = this.value.toLowerCase().trim();
            const targetWord = document.getElementById('target-word').textContent.toLowerCase();
            
            if (input === targetWord) {
                handleCorrectInput();
            } else {
                showFeedback('wrong', '再試一次！');
            }
        }
    });
    
    // 防止輸入框失去焦點
    wordInput.addEventListener('blur', function() {
        if (isGameActive) {
            setTimeout(() => this.focus(), 100);
        }
    });
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
