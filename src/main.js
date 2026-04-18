import './style.css';
import { init, Terminal } from 'ghostty-web';
import { FitAddon } from 'ghostty-web';
import bashEmulator from 'bash-emulator';
import TextFormatter from './TextFormatter';

let terminal;
let fitAddon;

let emulator;
let buffer = '';

async function sendPrompt() {
	const userStyle = TextFormatter.style(['blue', 'dim']);
	const pwdStyle = TextFormatter.style(['green', 'resetBold']);
	const promptStyle = TextFormatter.style(['brightBlue', 'bold']);
	const resetStyle = TextFormatter.resetStyle();

	const pwd = await emulator.run("pwd");
	terminal.write(`${userStyle}rl@local ${pwdStyle}${pwd}${promptStyle}$${resetStyle} `);
}

function initEmulator() {
	emulator = bashEmulator();
}

async function initTerminal() {
	await init();

	terminal = new Terminal({
		cursorBlink: true,
		fontSize: 14,
		theme: {
			background: '#1e1e1e',
			foreground: '#a9b1d6',
		}
	});

	fitAddon = new FitAddon();
	terminal.loadAddon(fitAddon);

	terminal.open(document.getElementById('terminal-container'));
	fitAddon.fit();
	fitAddon.observeResize();

	// Send initialPrompt
	sendPrompt();

	// Handle window resize for browsers that don't trigger ResizeObserver
	window.addEventListener('resize', () => {
		fitAddon.fit();
	});

	// Handle terminal resize
	terminal.onResize((size) => {
		// TODO: Uh oh idk how this should work.
		// if (websocket && websocket.readyState === WebSocket.OPEN) {
		// 	// Send resize as control sequence (server expects this format)
		// 	websocket.send(JSON.stringify({
		// 		type: 'resize',
		// 		cols: size.cols,
		// 		rows: size.rows
		// 	}));
		// }
		console.log("Resize not supported:", size);
	});

	// Handle user input
	terminal.onData((data) => {
		if (data === '\r') {
			terminal.write('\r\n');

			const line = buffer;
			buffer = '';

			if (line === '') {
				sendPrompt();
				return;
			}

			emulator.run(line).then(
				(output) => {
					if (output)
						terminal.write(output);

					terminal.write('\r\n');
					sendPrompt();
				},
				(error) => {
					terminal.write(String(error));
					terminal.write('\r\n');
					sendPrompt();
				}
			);
		} else if (data === '\x7f') {
			if (buffer.length) {
				buffer = buffer.slice(0, -1);
				terminal.write('\b \b');
			}
		} else {
			terminal.write(data);
			buffer += data;
		}
	});

	// Debug scrollback
	console.log('Terminal scrollback:', terminal.buffer?.scrollback?.length || 'N/A');
	terminal.onScroll((yDisplay) => {
		console.log('Scroll position:', yDisplay);
	});
}

initEmulator();
initTerminal();

