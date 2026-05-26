const riddles = [
    { text: "Что можно разбить, не прикасаясь и не роняя?", correct: "тишину" },
    { text: "Что становится легче, когда его увеличивают?", correct: "дыра" },
    { text: "Что может путешествовать по всему миру, оставаясь в одном углу?", correct: "марка" },
    { text: "У вас есть 9 монет, одна фальшивая (легче). За какое минимальное количество взвешиваний на чашечных весах без гирь вы её найдёте? (Ответ числом)", correct: "2" },
    { text: "Что можно взять в левую руку, но нельзя в правую?", correct: "правый локоть" }
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
            let currentUrl = localStorage.getItem('customMessengerUrl');
            if (!currentUrl) currentUrl = 'https://max.ru/join/4iZVyqiP0gqRg_5fEbgUNtCmUIcKoLas5E_l9hAzkmU';
            link.href = currentUrl;
            link.textContent = 'Открыть канал в Макс →';
        }
    } else {
        if (finalDiv) finalDiv.style.display = 'none';
    }
}

function checkAnswer(index, userAnswer) {
    if (solvedStatus[index]) return true;
    const normalized = userAnswer.trim().toLowerCase();
    const correct = riddles[index].correct;
    if (normalized === correct) {
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
                    setTimeout(() => wrongMsgDiv.innerText = '', 1500);
                }
            });
            input.addEventListener('keypress', (e) => e.key === 'Enter' && checkBtn.click());
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
