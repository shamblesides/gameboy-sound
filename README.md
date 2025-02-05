APU
===

Want some hardware-accurate Gameboy music and sounds in your HTML5 game or app? Don't want to load megabytes of .mp3 files? [Overwhelmed or frustrated](https://blog.mecheye.net/2017/09/i-dont-know-who-the-web-audio-api-is-designed-for/) by the Web Audio API?

Enter **apu**! This easy-to-use module is a reasonably accurate emulation of the GameBoy's Audio Processing Unit. (APU!) It weighs in at roughly 3 kilobytes. (min + gzip)


Demo
-----

[Try it on StackBlitz!](https://stackblitz.com/edit/gameboy-sound?file=index.js) This demonstrates most of the capabilities and commands.

[Here is another demo](https://stackblitz.com/edit/gameboy-sound-ogirxm?file=index.js) which plays an actual song. [Compare to the original!](https://www.youtube.com/watch?v=junOznRmxmU)


Goals
-----

apu intends to deliver a good balance between size, accuracy, and ease-of-use. Its internals are still fairly accurate to [how the real hardware works](http://gbdev.gg8.se/wiki/articles/Gameboy_sound_hardware), but it omits some of the more obscure behavior. From a user's point of view, it uses an easy-to-read function-based API, rather than retaining the old notion of writing to registers on an APU. A user should be able to make some kind of sound happen with just one `import` statement and one function call.


Browser support
---------------

Not thoroughly tested, but Chrome and Firefox seem good. Safari seems to run, but does not always playback correctly.


Acknowledgments
---------------

This project started as a fork of [Grant Galitz's JavaScript Gameboy emulator](https://github.com/taisel/GameBoy-Online). I wanted to play convincing retro sound effects in the browser and decided that starting from a working emulator might be the best place to start. Grant's emulator was an excellent place to start from; its audio emulation is very accurate, and it was also clearly written with performance in mind.

I stripped out all of the components except the basics required to generate sound (no CPU cycles, no opcodes, no sprites, no interrupts, no joypad, no registers, no ROM...) and refactored it to make it easier to understand (from the perspective of both a user and a contributor) as well as minify better (less duplicate code, no large function prototypes)

Eventually, I rewrote the entire project from scratch. Instead of using the deprecated [ScriptProcessorNode](https://developer.mozilla.org/en-US/docs/Web/API/ScriptProcessorNode), the project now creates various [AudioBufferSourceNodes](https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode) for the different samples, and renders playback to [OfflineAudioContexts](https://developer.mozilla.org/en-US/docs/Web/API/OfflineAudioContext) to loop music playback. Only a dozen or so lines of code from the original project remain. 


License
-------
[MIT](/LICENSE)
