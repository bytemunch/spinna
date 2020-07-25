const rad2deg = rads => {
    return rads * (180 / Math.PI);
}
export default class Spinner {
    players: string[];
    cnv: HTMLCanvasElement;
    r: number;
    rotation: number = 0;
    spinVelocity: number = 0;
    spinning: boolean = false;
    friction: number;
    playerBounds: any = {};

    clickNoise;

    subscribers: any = {};

    lastTop;

    targetWinner = 5;

    constructor(players: string[], cnv: HTMLCanvasElement) {
        this.players = players;

        let i = 0;
        for (let p of players) {
            const lower = (i / this.players.length) * Math.PI * 2;
            const upper = ((i + 1) / this.players.length) * Math.PI * 2;
            const color = upper;
            this.playerBounds[p] = {
                lower,
                upper,
                color: `hsla(${rad2deg(color)},100%,50%,1)`
            }
            i++;
        }

        this.cnv = cnv;

        this.r = Math.min(cnv.width, cnv.height) / 3;

        this.preload();
    }

    async preload() {
        let soundBlob = await (await fetch('./audio/ding.ogg')).blob();

        let src = URL.createObjectURL(soundBlob);

        this.clickNoise = new Audio();
        this.clickNoise.src = src;
    }

    sub(event, fn) {
        if (!this.subscribers[event]) this.subscribers[event] = [];
        this.subscribers[event].push(fn);
    }

    pub(event, data) {
        if (!this.subscribers[event]) return;
        for (let s of this.subscribers[event]) {
            s(data);
        }
    }

    startSpin() {
        this.spinVelocity = 0.5 + (0.1 * Math.random());
        this.friction = 0.0005 + (0.001 * Math.random());
        this.spinning = true;
    }

    get topSegment() {
        // const currentRot = Math.PI*2 - (this.rotation + ((Math.PI * 2) / this.players.length)) % (Math.PI * 2);
        const currentRot = Math.PI * 2 - (this.rotation + Math.PI / 2) % (Math.PI * 2);
        for (let p of this.players) {
            if (currentRot > this.playerBounds[p].lower && currentRot < this.playerBounds[p].upper) {
                return p;
            }
        }

        return 'Ready!';
    }

    finishSpin() {
        console.log('spin finished!', this.rotation, (this.rotation + (Math.PI / 2) + (Math.PI * 2) / this.players.length) % (Math.PI * 2));

        this.pub('finish', this.topSegment);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.translate(this.cnv.width / 2, this.cnv.height / 2);

        ctx.fillStyle = this.topSegment != 'Ready!' ? this.playerBounds[this.topSegment].color : 'white';
        ctx.font = '30px monospace';

        let tx = ctx.measureText(this.topSegment).width / 2;
        ctx.fillText(this.topSegment, -tx, -this.r - 20);

        ctx.rotate(this.rotation);

        if (this.spinning) {
            if (this.lastTop != this.topSegment) {
                this.pub('spinning', this.topSegment);
                this.lastTop = this.topSegment;
                this.clickNoise.currentTime = 0;
                this.clickNoise.play();
            }

            this.rotation += this.spinVelocity;
            this.spinVelocity -= this.friction * (0.05+this.spinVelocity*3);

            if (this.spinVelocity <= 0.001) {
                this.spinVelocity = 0;
                this.spinning = false;
                this.finishSpin();
            }
        }

        ctx.strokeStyle = 'white';
        for (let p of this.players) {
            ctx.fillStyle = this.playerBounds[p].color;

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, this.r, this.playerBounds[p].lower, this.playerBounds[p].upper);
            ctx.lineTo(0, 0);
            ctx.closePath();

            ctx.fill();
            ctx.stroke();
        }

        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}