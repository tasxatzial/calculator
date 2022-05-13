const lightModeBtn = document.querySelector('.calc-btn-light-theme');
const darkModeBtn = document.querySelector('.calc-btn-dark-theme');


function changeToLightTheme() {
    if (!document.documentElement.classList.contains('js-light-mode')) {
        document.documentElement.classList.add('js-light-mode');
        document.documentElement.classList.remove('js-dark-mode');
        darkModeBtn.classList.remove('calc-btn-active-theme');
        lightModeBtn.classList.add('calc-btn-active-theme');
    } 
}

function changeToDarkTheme() {
    if (!document.documentElement.classList.contains('js-dark-mode')) {
        document.documentElement.classList.add('js-dark-mode');
        document.documentElement.classList.remove('js-light-mode');
        lightModeBtn.classList.remove('calc-btn-active-theme');
        darkModeBtn.classList.add('calc-btn-active-theme');
    } 
}

(function() {
    lightModeBtn.addEventListener('click', changeToLightTheme);
    darkModeBtn.addEventListener('click', changeToDarkTheme);
})();