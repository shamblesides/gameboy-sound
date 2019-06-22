import * as gameboy from './lib/index.js';
import { C5, E5, G5 } from './lib/index.js';

// gameboy.changeUserVolume(0.5);

// wave channel
gameboy.wave1.setWaveTable([
	0x02,0x46,0x8A,0xCE,0xFF,0xFE,0xED,0xDC,0xCB,0xA9,0x87,0x65,0x44,0x33,0x22,0x11
]);

const tone = (freq) => () => {
	gameboy.resume();

	gameboy.pulse2.play({ freq, duty: 2, volume: 15, fade: 1 })

	gameboy.pulse1.play({ freq: freq+10, duty: 3, volume: 9, fade: 1 })

	gameboy.wave1.play({ freq, length: 32 });

	gameboy.noise1.envelope(7, 1)
	gameboy.noise1.effect(true, 3, 7);
	gameboy.noise1.play();
}

gameboy.play([
	tone(C5),
	0xC0000,
	tone(E5),
	0x80000,
	tone(G5),
	0xC0000,
	tone(C5),
	0x80000,
	tone(E5),
	0xC0000,
	tone(G5),
	0x80000,
])

const colors = ['rgb(255, 238, 0)', 'rgb(255, 138, 0)'];
function mousedown() {
	gameboy.resume();
	const i = colors.indexOf(document.body.style.backgroundColor);
	document.body.style.backgroundColor = colors[(i+1)%colors.length]
	tone(C5)();
}
window.addEventListener('mousedown', mousedown);
window.addEventListener('touchstart', mousedown);
