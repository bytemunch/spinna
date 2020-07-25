import HomePage from "../pages/home.js"
import PlayPage from "../pages/play.js";
import SettingsPage from "../pages/settings.js";
import SetupPage from "../pages/setup.js";

export const defineCe = () => {
    customElements.define('home-page', HomePage);
    customElements.define('play-page', PlayPage);
    customElements.define('settings-page', SettingsPage);
    customElements.define('setup-page', SetupPage);
}