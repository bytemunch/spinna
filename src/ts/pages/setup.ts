import { openPage } from "../functions/openPage.js";

export default class SetupPage extends HTMLElement {
    h2_title: HTMLHeadingElement;

    inputs: HTMLInputElement[];

    div_inputs: HTMLDivElement;

    btn_start: HTMLButtonElement;

    constructor() {
        super();

        this.h2_title = document.createElement('h2');
        this.h2_title.textContent = 'new spinner';

        this.div_inputs = document.createElement('div');
        this.div_inputs.id = 'inputs';

        this.addInput();

        this.btn_start = document.createElement('button');
        this.btn_start.textContent = 'start';
        this.btn_start.id = 'start';
        this.btn_start.disabled = true;
        this.btn_start.addEventListener('click', e => this.setupGame());
    }

    addInput() {
        let n = document.createElement('p');
        n.classList.add('number');
        n.textContent = '1';

        let i = document.createElement('input');
        i.placeholder = "Add item...";

        let br = document.createElement('br');

        i.addEventListener('change', e => {
            let inputs = this.div_inputs.querySelectorAll('input');

            let lastInput = inputs[inputs.length - 1];

            if (i.value) {
                if (lastInput.value) this.addInput().focus();
            } else {
                this.div_inputs.removeChild(i);
                this.div_inputs.removeChild(n);
                this.div_inputs.removeChild(br);

                //rerack numbers
                let j = 1;
                for (let num of document.querySelectorAll('.number')) {
                    num.textContent = j.toString();
                    j++;
                }
            }

            if (this.duplicateCheck() || inputs.length < 2) {
                this.btn_start.disabled = true;
            } else {
                this.btn_start.disabled = false;
            }
        })

        this.div_inputs.appendChild(n);
        this.div_inputs.appendChild(i);
        this.div_inputs.appendChild(br);

        let j = 1;
        for (let num of document.querySelectorAll('.number')) {
            num.textContent = j.toString();
            j++;
        }

        return i;
    }

    duplicateCheck() {
        let inputs = this.div_inputs.querySelectorAll('input');

        let values = [];

        let duplicates = false;

        for (let i of inputs) {
            i.classList.remove('duplicate');

            let v = i.value.toUpperCase();

            let vi = values.indexOf(v);

            if (vi != -1) {
                if (!v) {
                    // this.div_inputs.removeChild(i);
                    // this.div_inputs.removeChild(this.div_inputs.querySelectorAll('.number')[vi])
                    // this.div_inputs.removeChild(this.div_inputs.querySelectorAll('br')[vi])
                } else {
                    i.classList.add('duplicate');
                    inputs[vi].classList.add('duplicate');
                    duplicates = true;
                }
            }

            values.push(v);
        }

        return duplicates;
    }

    setupGame() {
        let pl = [];
        Array.from(this.div_inputs.querySelectorAll('input')).forEach((v) => { if (v.value) pl.push(v.value) });
        openPage('play', {players:pl, knockout:false});
    }

    connectedCallback() {
        this.appendChild(this.h2_title);

        this.appendChild(this.div_inputs);

        this.appendChild(this.btn_start);

    }
}