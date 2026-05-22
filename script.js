// Список загадок (сложные логические)
const riddles = [
    {
        text: "Что можно разбить, не прикасаясь к нему руками?",
        options: ["Обещание", "Стекло", "Тишину", "Сердце"],
        correct: "Тишину"
    },
    {
        text: "Что становится больше, если его поставить вверх ногами?",
        options: ["Число 6", "Число 8", "Число 9", "Число 0"],
        correct: "Число 6"
    },
    {
        text: "У человека — одно, у вороны — два, у медведя — ни одного. Что это?",
        options: ["Нога", "Глаз", "Буква 'О'", "Клюв"],
        correct: "Буква 'О'"
    },
    {
        text: "Что можно держать, не касаясь его руками?",
        options: ["Дыхание", "Мысль", "Слово", "Разговор"],
        correct: "Дыхание"
    },
    {
        text: "Из какого крана нельзя напиться?",
        options: ["Из подъёмного", "Из водопроводного", "Из пожарного", "Из крана с водой"],
        correct: "Из подъёмного"
    }
];

let solvedStatus = [false, false, false, false, false];

// Загрузка сохранённого прогресса
function loadProgress() {
    const saved = localStorage.getItem('riddlesProgress');
    if (saved) {
        try {
            const arr = JSON.parse(saved);
            if (arr.length === riddles.length) solvedStatus = arr;
        } catch(e) {}
    }
}

// Сохранение прогресса
function saveProgress() {
    localStorage.setItem('riddlesProgress', JSON.stringify(solvedStatus));
}

// Подсчёт решённых и обновление прогресс-бара
function updateProgress() {
    const solvedCount = solvedStatus.filter(v => v === true).length;
    const percent = (solvedCount / riddles.length) * 100;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) progressBar.style.width = percent + '%';
    
    // Показать финальное сообщение, если все решены
    const finalDiv = document.getElementById('finalMessage');
    if (solvedCount === riddles.length) {
        if (finalDiv) finalDiv.style.display = 'block';
        // Установка ссылки на мессенджер Макс (замените на реальную)
        const link = document.getElementById('messengerLink');
        if (link) {
            // ⚠️ ВСТАВЬТЕ РЕАЛЬНУЮ ССЫЛКУ НА КАНАЛ В МЕССЕНДЖЕРЕ MAX
            link.href = 'https://max.ru/ваш_канал';   // ЗАМЕНИТЕ НА РЕАЛЬНУЮ
            link.textContent = 'Открыть канал в Макс →';
        }
    } else {
        if (finalDiv) finalDiv.style.display = 'none';
    }
}

// Отрисовка всех загадок
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
            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'options';
            r.options.forEach(opt => {
                const btn = document.createElement('button');
                btn.innerText = opt;
                btn.className = 'option-btn';
                btn.addEventListener('click', (function(idx, selected) {
                    return function() { checkAnswer(idx, selected); };
                })(i, opt));
                optionsDiv.appendChild(btn);
            });
            card.appendChild(optionsDiv);
        } else {
            const solvedMark = document.createElement('div');
            solvedMark.className = 'solved-mark';
            solvedMark.innerText = '✓ Решено';
            card.appendChild(solvedMark);
        }
        
        container.appendChild(card);
    }
}

// Проверка ответа
function checkAnswer(riddleIndex, selectedAnswer) {
    if (solvedStatus[riddleIndex]) return;
    
    const correct = riddles[riddleIndex].correct;
    if (selectedAnswer === correct) {
        solvedStatus[riddleIndex] = true;
        saveProgress();
        renderRiddles();
        updateProgress();
        
        // Небольшая визуальная вспышка
        const cards = document.querySelectorAll('.riddle-card');
        if (cards[riddleIndex]) {
            cards[riddleIndex].style.transition = '0.2s';
            cards[riddleIndex].style.backgroundColor = '#d9f0d5';
            setTimeout(() => {
                if (cards[riddleIndex]) cards[riddleIndex].style.backgroundColor = '';
            }, 300);
        }
    } else {
        // Эффект неверного ответа
        const btns = document.querySelectorAll(`.riddle-card[data-index='${riddleIndex}'] .option-btn`);
        btns.forEach(btn => {
            if (btn.innerText === selectedAnswer) {
                btn.style.backgroundColor = '#ffdddd';
                btn.style.borderColor = '#c62828';
                setTimeout(() => {
                    btn.style.backgroundColor = '';
                    btn.style.borderColor = '';
                }, 400);
            }
        });
        // Тряска карточки
        const card = document.querySelector(`.riddle-card[data-index='${riddleIndex}']`);
        if (card) {
            card.style.transform = 'translateX(4px)';
            setTimeout(() => { if(card) card.style.transform = ''; }, 150);
        }
    }
}

// Инициализация при загрузке страницы level2.html
document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    renderRiddles();
    updateProgress();
});
