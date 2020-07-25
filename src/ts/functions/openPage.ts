import HomePage from "../pages/home.js";
import SettingsPage from "../pages/settings.js";
import SetupPage from "../pages/setup.js";
import PlayPage from "../pages/play.js";

export const openPage = (page:string, options?:any) => {
    const pages = {
        'home': HomePage,
        'settings':SettingsPage,
        'setup':SetupPage,
        'play':PlayPage
    }
    const content = document.querySelector('#content');

    content.innerHTML = '';

    let pageEl = new pages[page];

    if (options) pageEl.init(options);

    content.appendChild(pageEl);
}