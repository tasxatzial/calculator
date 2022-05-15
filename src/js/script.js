const lightModeBtn = document.querySelector('.calc-btn-light-theme');
const darkModeBtn = document.querySelector('.calc-btn-dark-theme');
const calc = document.querySelector('.calc');

function changeToLightTheme() {
    if (!calc.classList.contains('js-light-mode')) {
        calc.classList.add('js-light-mode');
        darkModeBtn.classList.remove('calc-btn-active-theme');
        lightModeBtn.classList.add('calc-btn-active-theme');
    } 
}

function changeToDarkTheme() {
    if (calc.classList.contains('js-light-mode')) {
        calc.classList.remove('js-light-mode');
        lightModeBtn.classList.remove('calc-btn-active-theme');
        darkModeBtn.classList.add('calc-btn-active-theme');
    } 
}

(function() {
    lightModeBtn.addEventListener('click', changeToLightTheme);
    darkModeBtn.addEventListener('click', changeToDarkTheme);
})();