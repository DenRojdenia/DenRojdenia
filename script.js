// Список сложных логических загадок
const riddles = [
    {
        text: "Перед вами лежат четыре карты. Известно, что на одной стороне карточек всегда цифра, а на другой — буква русского алфавита. Вам говорят: 'Если на одной стороне четная цифра, то на другой — согласная буква'. Какие карты минимально нужно перевернуть, чтобы подтвердить или опровергнуть это утверждение? (Ответ напишите в формате: цифра, буква через запятую, например: 2, А)",
        correct: "2, а"
    },
    {
        text: "Что можно разбить, не прикасаясь к нему руками?",
        correct: "тишину"
    },
    {
        text: "Что становится больше, если его поставить вверх ногами?",
        correct: "6"
    },
    {
        text: "Из какого крана нельзя напиться?",
        correct: "подъёмного"
    },
    {
        text: "Что можно держать, не касаясь его руками?",
        correct: "дыхание"
    }
];

let solvedStatus = [false, false, false, false, false];

function loadProgress() {
    const saved = localStorage.getItem('riddlesProgress');
    if (saved) {
        try {
            const arr = JSON.parse(saved);
            if (arr.length === riddles.length) solvedStatus = arr;
        } catch(e) {}
    }
}

function saveProgress() {
    localStorage.setItem('riddlesProgress', JSON.stringify(solvedStatus));
}

function updateProgress() {
    const solvedCount = solvedStatus.filter(v => v === true).length;
    const percent = (solvedCount / riddles.length) * 100;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) progressBar.style.width = percent + '%';
    
    const finalDiv = document.getElementById('finalMessage');
    if (solvedCount === riddles.length) {
        if (finalDiv) finalDiv.style.display = 'block';
        const link = document.getElementById('messengerLink');
        if (link) {
            // ⚠️ ЗАМЕНИТЕ НА РЕАЛЬНУЮ ССЫЛКУ НА КАНАЛ В МЕССЕНДЖЕРЕ MAX
            link.href = 'https://max.ru/ваш_канал';
            link.textContent = 'Открыть канал в Макс →';
        }
    } else {
        if (finalDiv) finalDiv.style.display = 'none';
    }
}

function checkAnswer(index, userAnswer) {
    if (solvedStatus[index]) return true;
    
    const normalizedAnswer = userAnswer.trim().toLowerCase();
    const correctAnswer = riddles[index].correct;
    
    if (normalizedAnswer === correctAnswer) {
        solvedStatus[index] = true;
        saveProgress();
        renderRiddles();
        updateProgress();
        return true;
    }
    return false;
}

function renderRiddles() {
    const container = document.getElementById('riddlesContainer');
    if (!container) return;
    container.innerHTML = '';
    
    for (let i = 0; i < riddles.length; i++) {
        const r = riddles[i];
        const isSolved = solvedStatus[i];
        const card = document.createElement('div');
        card.className = 'riddle-card' + (isSolved ? ' solved' : '');
        card.dataset.index = i;
        
        const questionDiv = document.createElement('div');
        questionDiv.className = 'riddle-question';
        questionDiv.innerText = `${i+1}. ${r.text}`;
        card.appendChild(questionDiv);
        
        if (!isSolved) {
            const answerDiv = document.createElement('div');
            answerDiv.className = 'answer-area';
            
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Введите ответ';
            input.autocomplete = 'off';
            
            const checkBtn = document.createElement('button');
            checkBtn.innerText = 'Проверить';
            
            const wrongMsgDiv = document.createElement('div');
            wrongMsgDiv.className = 'wrong-message';
            
            checkBtn.addEventListener('click', () => {
                const answer = input.value;
                if (!checkAnswer(i, answer)) {
                    wrongMsgDiv.innerText = '❌ Неверно, попробуй ещё раз!';
                    input.value = '';
                    input.focus();
                    setTimeout(() => {
                        wrongMsgDiv.innerText = '';
                    }, 1500);
                }
            });
            
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    checkBtn.click();
                }
            });
            
            answerDiv.appendChild(input);
            answerDiv.appendChild(checkBtn);
            card.appendChild(answerDiv);
            card.appendChild(wrongMsgDiv);
        } else {
            const solvedMark = document.createElement('div');
            solvedMark.className = 'solved-mark';
            solvedMark.innerText = '✓ Решено';
            card.appendChild(solvedMark);
        }
        
        container.appendChild(card);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    renderRiddles();
    updateProgress();
});
