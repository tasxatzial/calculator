'use strict';

/* This is a blocking script required to determine the calculator theme
as quickly as possible. This solves the flashing problem that occurs
when the page loads, and the calculator, which is already styled using
the light theme, needs to be redrawn because the javascript code has
determined that the selected theme is dark. */

/* Both themeKey and darkThemeValue area also defined in script.js.
   Their values need to be synchronized manually */

(function () {
    const themeKey = 'calc-key';
    const darkThemeValue = 'dark';
    
    /* set theme */
    if (localStorage.getItem(themeKey)) {
        if (localStorage.getItem(themeKey) === darkThemeValue) {
            document.documentElement.classList.add('js-dark-theme');
        }
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('js-dark-theme');
    }    
})();
