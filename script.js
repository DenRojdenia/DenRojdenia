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

window.adminMenu = function() {
    const oldMenu = document.getElementById('adminMenuPanel');
    if (oldMenu) oldMenu.remove();
    const menuDiv = document.createElement('div');
    menuDiv.id = 'adminMenuPanel';
    menuDiv.innerHTML = `
        <div style="background: #1e2a3e; color: white; border-radius: 20px; padding: 15px; position: fixed; bottom: 20px; right: 20px; z-index: 9999; width: 300px; box-shadow: 0 8px 20px rgba(0,0,0,0.3); font-family: system-ui; border: 1px solid #3b82f6; max-height: 85vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <strong>🔧 Админ-панель</strong>
                <button id="closeAdminMenu" style="background: none; border: none; color: white; font-size: 1.4rem; cursor: pointer;">&times;</button>
            </div>
            <button id="adminResetAll" style="width:100%; margin-bottom:8px; background:#c62828; color:white; border:none; padding:8px; border-radius:40px;">🔄 Сбросить ВСЁ (1+2+3 этап)</button>
            <button id="adminShowAnswers" style="width:100%; margin-bottom:8px; background:#2c5f8a; color:white; border:none; padding:8px; border-radius:40px;">📖 Показать ответы</button>
            <button id="adminShowProgress" style="width:100%; margin-bottom:8px; background:#3f51b5; color:white; border:none; padding:8px; border-radius:40px;">📊 Показать прогресс</button>
            <button id="adminCompleteAll" style="width:100%; margin-bottom:8px; background:#4caf50; color:white; border:none; padding:8px; border-radius:40px;">⭐ Отметить все загадки решёнными</button>
            <button id="adminChangeLink" style="width:100%; margin-bottom:8px; background:#ff9800; color:white; border:none; padding:8px; border-radius:40px;">🔗 Сменить ссылку на канал</button>
            <button id="adminExport" style="width:100%; margin-bottom:8px; background:#009688; color:white; border:none; padding:8px; border-radius:40px;">💾 Экспорт прогресса</button>
            <button id="adminImport" style="width:100%; margin-bottom:8px; background:#673ab7; color:white; border:none; padding:8px; border-radius:40px;">📂 Импорт прогресса</button>
            <button id="adminResetRiddles" style="width:100%; margin-bottom:8px; background:#ff9800; color:white; border:none; padding:8px; border-radius:40px;">🗑️ Сбросить только загадки</button>
            <button id="adminResetLevel1" style="width:100%; margin-bottom:8px; background:#5c6bc0; color:white; border:none; padding:8px; border-radius:40px;">📌 Сбросить 1 этап (гранит)</button>
            <button id="adminResetClicker" style="width:100%; margin-bottom:8px; background:#f44336; color:white; border:none; padding:8px; border-radius:40px;">🖱️ Сбросить кликер (3 этап)</button>
            <hr style="margin: 10px 0; border-color: #555;">
            <div style="font-size:0.9rem; margin-bottom:8px;">🎮 <strong>Чит-коды для кликера:</strong></div>
            <button id="adminAddPoints" style="width:100%; margin-bottom:6px; background:#ff9800; color:white; border:none; padding:6px; border-radius:40px;">💰 +10 000 очков в кликере</button>
            <button id="adminAddClickPower" style="width:100%; margin-bottom:6px; background:#ff9800; color:white; border:none; padding:6px; border-radius:40px;">⚡ +10 силы клика</button>
            <button id="adminAddAuto" style="width:100%; margin-bottom:6px; background:#ff9800; color:white; border:none; padding:6px; border-radius:40px;">🤖 +5 автокликеров</button>
            <button id="adminUnlockGift" style="width:100%; margin-bottom:6px; background:#ff9800; color:white; border:none; padding:6px; border-radius:40px;">🎁 Открыть подарок (без 1 млн)</button>
        </div>
    `;
    document.body.appendChild(menuDiv);
    document.getElementById('closeAdminMenu').onclick = () => menuDiv.remove();
    
    // Функции обновления localStorage кликера
    function addClickerPoints(amount) {
        let current = parseInt(localStorage.getItem('clickerPoints')) || 0;
        localStorage.setItem('clickerPoints', current + amount);
        alert(`Добавлено ${amount} очков в кликер`);
    }
    function addClickerPower(amount) {
        let current = parseInt(localStorage.getItem('clickPower')) || 1;
        localStorage.setItem('clickPower', current + amount);
        alert(`Сила клика увеличена на ${amount}`);
    }
    function addAutoClickers(amount) {
        let current = parseInt(localStorage.getItem('autoClickers')) || 0;
        localStorage.setItem('autoClickers', current + amount);
        alert(`Добавлено ${amount} автокликеров`);
    }
    function unlockGift() {
        localStorage.setItem('giftBought', 'true');
        alert('Подарок открыт! Теперь на странице кликера будет сообщение.');
    }
    
    document.getElementById('adminResetAll').onclick = () => {
        localStorage.clear();
        alert('Полный сброс. Страница перезагрузится.');
        location.reload();
    };
    document.getElementById('adminShowAnswers').onclick = () => {
        console.clear();
        riddles.forEach((r,i)=>console.log(`${i+1}: ${r.text} -> "${r.correct}"`));
        alert('Ответы в консоли (F12)');
    };
    document.getElementById('adminShowProgress').onclick = () => {
        console.clear();
        console.log(`1 этап: ${localStorage.getItem('level1_complete') === 'true' ? 'пройден' : 'не пройден'}`);
        console.log(`2 этап: ${solvedStatus.filter(v=>v).length}/${riddles.length} загадок`);
        console.log(`3 этап клики: ${localStorage.getItem('clickerPoints') || 0}, сила клика: ${localStorage.getItem('clickPower')||1}, авто: ${localStorage.getItem('autoClickers')||0}/сек`);
        alert('Прогресс в консоли');
    };
    document.getElementById('adminCompleteAll').onclick = () => {
        for(let i=0;i<riddles.length;i++) solvedStatus[i]=true;
        saveProgress(); renderRiddles(); updateProgress();
        alert('Загадки решены');
    };
    document.getElementById('adminChangeLink').onclick = () => {
        let newUrl = prompt('Новая ссылка на канал Макс:', localStorage.getItem('customMessengerUrl')||'');
        if(newUrl) localStorage.setItem('customMessengerUrl',newUrl);
        alert('Ссылка обновлена');
    };
    document.getElementById('adminExport').onclick = () => {
        let data = {
            level1_complete: localStorage.getItem('level1_complete')==='true',
            riddlesProgress: solvedStatus,
            customMessengerUrl: localStorage.getItem('customMessengerUrl')||'',
            clickerPoints: parseInt(localStorage.getItem('clickerPoints'))||0,
            clickPower: parseInt(localStorage.getItem('clickPower'))||1,
            autoClickers: parseInt(localStorage.getItem('autoClickers'))||0,
            giftBought: localStorage.getItem('giftBought')==='true'
        };
        let a=document.createElement('a');
        a.href=URL.createObjectURL(new Blob([JSON.stringify(data)],{type:'application/json'}));
        a.download=`quest_${Date.now()}.json`;
        a.click();
    };
    document.getElementById('adminImport').onclick = () => {
        let inp=document.createElement('input');
        inp.type='file';
        inp.onchange=e=>{
            let file=e.target.files[0];
            if(!file) return;
            let reader=new FileReader();
            reader.onload=ev=>{
                let d=JSON.parse(ev.target.result);
                if(d.level1_complete) localStorage.setItem('level1_complete','true');
                else localStorage.removeItem('level1_complete');
                if(d.riddlesProgress) { solvedStatus=d.riddlesProgress; saveProgress(); }
                if(d.customMessengerUrl) localStorage.setItem('customMessengerUrl',d.customMessengerUrl);
                if(d.clickerPoints) localStorage.setItem('clickerPoints',d.clickerPoints);
                if(d.clickPower) localStorage.setItem('clickPower',d.clickPower);
                if(d.autoClickers) localStorage.setItem('autoClickers',d.autoClickers);
                if(d.giftBought) localStorage.setItem('giftBought','true');
                alert('Импорт выполнен. Перезагрузка...');
                location.reload();
            };
            reader.readAsText(file);
        };
        inp.click();
    };
    document.getElementById('adminResetRiddles').onclick = () => {
        localStorage.removeItem('riddlesProgress'); location.reload();
    };
    document.getElementById('adminResetLevel1').onclick = () => {
        localStorage.removeItem('level1_complete'); location.reload();
    };
    document.getElementById('adminResetClicker').onclick = () => {
        localStorage.removeItem('clickerPoints');
        localStorage.removeItem('clickPower');
        localStorage.removeItem('autoClickers');
        localStorage.removeItem('giftBought');
        alert('Кликер сброшен');
    };
    // Новые кнопки для кликера
    document.getElementById('adminAddPoints').onclick = () => addClickerPoints(10000);
    document.getElementById('adminAddClickPower').onclick = () => addClickerPower(10);
    document.getElementById('adminAddAuto').onclick = () => addAutoClickers(5);
    document.getElementById('adminUnlockGift').onclick = () => unlockGift();
};
document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    renderRiddles();
    updateProgress();
});
