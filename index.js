// переменные
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
let timerAdditional; // ID дополнительного таймера
let time = 0; // переменная времени (в зависимости от введенного пользователем; по умолчанию 0)
let rootVariables = document.documentElement; // все переменные в классе :root в CSS
let progressPercents = 100; // переменная процентов "прогресс-круга" вокруг таймера (по умолчанию 100%, т.е. круг полностью заполнен)

// функции
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
    }
    startAnimation(); // запускаем анимацию свечения
    progressPercents = 100; // подстраховка, если таймер перезапускается, не закончившись, чтобы "прогресс-круг" был полностью заполнен
    updateTimer(); // запускаем основной таймер без сетИнтервал - чтобы не было задержки в одну секунду, а таймер сразу запустился
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
    } else { // если отсчет не дошел до конца
        console.log(minutes, seconds); // показываем минуты и секунды в консоли
        timerShowcaseMinutes.textContent = minutes; // заменяем h1 на оставшееся время в минутах
        timerShowcaseColonSign.textContent = ':'; // h1 с двоеточием
        timerShowcaseSeconds.textContent = (seconds < 10) ? ('0' + seconds) : seconds; // заменяем h1 на оставшееся время в секундах
        // смысл тернарного оператора: если секунд осталось меньше 10, то отображаться секунды будут в формате с ноликом спереди (00~09); если же нет, отображаем как есть
        let previousTimeValue = time; // сохраняем в переменную значение времени до его изменения ниже
        let previousProgressValue = progressPercents; // сохраняем в переменную значение заполненности "прогресс-круга" до его изменения ниже
        rootVariables.style.setProperty('--progress', progressPercents + '%'); // записываем значение заполненности "прогресс-круга" в стиль CSS
        time -= 1; // уменьшаем общее время на единицу
        let newTimeValue = time; // сохраняем в переменную значение времени, уменьшенное на единицу
        let newProgressValue = Math.floor((newTimeValue * previousProgressValue) / previousTimeValue); // сохраняем в переменную новое значение заполненности "прогресс-круга",
        // , пересчитав новое значение в процентах от старого
        progressPercents = newProgressValue; // переписываем значение основной переменной
    }
}

// ход программы
timerInputField.addEventListener('input', casesCheck); // назначаем на ввод времени обратного проверку падежей
form.onsubmit = timerCheckAndLaunch; // при отправке формы запускаем таймер