import Spinner from "./spinner.js";

export default class SpinnerAI {
    spinner: Spinner;

    cheatSpin(targetPlayer) {
        if (!this.spinner) {
            console.error('no spinner assigned!');
            return;
        }

        let playerCount = this.spinner.players.length;

        let cheatVals = this.getWinner(playerCount, targetPlayer, this.spinner.rotation);

        this.spinner.friction = cheatVals.friction;
        this.spinner.spinVelocity = cheatVals.startVelocity;
        this.spinner.spinning = true;
    }

    getWinner(playerCount, targetPlayer, currentRotation) {
        if (targetPlayer > playerCount) return { friction: 0.0005 + (0.001 * Math.random()), startVelocity: 0.5 + (0.1 * Math.random()) };
        if (targetPlayer == playerCount) targetPlayer = 0;
        let startVelocity = 0.5;
        let friction = 0.0005;

        let attempts = 0;
        let index = this.newAttempt(playerCount, currentRotation, startVelocity, friction);

        while (index != targetPlayer) {
            friction *= 1.001;
            startVelocity = 0.5;

            index = this.newAttempt(playerCount, currentRotation, startVelocity, friction);
            attempts++;


            while (index != targetPlayer) {
                startVelocity *= 1.001;
                if (startVelocity > 0.6) break;

                index = this.newAttempt(playerCount, currentRotation, startVelocity, friction);
                attempts++;
            }

            if (friction > 0.0015) break;
        }

        console.log('friction:', friction);
        console.log('velocity:', startVelocity);
        console.log('simulations:', attempts);
        console.log('projected:', index);

        return { friction, startVelocity };
    }

    attempt(playerCount, currentRotation, startVelocity, friction) {
        while (startVelocity >= 0) {
            currentRotation += startVelocity;
            startVelocity -= friction;
        }

        // const finalRotation = (currentRotation + (Math.PI / 2) + (Math.PI * 2) / playerCount) % (Math.PI * 2);
        let finalRotation = (currentRotation + (Math.PI / 2) + (Math.PI * 2) / playerCount);
        finalRotation += (Math.PI * 2) / playerCount;
        finalRotation = finalRotation % (Math.PI * 2);
        // const finalRotation = (currentRotation + (Math.PI * 2) / playerCount) % (Math.PI * 2);

        console.log(currentRotation);

        for (let i = 0; i < playerCount; i++) {
            if (finalRotation > (i / playerCount) * Math.PI * 2 && finalRotation < ((i + 1) / playerCount) * Math.PI * 2) {
                console.log('projected:', i);
                return i;
            }
        }
    }

    newAttempt(playerCount, currentRotation, startVelocity, friction) {
        while (startVelocity >= 0.001) {
            currentRotation += startVelocity;
            startVelocity -= friction * (0.05 + startVelocity * 3);
        }

        let finalRotation = Math.PI * 2 - (currentRotation + Math.PI / 2) % (Math.PI*2);
        finalRotation = finalRotation + Math.PI/2;
        finalRotation = finalRotation % (Math.PI*2)

        for (let i = 0; i < playerCount; i++) {
            if (finalRotation > (i / playerCount) * Math.PI * 2 && finalRotation < ((i + 1) / playerCount) * Math.PI * 2) {
                return i;
            }
        }

        console.error('Out of range!', finalRotation);
    }
}