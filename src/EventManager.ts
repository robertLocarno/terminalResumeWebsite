import { Terminal } from "ghostty-web";

import SystemFacade from "./SystemFacade";

class EventManager {
	system: SystemFacade;
	terminal: Terminal;

	constructor(system: SystemFacade) {
		this.system = system;
		this.terminal = system.terminal;
	}

	registerEventListeners() {
		this.terminal.onResize(this.onTerminalResize);
		this.terminal.onData(this.onTerminalData);
	}

	private onTerminalResize = (size: { cols: number, rows: number }) => {
		// TODO: Figure out how this should work.

		console.log("Resize not supported:", size);
	}

	private onTerminalData = (data: string) => {
		// Don't let the user type too early.
		if (!this.system.userInputEnabled) return;

		if (data === '\r') {
			this.terminal.write('\r\n');

			const line = this.system.inputBuffer;
			this.system.inputBuffer = '';

			if (line === '') {
				this.system.sendPrompt();
				return;
			}

			this.system.emulator.run(line).then(
				(output: string) => {
					if (output) {
						this.terminal.write(output);
						this.terminal.write('\r\n');
					}

					this.system.sendPrompt();
				},
				(error: string) => {
					this.terminal.write(String(error));
					this.terminal.write('\r\n');
					this.system.sendPrompt();
				}
			);
		} else if (data === '\x7f') {
			if (this.system.inputBuffer.length) {
				this.system.inputBuffer = this.system.inputBuffer.slice(0, -1);
				this.terminal.write('\b \b');
			}
		} else {
			this.terminal.write(data);
			this.system.inputBuffer += data;
		}
	}
}

export default EventManager;
