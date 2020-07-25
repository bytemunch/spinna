import { openPage } from "./functions/openPage.js";
import { defineCe } from "./functions/defineCe.js";

defineCe();

document.addEventListener('DOMContentLoaded', async () => {
    console.log('YEET');

    await preload();

    openPage('home');
})

const preload = async () => {
    let promises = [];

    // promises.push(fetch('./audio/ding.wav'));

    return promises;
}