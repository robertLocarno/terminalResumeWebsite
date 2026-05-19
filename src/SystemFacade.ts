import { init as initTerminal, FitAddon, Terminal } from "ghostty-web";
import bashEmulator from "bash-emulator";

import SystemEvent from "./SystemEvent";
import TextFormatter from "./TextFormatter";
import Bootloader from "./Bootloader";
import WebGLCanvasManager from "./WebGLCanvasManager";
import EventManager from "./EventManager";

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
	eventManager: EventManager;
	webGLCanvasManager: WebGLCanvasManager;

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
		this.eventManager = new EventManager(this);

		this.webGLCanvasManager = new WebGLCanvasManager(this);
		this.webGLCanvasManager.startPostProcessing();

		this.eventManager.registerEventListeners();
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

	enqueueEvent(event: SystemEvent) {
		this.eventQueue.push(event);
	}

	startEvents() {
		this.startNextEvent();
	}

	startNextEvent() {
		const nextEvent = this.eventQueue.shift();

		if (!nextEvent) return;

		// Delay + chaining
		// onComplete kicks off the next event, which is then delayed via setTimeout
		setTimeout(
			() => {
				nextEvent.func({ onComplete: () => {
					this.startNextEvent();
				}});
			},
			nextEvent.delayMs,
		)
	}
}

export default SystemFacade;
