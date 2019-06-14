import * as gameboy from './GameBoyCore.js';

const C3 = 44
const Cs3 = 156
const D3 = 262
const Ds3 = 363
const E3 = 457
const F3 = 547
const Fs3 = 631
const G3 = 710
const Gs3 = 786
const A3 = 854
const As3 = 923
const B3 = 986
const C4 = 1046
const Cs4 = 1102
const D4 = 1155
const Ds4 = 1205
const E4 = 1253
const F4 = 1297
const Fs4 = 1339
const G4 = 1379
const Gs4 = 1417
const A4 = 1452
const As4 = 1486
const B4 = 1517
const C5 = 1546
const Cs5 = 1575
const D5 = 1602
const Ds5 = 1627
const E5 = 1650
const F5 = 1673
const Fs5 = 1694
const G5 = 1714
const Gs5 = 1732
const A5 = 1750
const As5 = 1767
const B5 = 1783
const C6 = 1798
const Cs6 = 1812
const D6 = 1825
const Ds6 = 1837
const E6 = 1849
const F6 = 1860
const Fs6 = 1871
const G6 = 1881
const Gs6 = 1890
const A6 = 1899
const As6 = 1907
const B6 = 1915
const C7 = 1923
const Cs7 = 1930
const D7 = 1936
const Ds7 = 1943
const E7 = 1949
const F7 = 1954
const Fs7 = 1959
const G7 = 1964
const Gs7 = 1969
const A7 = 1974
const As7 = 1978
const B7 = 1982
const C8 = 1985
const Cs8 = 1988
const D8 = 1992
const Ds8 = 1995
const E8 = 1998
const F8 = 2001
const Fs8 = 2004
const G8 = 2006
const Gs8 = 2009
const A8 = 2011
const As8 = 2013
const B8 = 2015

const notes = Array(4).fill([C5, D5, E5, D5, C5, G5, B5]).reduce((arr,x)=>arr.concat(x));
let x = 0;
window.requestAnimationFrame(function loop() {
	gameboy.run();
	window.requestAnimationFrame(loop);
	if ((++x)%20===0 || x%20===6) tone(notes.shift())
});

// l vol (-LLL) / r vol (-RRR)
gameboy.memoryHighWrite(0x24, 0b00010001)
// mixer (LLLL RRRR) for (1234)
gameboy.memoryHighWrite(0x25, 0b11111111);

// wave channel
[0x02,0x46,0x8A,0xCE,0xFF,0xFE,0xED,0xDC,0xCB,0xA9,0x87,0x65,0x44,0x33,0x22,0x11].forEach((v, i) => {
	gameboy.memoryHighWrite(0x30+i, v);
});

const tone = (note) => {
	if (note == null) return;
	// duty DD, lenght? LLLLLL
	gameboy.memoryHighWrite(0x16, 0b10111111)
	// start volume VVVV, direction A (+/- =1/0), period PPP
	gameboy.memoryHighWrite(0x17, 0b11110001)
	// pitch low
	gameboy.memoryHighWrite(0x18, note&255);
	// trigger 1, something? 0, --- pitch high HHH
	gameboy.memoryHighWrite(0x19, 0b10000000 + (note>>8))

	// duty DD, lenght? LLLLLL
	gameboy.memoryHighWrite(0x11, 0b11111111)
	// start volume VVVV, direction A (+/- =1/0), period PPP
	gameboy.memoryHighWrite(0x12, 0b10010001)
	// pitch low
	gameboy.memoryHighWrite(0x13, (note+10)&255);
	// trigger 1, something? 0, --- pitch high HHH
	gameboy.memoryHighWrite(0x14, 0b10000000 + (note+10>>8))

	// wav
	// enable channel
	gameboy.memoryHighWrite(0x1a, 0b10000000)
	// sound length
	gameboy.memoryHighWrite(0x1b, 0b11100000)
	// volume -vv-----
	gameboy.memoryHighWrite(0x1c, 0b00100000)

	gameboy.memoryHighWrite(0x1d, note&255);
	// trigger 1, something? 0, --- pitch high HHH
	gameboy.memoryHighWrite(0x1e, 0b11000000 + (note>>8))


	// noise
	gameboy.memoryHighWrite(0x20, 0b00111111)
	gameboy.memoryHighWrite(0x21, 0b01110001)
	gameboy.memoryHighWrite(0x22, 0b00111111)
	gameboy.memoryHighWrite(0x23, 0b10000000);
}
