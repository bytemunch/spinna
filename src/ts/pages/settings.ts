export default class SettingsPage extends HTMLElement {
    h2_title:HTMLHeadingElement;
    btn_newSpinner:HTMLButtonElement;
    btn_settings:HTMLButtonElement;
    constructor() {
        super();

        this.h2_title = document.createElement('h2');
        this.h2_title.textContent = 'settings';

        this.btn_newSpinner = document.createElement('button');
        this.btn_newSpinner.textContent = 'New Spinner';

        this.btn_settings = document.createElement('button');
        this.btn_settings.textContent = 'Settings';
    }

    connectedCallback() {
        this.appendChild(this.h2_title);
        this.appendChild(this.btn_newSpinner);
        this.appendChild(this.btn_settings);
    }
}