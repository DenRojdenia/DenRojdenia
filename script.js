// ---------- 5 ОЧЕНЬ СЛОЖНЫХ ЗАГАДОК ----------
const riddles = [
    {
        text: "Что можно разбить, не прикасаясь и не роняя?",
        correct: "тишину"          // исправлено: убрал "|| 'Тишину'"
    },
    {
        text: "Что становится легче, когда его увеличивают?",
        correct: "дыра"            // исправлено: убрал "|| ''"
    },
    {
        text: "Что может путешествовать по всему миру, оставаясь в одном углу?",
        correct: "марка"           // почтовая марка
    },
    {
        text: "У вас есть 9 монет, одна фальшивая (легче). За какое минимальное количество взвешиваний на чашечных весах без гирь вы её найдёте? (Ответ числом)",
        correct: "2"
    },
    {
        text: "Что можно взять в левую руку, но нельзя в правую?",
        correct: "правый локоть"
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
            // !!! ЗАМЕНИТЕ НА РЕАЛЬНУЮ ССЫЛКУ НА КАНАЛ В МЕССЕНДЖЕРЕ MAX !!!
            link.href = 'https://max.ru/join/4iZVyqiP0gqRg_5fEbgUNtCmUIcKoLas5E_l9hAzkmU';
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
                    setTimeout(() => {
                        wrongMsgDiv.innerText = '';
                    }, 1500);
                }
            });
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') checkBtn.click();
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

// ---------- АДМИН-МЕНЮ (вызов из консоли) ----------
window.adminMenu = function() {
    const oldMenu = document.getElementById('adminMenuPanel');
    if (oldMenu) oldMenu.remove();

    const menuDiv = document.createElement('div');
    menuDiv.id = 'adminMenuPanel';
    menuDiv.innerHTML = `
        <div style="background: #1e2a3e; color: white; border-radius: 20px; padding: 15px; position: fixed; bottom: 20px; right: 20px; z-index: 9999; width: 260px; box-shadow: 0 8px 20px rgba(0,0,0,0.3); font-family: system-ui; border: 1px solid #3b82f6;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <strong style="font-size: 1rem;">🔧 Админ-панель</strong>
                <button id="closeAdminMenu" style="background: none; border: none; color: white; font-size: 1.4rem; cursor: pointer;">&times;</button>
            </div>
            <button id="adminResetAll" style="width: 100%; margin-bottom: 8px; background: #c62828; color: white; border: none; padding: 8px; border-radius: 40px; cursor: pointer;">🔄 Сбросить ВСЁ (1+2 этап)</button>
            <button id="adminShowAnswers" style="width: 100%; margin-bottom: 8px; background: #2c5f8a; color: white; border: none; padding: 8px; border-radius: 40px; cursor: pointer;">📖 Показать ответы (консоль)</button>
            <button id="adminResetRiddles" style="width: 100%; margin-bottom: 8px; background: #ff9800; color: white; border: none; padding: 8px; border-radius: 40px; cursor: pointer;">🗑️ Сбросить только загадки (2 этап)</button>
            <button id="adminResetLevel1" style="width: 100%; background: #5c6bc0; color: white; border: none; padding: 8px; border-radius: 40px; cursor: pointer;">📌 Сбросить 1 этап (гранит)</button>
        </div>
    `;
    document.body.appendChild(menuDiv);

    document.getElementById('closeAdminMenu').onclick = () => menuDiv.remove();
    document.getElementById('adminResetAll').onclick = () => {
        localStorage.removeItem('level1_complete');
        localStorage.removeItem('riddlesProgress');
        alert('Полный сброс выполнен. Страница перезагрузится.');
        location.reload();
    };
    document.getElementById('adminShowAnswers').onclick = () => {
        console.clear();
        console.log('%c=== ОТВЕТЫ НА ЗАГАДКИ (2 этап) ===', 'color: #2c5f8a; font-size: 14px;');
        riddles.forEach((r, i) => console.log(`${i+1}: ${r.text} -> "${r.correct}"`));
        alert('Ответы выведены в консоль (F12)');
    };
    document.getElementById('adminResetRiddles').onclick = () => {
        localStorage.removeItem('riddlesProgress');
        alert('Прогресс загадок сброшен. Страница перезагрузится.');
        location.reload();
    };
    document.getElementById('adminResetLevel1').onclick = () => {
        localStorage.removeItem('level1_complete');
        alert('Первый этап сброшен. Перезагрузите страницу.');
        location.reload();
    };
};

console.log('Админ-меню готово. Введите в консоли: adminMenu()');
// Инициализация страницы
document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    renderRiddles();
    updateProgress();
});
