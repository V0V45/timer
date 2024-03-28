/* ПЕРЕМЕННЫЕ 
Данный блок кода содержит все исходные значения переменных и их описание */

const form = document.getElementById('timerForm'); // вся форма ввода времени (и заголовок, и поле, и селектор, и кнопка)
const timerInputField = document.getElementById('timeInput'); // поле ввода времени
const selector = document.getElementById('selector'); // меню выбора единицы измерения
const selectSeconds = selector.options[0]; // единица измерения - секунды
const selectMinutes = selector.options[1]; // единица измерения - минуты
const timerShowcaseDiv = document.getElementsByClassName('timerShowcase')[0]; // раздел, где находится таймер
const timerShowcaseMinutes = document.getElementsByClassName('timerShowcase__minutes')[0]; // h1 с минутами
const timerShowcaseColonSign = document.getElementsByClassName('timerShowcase__colonSign')[0]; // h1 с двоеточием
const timerShowcaseSeconds = document.getElementsByClassName('timerShowcase__seconds')[0]; // h1 с секундами
let timerMain; // ID основного таймера
let time = 0; // переменная времени (в зависимости от введенного пользователем; по умолчанию 0)
let rootVariables = document.documentElement; // все переменные в классе :root в CSS
let circleStarted = null; // информация о том, запустился ли таймер или нет (для анимации кружка)
let animationTime; // общее неизменяющееся время таймера (для анимации кружка)
const percent = 100; // константа для перевода значения в проценты (для анимации кружка)
let stopID; // ID анимации (requestAnimationFrame) для ее дальнейшей остановки

/* ФУНКЦИИ
Данный блок кода содержит все функции и их описание */

function casesCheck() { // функция проверки падежей
    // если введенное число оканчивается на 11, то падеж не меняется
    if (timerInputField.value[timerInputField.value.length - 2] === '1' && timerInputField.value[timerInputField.value.length - 1] === '1') {
        selectSeconds.text = 'секунд';
        selectMinutes.text = 'минут';
    // если введенное число оканчивается на 12, то падеж не меняется
    } else if (timerInputField.value[timerInputField.value.length - 2] === '1' && timerInputField.value[timerInputField.value.length - 1] === '2') {
        selectSeconds.text = 'секунд';
        selectMinutes.text = 'минут';
    // если введенное число оканчивается на 13, то падеж не меняется
    } else if (timerInputField.value[timerInputField.value.length - 2] === '1' && timerInputField.value[timerInputField.value.length - 1] === '3') {
        selectSeconds.text = 'секунд';
        selectMinutes.text = 'минут';
    // если введенное число оканчивается на 14, то падеж не меняется
    } else if (timerInputField.value[timerInputField.value.length - 2] === '1' && timerInputField.value[timerInputField.value.length - 1] === '4') {
        selectSeconds.text = 'секунд';
        selectMinutes.text = 'минут';
    // в остальных случаях
    } else {
        // если введенное число оканчивается на 1, то падеж меняется
        if (timerInputField.value[timerInputField.value.length - 1] === '1') {
            selectSeconds.text = 'секунда';
            selectMinutes.text = 'минута';
        // если введенное число оканчивается на 2, 3 или 4 то падеж меняется
        } else if (timerInputField.value[timerInputField.value.length - 1] === '2' || timerInputField.value[timerInputField.value.length - 1] === '3' || timerInputField.value[timerInputField.value.length - 1] === '4') {
            selectSeconds.text = 'секунды';
            selectMinutes.text = 'минуты';
        // если не подошло ни под одно исключение, падеж не меняется
        } else {
            selectSeconds.text = 'секунд';
            selectMinutes.text = 'минут';
        }
    }
}

function timerCheckAndLaunch(event) { // функция запуска таймера
    event.preventDefault(); // удаляем стандартное действие отправки формы
    time = parseInt(timerInputField.value); // извлекаем время из введенных в поле ввода данных (преобразуем в int)
    // проверяем введенные данные
    if (time === NaN) { // если не удалось перевести данные из поля ввода из String в int, то бросаем ошибку
        alert('Задано не число!');
        throw new Error('Задано не число!');
    }
    if (time <= 0) { // если время задано меньше нуля, то бросаем ошибку
        alert('Таймер должен быть положительным!');
        throw new Error('Таймер должен быть положительным!');
    }
    // проверяем единицу измерения, если минуты - то переводим в секунды
    if (selector.selectedIndex === 1) {
        time = time * 60; // 60 секунд в одной минуте
    }
    // проверяем, запущен ли таймер
    if (timerMain) {
        clearInterval(timerMain); // если запущен то вырубаем старый
        resetCircleProgress();
    }
    startAnimation(); // запускаем анимацию свечения
    updateTimer(); // запускаем основной таймер без сетИнтервал - чтобы не было задержки в одну секунду, а таймер сразу запустился
    animationTime = time + 1; // записываем в переменную значение общего времени таймера в секундах с учетом отсутствия задержки в 1 с
    requestAnimationFrame(animateCircle); // запускаем первый кадр анимации animateCircle, все последующие запустятся по рекурсии
    timerMain = setInterval(updateTimer, 1000); // все остальные запуски будут производится через задержку в 1 с
}

function startAnimation() { // анимация свечения
    timerShowcaseDiv.classList.remove('end');
    if (timerShowcaseDiv.classList.contains('start')) { // если таймер перезаписывается другим таймером то цвет анимации будет другой
        timerShowcaseDiv.classList.remove('start');
        timerShowcaseDiv.classList.add('start1more');
    } else {
        timerShowcaseDiv.classList.remove('start1more');
        timerShowcaseDiv.classList.add('start');
    };
}

function updateTimer() { // основной таймер
    let minutes = Math.floor(time / 60); // извлекаем из заданного времени минуты
    let seconds = time % 60; // извлекаем из заданного времени секунды
    if (minutes === 0 && seconds === 0) { // когда отсчет дойдет до конца
        timerShowcaseMinutes.textContent = ''; // убираем минуты
        timerShowcaseColonSign.textContent = 'Обратный отсчет дошел до конца!'; // выводим сообщение вместо двоеточия
        timerShowcaseSeconds.textContent = ''; // убираем секунды
        clearInterval(timerMain); // выключаем основной таймер
        timerShowcaseDiv.classList.remove('start'); // удаляем все классы, связанные с анимацией запуска
        timerShowcaseDiv.classList.remove('start1more');
        timerShowcaseDiv.classList.add('end'); // добавляем анимацию окончания
        resetCircleProgress(); // сбрасываем прогресс анимации круга
    } else { // если отсчет не дошел до конца
        // console.log(minutes, seconds); // показываем минуты и секунды в консоли - код для отладки
        // console.log(time); // код для отладки
        timerShowcaseMinutes.textContent = minutes; // заменяем h1 на оставшееся время в минутах
        timerShowcaseColonSign.textContent = ':'; // h1 с двоеточием
        timerShowcaseSeconds.textContent = (seconds < 10) ? ('0' + seconds) : seconds; // заменяем h1 на оставшееся время в секундах
        // смысл тернарного оператора: если секунд осталось меньше 10, то отображаться секунды будут в формате с ноликом спереди (00~09); если же нет, отображаем как есть
        time -= 1; // уменьшаем общее время на единицу
    }
}


function animateCircle(timestamp) { // анимация кружка вокруг таймера
    // timestamp - время с начала запуска страницы, в мс
    // если таймер еще не был запущен, то записываем в circleStarted время запуска таймера
    if (!circleStarted) {
        circleStarted = timestamp;
    }
    // прогресс равен разнице времени между запуском страницы и запуском таймера, деленное на общее время таймера, переведенное в мс
    // т.е. переменная прогресс - это величина от 0 до 1, сообщающая о том, насколько анимация дошла до конца (0 - только началась, 1 - закончилась)
    let progress = (timestamp - circleStarted) / (animationTime * 1000);
    // переменная circle - это просто прогресс, переведенный в проценты, чтобы круг заполнялся вместе с таймером
    let circle = progress * percent;
    // обращаемся к css-переменной, отвечающей за прогресс круга, и меняем ее значение
    rootVariables.style.setProperty('--progress', circle.toString() + '%');
    // ниже код для отладки
    // console.log(`timestamp: ${timestamp}, circleStarted: ${circleStarted}, progress: ${progress}, circle: ${circle}`);
    // если прогресс еще не достиг единицы, то даем еще один кадр
    if (progress < 1) {
        stopID = requestAnimationFrame(animateCircle); // даем ID последнему кадру
    }
}

function resetCircleProgress() { // сброс анимации кружка
    circleStarted = null; // обнуляем переменную, обозначающую что таймер не был запущен
    rootVariables.style.setProperty('--progress', '100%'); // возвращаем css переменную прогресса кружка в исходное значение
    cancelAnimationFrame(stopID); // перестаем создавать кадры
}



/* ЗАПУСК
Данный блок кода содержит команды, которые исполняются сразу же при загрузке js-файла браузером */

timerInputField.addEventListener('input', casesCheck); // назначаем на ввод времени обратного проверку падежей
form.onsubmit = timerCheckAndLaunch; // при отправке формы запускаем таймер