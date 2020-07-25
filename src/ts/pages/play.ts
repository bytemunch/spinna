import Spinner from "../class/spinner.js";
import SpinnerAI from "../class/spinnerAi.js";

export default class PlayPage extends HTMLElement {
    h2_title: HTMLHeadingElement;

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    spinner: Spinner;

    spinnerAi:SpinnerAI;

    initialized = false;
    drawHandle: number;

    btn_spin: HTMLButtonElement;

    p_currentTop: HTMLParagraphElement;

    knockout: boolean;

    constructor() {
        super();

        let content = document.querySelector('#content');
        let bb = content.getBoundingClientRect();

        this.h2_title = document.createElement('h2');
        this.h2_title.textContent = 'play';

        this.p_currentTop = document.createElement('p');
        this.p_currentTop.textContent = 'Let\'s go!';

        this.canvas = document.createElement('canvas');
        let size = Math.min(bb.width, bb.height) - 10;
        this.canvas.width = size;
        this.canvas.height = size;

        this.ctx = this.canvas.getContext('2d');

        this.btn_spin = document.createElement('button');
        this.btn_spin.id = 'spin';
        this.btn_spin.textContent = 'Spin!';

        this.btn_spin.addEventListener('click', e => {
            this.btn_spin.disabled = true;
            // this.spinner.startSpin();
            this.spinnerAi.cheatSpin(3);

            this.spinner.sub('finish', winner => {
                this.btn_spin.disabled = false;
            })
        })

    }

    init(options) {
        console.log(options.players);

        this.knockout = options.knockout;

        this.spinner = new Spinner(options.players, this.canvas);

        this.spinnerAi = new SpinnerAI;

        this.spinnerAi.spinner = this.spinner;

        const onSpinnerFinish = winner => {
            if (this.knockout) {
                options.players.splice(options.players.indexOf(winner), 1);

                this.spinner = new Spinner(options.players, this.canvas);
                this.spinner.sub('finish', onSpinnerFinish);
            }

            console.log(winner);
        }

        this.spinner.sub('finish', onSpinnerFinish)

        this.initialized = true;
    }

    canvasDraw(t: DOMHighResTimeStamp) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.spinner.draw(this.ctx);
        requestAnimationFrame(this.canvasDraw.bind(this));
    }

    connectedCallback() {
        if (!this.initialized) throw new Error('Component not initialized!');
        this.appendChild(this.h2_title);

        this.appendChild(this.p_currentTop);

        this.appendChild(this.canvas)

        this.drawHandle = requestAnimationFrame(this.canvasDraw.bind(this));

        this.appendChild(this.btn_spin);

    }

    disconnectedCallback() {
        cancelAnimationFrame(this.drawHandle);
    }
}