import { init as initTerminal, FitAddon, Terminal } from "ghostty-web";
import bashEmulator from "bash-emulator";

import SystemEvent from "./SystemEvent";
import TextFormatter from "./TextFormatter";
import Bootloader from "./Bootloader";

class SystemFacade {
	static TERMINAL_CONFIG = {
		cursorBlink: true,
		fontSize: 14,
		theme: {
			background: '#1e1e1e',
			foreground: '#e1e8e1',
		}
	};

	terminal: Terminal;
	fitAddon: FitAddon;
	emulator: typeof bashEmulator;
	bootloader: Bootloader;

	eventQueue: SystemEvent[] = [];
	inputBuffer: string = '';

	isReady: boolean = false;

	static async build(): Promise<SystemFacade> {
		// Using a factory method to handle the async initialization of ghostty-web
		await initTerminal();

		return new SystemFacade();
	}

	constructor() {
		this.terminal = this.createTerminal();
		this.fitAddon = this.createFitAddon();
		this.emulator = bashEmulator();
		this.bootloader = new Bootloader(this);

		this.addEventListeners();
		this.bootloader.start();
	}

	// TODO: This needs to be abstracted
	async sendPrompt() {
		const userStyle = TextFormatter.style(['blue', 'dim']);
		const pwdStyle = TextFormatter.style(['green', 'resetBold']);
		const promptStyle = TextFormatter.style(['brightBlue', 'bold']);
		const resetStyle = TextFormatter.resetStyle();

		const pwd = await this.emulator.run("pwd");
		this.terminal.write(`${userStyle}rl@local ${pwdStyle}${pwd}${promptStyle}$${resetStyle} `);
	}

	createTerminal(): Terminal {
		const terminalContainer = document.getElementById('terminal-container');

		if (!terminalContainer) {
			console.error("Terminal Container was not found, exiting.");
			throw new Error("Terminal Container was not found, exiting.");
		}

		const terminal = new Terminal(SystemFacade.TERMINAL_CONFIG);
		terminal.open(terminalContainer);
		
		return terminal;
	}

	createFitAddon(): FitAddon {
		const fitAddon = new FitAddon();
		this.terminal.loadAddon(fitAddon);

		fitAddon.fit();
		fitAddon.observeResize();

		return fitAddon;
	}

	addEventListeners() {
		window.addEventListener('resize', () => {
			if (!this.fitAddon) return;

			this.fitAddon.fit();
		});

		// Handle terminal resize
		this.terminal.onResize((size) => {
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
		this.terminal.onData((data) => {
			if (data === '\r') {
				this.terminal.write('\r\n');

				const line = this.inputBuffer;
				this.inputBuffer = '';

				if (line === '') {
					this.sendPrompt();
					return;
				}

				this.emulator.run(line).then(
					(output: string) => {
						if (output) {
							this.terminal.write(output);
							this.terminal.write('\r\n');
						}

						this.sendPrompt();
					},
					(error: string) => {
						this.terminal.write(String(error));
						this.terminal.write('\r\n');
						this.sendPrompt();
					}
				);
			} else if (data === '\x7f') {
				if (this.inputBuffer.length) {
					this.inputBuffer = this.inputBuffer.slice(0, -1);
					this.terminal.write('\b \b');
				}
			} else {
				this.terminal.write(data);
				this.inputBuffer += data;
			}
		});
	}

	enqueueEvent(event: SystemEvent) {
		this.eventQueue.push(event);
	}

	startEvents() {
		this.startNextEvent();
	}

	startNextEvent() {
		const nextEvent = this.eventQueue.shift();

		if (!nextEvent) return;

		setTimeout(
			async () => {
				nextEvent.func();
				this.startNextEvent();
			},
			nextEvent.delayMs,
		)
	}
}

export default SystemFacade;
