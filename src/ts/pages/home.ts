import { openPage } from "../functions/openPage.js";

export default class HomePage extends HTMLElement {
    h1_title:HTMLHeadingElement;
    btn_newSpinner:HTMLButtonElement;
    btn_settings:HTMLButtonElement;
    constructor() {
        super();

        this.h1_title = document.createElement('h1');
        this.h1_title.textContent = 'spinner';

        this.btn_newSpinner = document.createElement('button');
        this.btn_newSpinner.textContent = 'New Spinner';
        this.btn_newSpinner.addEventListener('click', e=>openPage('setup'));

        this.btn_settings = document.createElement('button');
        this.btn_settings.textContent = 'Settings';
        this.btn_settings.addEventListener('click', e=>openPage('settings'));
    }

    connectedCallback() {
        this.appendChild(this.h1_title);
        this.appendChild(this.btn_newSpinner);
        this.appendChild(this.btn_settings);
    }
}