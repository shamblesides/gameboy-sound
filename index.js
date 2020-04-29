import * as gameboy from './lib/GameBoyCore.js';
import vgmURL1 from './vgmtest/friendly_battle.vgm'
import vgmURL2 from './vgmtest/title.vgm'
import { C5, E5, G5, C6 } from './notes.js';

function hit(note) {
	return new Uint8Array([
		// duty DD, lenght? LLLLLL
		0xB3, 0x16-0x10, 0b10111111,
		// start volume VVVV, direction A (+/- =1/0), period PPP
		0xB3, 0x17-0x10, 0b11110001,
		// pitch low
		0xB3, 0x18-0x10, note&0xFF,
		// trigger 1, something? 0, --- pitch high HHH
		0xB3, 0x19-0x10, 0b10000000 + (note>>8),

		// duty DD, lenght? LLLLLL
		0xB3, 0x11-0x10, 0b11111111,
		// start volume VVVV, direction A (+/- =1/0), period PPP
		0xB3, 0x12-0x10, 0b10010001,
		// pitch low
		0xB3, 0x13-0x10, (note+10)&0xFF,
		// trigger 1, something? 0, --- pitch high HHH
		0xB3, 0x14-0x10, 0b10000000 + (note+10>>8),

		// enable channel
		0xB3, 0x1A-0x10, 0b10000000,
		// sound length
		0xB3, 0x1B-0x10, 0b11100000,
		// volume -vv-----
		0xB3, 0x1C-0x10, 0b00100000,

		0xB3, 0x1d-0x10, note&0xFF,
		// trigger 1, something? 0, --- pitch high HHH
		0xB3, 0x1e-0x10, 0b11000000 + (note>>8),


		// noise
		0xB3, 0x20-0x10, 0b00111111,
		0xB3, 0x21-0x10, 0b01110001,
		0xB3, 0x22-0x10, 0b00111111,
		0xB3, 0x23-0x10, 0b10000000,
	]);
}

const successTrack = new Uint8Array([
	// l vol (-LLL) / r vol (-RRR)
	// gameboy.memoryHighWrite(0x24, 0b00010001)
	0xB3, 0x24-0x10, 0b01110111,
	// mixer (LLLL RRRR) for (1234)
	0xB3, 0x25-0x10, 0b11111111,

	// wave channel
	...[
		0x02,0x46,0x8A,0xCE,0xFF,0xFE,0xED,0xDC,0xCB,0xA9,0x87,0x65,0x44,0x33,0x22,0x11
	].map((val, i) => [0xB3, 0x30-0x10+i, val])
	.reduce((arr, x) => arr.concat(x)),

	// song
	... new Array(12).fill().map((_,i) => {
		if (i % 2) {
			const n = ((i-1)%4) ? (2756*2) : (2756*3);
			return [0x61, n & 0xFF, n >> 8];
		} else {
			const note = [C5, , E5, , G5][i%6];
			return hit(note);
		}
	}).reduce((arr,x) => [].concat.apply(arr, x), []),
]);

function addButton(name, fn) {
	const button = document.createElement('button');
	button.innerText = name;
	button.style.cssText = `display: block; width: 200px; margin: 10px auto; padding: 20px 0;`
	button.addEventListener('click', fn);

	document.body.appendChild(button);
}

gameboy.allow();

gameboy.changeUserVolume(0.5);

gameboy.play(successTrack);

const tracks = [vgmURL1, vgmURL2]
.map(url => fetch(url).then(res => res.arrayBuffer()))

addButton('boop', () => gameboy.play(hit(C6)))

Promise.all(tracks).then(loadedFiles => {
	const trackNames = ['Friendly Battle', 'Title']

	loadedFiles.forEach((arrayBuffer, i) => {
		addButton(trackNames[i], () => {
			gameboy.playFile(arrayBuffer);
		});
	})
})

document.body.addEventListener('mousedown', gameboy.allow);
document.body.addEventListener('touchstart', gameboy.allow);
