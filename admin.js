// ========== УНИВЕРСАЛЬНАЯ АДМИН-ПАНЕЛЬ ==========
// Работает на index.html, level2.html, clicker.html
// Вызов: через консоль adminMenu() или секретный жест (долгое нажатие на заголовок h1)

(function() {
    // Функция для создания/показа меню
    window.adminMenu = function() {
        const oldMenu = document.getElementById('adminMenuPanel');
        if (oldMenu) oldMenu.remove();

        const menuDiv = document.createElement('div');
        menuDiv.id = 'adminMenuPanel';
        menuDiv.innerHTML = `
            <div style="background: #1e2a3e; color: white; border-radius: 20px; padding: 15px; position: fixed; bottom: 20px; right: 20px; z-index: 9999; width: 300px; box-shadow: 0 8px 20px rgba(0,0,0,0.3); font-family: system-ui; border: 1px solid #3b82f6; max-height: 80vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <strong>🔧 Админ-панель</strong>
                    <button id="closeAdminMenu" style="background: none; border: none; color: white; font-size: 1.4rem; cursor: pointer;">&times;</button>
                </div>
                
                <div style="margin-bottom: 12px; border-top: 1px solid #555; padding-top: 8px;">
                    <strong>📊 Общий сброс</strong>
                    <button id="adminResetAll" style="width:100%; margin-top:5px; background:#c62828; padding:6px; border-radius:40px;">🔄 Сбросить ВСЁ (1+2+3 этап)</button>
                </div>

                <div style="margin-bottom: 12px; border-top: 1px solid #555; padding-top: 8px;">
                    <strong>📖 Прогресс и ответы</strong>
                    <button id="adminShowAnswers" style="width:100%; margin-bottom:5px; background:#2c5f8a; padding:6px; border-radius:40px;">📖 Показать ответы (консоль)</button>
                    <button id="adminShowProgress" style="width:100%; background:#3f51b5; padding:6px; border-radius:40px;">📊 Показать прогресс (консоль)</button>
                </div>

                <div style="margin-bottom: 12px; border-top: 1px solid #555; padding-top: 8px;">
                    <strong>🎮 Читы для кликера (3 этап)</strong>
                    <div style="display: flex; gap: 5px; margin-bottom: 5px;">
                        <input type="number" id="cheatPoints" placeholder="Очки" style="flex:1; background:#333; color:white; border:1px solid #888; padding:5px; border-radius:20px;">
                        <button id="addPointsBtn" style="background:#4caf50; padding:5px 10px;">➕ Добавить</button>
                    </div>
                    <div style="display: flex; gap: 5px; margin-bottom: 5px;">
                        <input type="number" id="cheatClickPower" placeholder="Сила клика (+)" style="flex:1; background:#333; color:white; border:1px solid #888; padding:5px; border-radius:20px;">
                        <button id="addClickPowerBtn" style="background:#ff9800; padding:5px 10px;">⚡ Добавить</button>
                    </div>
                    <div style="display: flex; gap: 5px; margin-bottom: 5px;">
                        <input type="number" id="cheatAuto" placeholder="Автокликеры (+)" style="flex:1; background:#333; color:white; border:1px solid #888; padding:5px; border-radius:20px;">
                        <button id="addAutoBtn" style="background:#ff9800; padding:5px 10px;">🤖 Добавить</button>
                    </div>
                    <button id="unlockGiftBtn" style="width:100%; background:#ffd700; color:#000; margin-top:5px; padding:6px; border-radius:40px;">🎁 Открыть подарок (без очков)</button>
                </div>

                <div style="margin-bottom: 12px; border-top: 1px solid #555; padding-top: 8px;">
                    <strong>🗑️ Сброс по этапам</strong>
                    <button id="adminResetLevel1" style="width:100%; margin-bottom:5px; background:#5c6bc0; padding:6px; border-radius:40px;">📌 Сбросить 1 этап (гранит)</button>
                    <button id="adminResetRiddles" style="width:100%; margin-bottom:5px; background:#ff9800; padding:6px; border-radius:40px;">🗑️ Сбросить загадки (2 этап)</button>
                    <button id="adminResetClicker" style="width:100%; background:#f44336; padding:6px; border-radius:40px;">🖱️ Сбросить кликер (3 этап)</button>
                </div>

                <div style="margin-bottom: 12px; border-top: 1px solid #555; padding-top: 8px;">
                    <strong>💾 Резервное копирование</strong>
                    <button id="adminExport" style="width:100%; margin-bottom:5px; background:#009688; padding:6px; border-radius:40px;">💾 Экспорт прогресса (файл)</button>
                    <button id="adminImport" style="width:100%; background:#673ab7; padding:6px; border-radius:40px;">📂 Импорт прогресса</button>
                </div>
            </div>
        `;
        document.body.appendChild(menuDiv);

        // Закрытие
        document.getElementById('closeAdminMenu').onclick = () => menuDiv.remove();

        // --- Функции ---
        // Сброс всего
        document.getElementById('adminResetAll').onclick = () => {
            localStorage.clear();
            alert('Полный сброс выполнен. Страница перезагрузится.');
            location.reload();
        };
        // Показать ответы на загадки
        document.getElementById('adminShowAnswers').onclick = () => {
            if (typeof riddles !== 'undefined') {
                console.clear();
                console.log('%c=== ОТВЕТЫ НА ЗАГАДКИ (2 этап) ===', 'color: #2c5f8a; font-size: 14px;');
                riddles.forEach((r, i) => console.log(`${i+1}: ${r.text} -> "${r.correct}"`));
                alert('Ответы выведены в консоль (F12)');
            } else {
                alert('На этой странице нет загадок. Перейдите на level2.html');
            }
        };
        // Показать прогресс
        document.getElementById('adminShowProgress').onclick = () => {
            const level1 = localStorage.getItem('level1_complete') === 'true';
            const riddlesSolved = (typeof solvedStatus !== 'undefined') ? solvedStatus.filter(v=>v).length : 'N/A';
            const points = parseInt(localStorage.getItem('clickerPoints')) || 0;
            const clickPower = parseInt(localStorage.getItem('clickPower')) || 1;
            const auto = parseInt(localStorage.getItem('autoClickers')) || 0;
            const gift = localStorage.getItem('giftBought') === 'true';
            console.clear();
            console.log('%c=== ТЕКУЩИЙ ПРОГРЕСС ===', 'color: #3f51b5; font-size: 14px;');
            console.log(`1 этап (гранит): ${level1 ? 'пройден ✅' : 'не пройден ❌'}`);
            console.log(`2 этап (загадки): решено ${riddlesSolved} из ${typeof riddles !== 'undefined' ? riddles.length : '?'}`);
            console.log(`3 этап: очки=${points}, сила клика=${clickPower}, автокликеры=${auto}, подарок=${gift ? 'куплен' : 'не куплен'}`);
            alert('Прогресс в консоли (F12)');
        };
        // Читы для кликера
        document.getElementById('addPointsBtn').onclick = () => {
            let val = parseInt(document.getElementById('cheatPoints').value);
            if (isNaN(val)) val = 0;
            let cur = parseInt(localStorage.getItem('clickerPoints')) || 0;
            localStorage.setItem('clickerPoints', cur + val);
            alert(`Добавлено ${val} очков. Обновите страницу кликера, чтобы увидеть изменения.`);
        };
        document.getElementById('addClickPowerBtn').onclick = () => {
            let val = parseInt(document.getElementById('cheatClickPower').value);
            if (isNaN(val)) val = 0;
            let cur = parseInt(localStorage.getItem('clickPower')) || 1;
            let upgradeCount = parseInt(localStorage.getItem('clickUpgradeCount')) || 0;
            localStorage.setItem('clickPower', cur + val);
            localStorage.setItem('clickUpgradeCount', upgradeCount + val);
            alert(`Сила клика увеличена на ${val}. Обновите страницу кликера.`);
        };
        document.getElementById('addAutoBtn').onclick = () => {
            let val = parseInt(document.getElementById('cheatAuto').value);
            if (isNaN(val)) val = 0;
            let cur = parseInt(localStorage.getItem('autoClickers')) || 0;
            let upgradeCount = parseInt(localStorage.getItem('autoUpgradeCount')) || 0;
            localStorage.setItem('autoClickers', cur + val);
            localStorage.setItem('autoUpgradeCount', upgradeCount + val);
            alert(`Добавлено ${val} автокликеров. Обновите страницу кликера.`);
        };
        document.getElementById('unlockGiftBtn').onclick = () => {
            localStorage.setItem('giftBought', 'true');
            alert('Подарок открыт! На странице кликера появится сообщение о подарке за картиной.');
        };
        // Сброс по этапам
        document.getElementById('adminResetLevel1').onclick = () => {
            localStorage.removeItem('level1_complete');
            alert('Первый этап сброшен. Перезагрузите страницу.');
            location.reload();
        };
        document.getElementById('adminResetRiddles').onclick = () => {
            localStorage.removeItem('riddlesProgress');
            alert('Загадки сброшены. Перезагрузите страницу.');
            location.reload();
        };
        document.getElementById('adminResetClicker').onclick = () => {
            localStorage.removeItem('clickerPoints');
            localStorage.removeItem('clickPower');
            localStorage.removeItem('autoClickers');
            localStorage.removeItem('clickUpgradeCount');
            localStorage.removeItem('autoUpgradeCount');
            localStorage.removeItem('giftBought');
            alert('Кликер сброшен. Перезагрузите страницу кликера.');
            if (window.location.pathname.includes('clicker.html')) location.reload();
        };
        // Экспорт/Импорт
        document.getElementById('adminExport').onclick = () => {
            const data = {
                level1_complete: localStorage.getItem('level1_complete') === 'true',
                riddlesProgress: localStorage.getItem('riddlesProgress'),
                clickerPoints: localStorage.getItem('clickerPoints'),
                clickPower: localStorage.getItem('clickPower'),
                autoClickers: localStorage.getItem('autoClickers'),
                clickUpgradeCount: localStorage.getItem('clickUpgradeCount'),
                autoUpgradeCount: localStorage.getItem('autoUpgradeCount'),
                giftBought: localStorage.getItem('giftBought') === 'true',
                customMessengerUrl: localStorage.getItem('customMessengerUrl')
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `quest_backup_${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(a.href);
            alert('Прогресс сохранён в файл.');
        };
        document.getElementById('adminImport').onclick = () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/json';
            input.onchange = e => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = ev => {
                    try {
                        const d = JSON.parse(ev.target.result);
                        if (d.level1_complete) localStorage.setItem('level1_complete', 'true');
                        else localStorage.removeItem('level1_complete');
                        if (d.riddlesProgress) localStorage.setItem('riddlesProgress', d.riddlesProgress);
                        if (d.clickerPoints) localStorage.setItem('clickerPoints', d.clickerPoints);
                        if (d.clickPower) localStorage.setItem('clickPower', d.clickPower);
                        if (d.autoClickers) localStorage.setItem('autoClickers', d.autoClickers);
                        if (d.clickUpgradeCount) localStorage.setItem('clickUpgradeCount', d.clickUpgradeCount);
                        if (d.autoUpgradeCount) localStorage.setItem('autoUpgradeCount', d.autoUpgradeCount);
                        if (d.giftBought) localStorage.setItem('giftBought', 'true');
                        if (d.customMessengerUrl) localStorage.setItem('customMessengerUrl', d.customMessengerUrl);
                        alert('Импорт выполнен. Перезагрузка...');
                        location.reload();
                    } catch(err) {
                        alert('Ошибка: неверный файл');
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        };
    };

    // ========== СКРЫТЫЙ ВЫЗОВ НА ТЕЛЕФОНЕ ==========
    // Долгое нажатие (3 секунды) на заголовок h1 открывает админ-панель
    function setupHiddenTrigger() {
        const headers = document.querySelectorAll('h1');
        if (headers.length === 0) return;
        let touchTimer = null;
        headers.forEach(h1 => {
            h1.addEventListener('touchstart', (e) => {
                touchTimer = setTimeout(() => {
                    if (window.adminMenu) {
                        window.adminMenu();
                        alert('🔧 Админ-панель открыта (долгое нажатие)');
                    }
                    touchTimer = null;
                }, 3000);
            });
            h1.addEventListener('touchend', () => {
                if (touchTimer) clearTimeout(touchTimer);
            });
            h1.addEventListener('touchcancel', () => {
                if (touchTimer) clearTimeout(touchTimer);
            });
            // Для мыши (тестирование на ПК) – тоже долгое нажатие
            h1.addEventListener('mousedown', () => {
                touchTimer = setTimeout(() => {
                    if (window.adminMenu) {
                        window.adminMenu();
                        alert('🔧 Админ-панель открыта (долгое нажатие)');
                    }
                    touchTimer = null;
                }, 3000);
            });
            h1.addEventListener('mouseup', () => {
                if (touchTimer) clearTimeout(touchTimer);
            });
        });
    }

    // Инициализация после загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupHiddenTrigger);
    } else {
        setupHiddenTrigger();
    }

    console.log('Админ-панель готова. Вызов: adminMenu() или долгое нажатие на заголовок (3 сек)');
})();
