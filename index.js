const form = document.getElementById('timerForm'); // вся форма ввода времени (и заголовок, и поле, и селектор, и кнопка)
const timerInputField = document.getElementById('timeInput'); 
const selector = document.getElementById('selector');
const selectSeconds = selector.options[0];
const selectMinutes = selector.options[1];
const timerShowcaseDiv = document.getElementsByClassName('timerShowcase')[0];
const timerShowcaseMinutes = document.getElementsByClassName('timerShowcase__minutes')[0];
const timerShowcaseColonSign = document.getElementsByClassName('timerShowcase__colonSign')[0];
const timerShowcaseSeconds = document.getElementsByClassName('timerShowcase__seconds')[0];
let timerId;
let time = 0;

function casesCheck() {
    if (timerInputField.value === '1') {
        selectSeconds.text = 'секунда';
        selectMinutes.text = 'минута';
    } else if (timerInputField.value === '2' || timerInputField.value === '3' || timerInputField.value === '4') {
        selectSeconds.text = 'секунды';
        selectMinutes.text = 'минуты';
    } else {
        selectSeconds.text = 'секунд';
        selectMinutes.text = 'минут';
    }
}

function timerCheckAndLaunch(event) {
    event.preventDefault();
    time = parseInt(timerInputField.value);
    // проверяем введенные данные
    if (time === NaN) {
        alert('Задано не число!');
        throw new Error('Задано не число!');
    }
    if (time <= 0) {
        alert('Таймер должен быть положительным!');
        throw new Error('Таймер должен быть положительным!');
    }
    // проверяем единицу измерения, если минуты - то переводим в секунды
    if (selector.selectedIndex === 1) {
        time = time * 60;
    }
    // проверяем, запущен ли таймер
    if (timerId) {
        clearInterval(timerId);
    }
    // запускаем таймер
    startAnimation(); // запускаем анимацию свечения
    updateTimer(); // чтобы не было задержки в одну секунду, а таймер сразу запустился
    timerId = setInterval(updateTimer, 1000); // все остальные - через задержку
}

function startAnimation() {
    timerShowcaseDiv.classList.remove('end');
    if (timerShowcaseDiv.classList.contains('start')) { // если таймер перезаписывается другим таймером то цвет анимации будет другой
        timerShowcaseDiv.classList.remove('start');
        timerShowcaseDiv.classList.add('start1more');
    } else {
        timerShowcaseDiv.classList.remove('start1more');
        timerShowcaseDiv.classList.add('start');
    };
}

function updateTimer() {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    if (minutes === 0 && seconds === 0) {
        timerShowcaseMinutes.textContent = '';
        timerShowcaseColonSign.textContent = 'Обратный отсчет дошел до конца!';
        timerShowcaseSeconds.textContent = '';
        clearInterval(timerId);
        timerShowcaseDiv.classList.remove('start');
        timerShowcaseDiv.classList.remove('start1more');
        timerShowcaseDiv.classList.add('end');
    } else {
        console.log(minutes, seconds);
        timerShowcaseMinutes.textContent = minutes;
        timerShowcaseColonSign.textContent = ':';
        timerShowcaseSeconds.textContent = (seconds < 10) ? ('0' + seconds) : seconds;
        time -= 1;
    }
}

timerInputField.addEventListener('input', casesCheck);
form.onsubmit = timerCheckAndLaunch;