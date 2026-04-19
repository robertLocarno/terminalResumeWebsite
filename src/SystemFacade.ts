import { init as initTerminal, FitAddon, Terminal } from "ghostty-web";
import bashEmulator from "bash-emulator";

import SystemEvent from "./SystemEvent";
import TextFormatter from "./TextFormatter";
import Bootloader from "./Bootloader";

import crtFragSrc from "./shaders/crt.frag.glsl?raw";
import passthroughVertSrc from "./shaders/passthrough.vert.glsl?raw";

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

		this.attachWebGLCanvas();
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

	attachWebGLCanvas() {
		const terminalContainer = document.getElementById('terminal-container');
		const terminalCanvas = terminalContainer?.querySelector('canvas');

		if (!terminalContainer || !terminalCanvas) {
			console.error("No terminal canvas found, skipping WebGL Canvas initialization");
			return;
		}

		terminalCanvas.classList.add('terminal-canvas');

		const webGLCanvas = document.createElement('canvas');
		webGLCanvas.classList.add('webgl-canvas');

		const gl = webGLCanvas.getContext('webgl2');

		if (!gl) {
			console.error("Browser does not support WebGL, skipping WebGL canvas initialization");
			return;
		}

		terminalContainer.appendChild(webGLCanvas);

		const buildProgram = (gl: WebGL2RenderingContext, vertSrc: string, fragSrc: string): WebGLProgram => {
			const compile = (type: GLenum, src: string) => {
				const shader = gl.createShader(type);

				if (!shader) {
					throw new Error("Unable to create shader");
				}

				gl.shaderSource(shader, src);
				gl.compileShader(shader);

				if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
					throw new Error("Unable to create shader", { cause: gl.getShaderInfoLog(shader) });
				}
				
				return shader;
			}

			const vertexShader = compile(gl.VERTEX_SHADER, vertSrc);
			const fragmentShader = compile(gl.FRAGMENT_SHADER, fragSrc);

			const program: WebGLProgram = gl.createProgram();
			gl.attachShader(program, vertexShader);
			gl.attachShader(program, fragmentShader);
			gl.linkProgram(program);

			if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
				throw new Error("Unable to link shader program", { cause: gl.getProgramInfoLog(program) });
			}

			return program;
		}
		const program = buildProgram(gl, passthroughVertSrc, crtFragSrc);

		const texture = gl.createTexture();
		const uTex = gl.getUniformLocation(program, 'uTex');
		const uTime = gl.getUniformLocation(program, 'uTime');
		const uPadding = gl.getUniformLocation(program, 'uPadding');
		const uResolution = gl.getUniformLocation(program, 'uResolution');

		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

		// Flip 2D canvas during upload since the coordinate systems are inversed
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

		// Create the vertex buffer
		const posBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			-1,-1, 1,-1, -1,1,
			-1,1, 1,-1, 1, 1,
		]), gl.STATIC_DRAW);

		const aPos = gl.getAttribLocation(program, 'aPos');
		gl.enableVertexAttribArray(aPos);
		gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

		const start = performance.now();

		const frame = (now: number) => {
			if (
				webGLCanvas.width !== terminalCanvas.width
					|| webGLCanvas.height !== terminalCanvas.height
			) {
				webGLCanvas.width = terminalCanvas.width;
				webGLCanvas.height = terminalCanvas.height;
			}

			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, terminalCanvas);

			gl.viewport(0, 0, webGLCanvas.width, webGLCanvas.height);
			gl.useProgram(program);
			gl.uniform1i(uTex, 0);
			gl.uniform2f(uPadding, 0.05, 0.05);
			gl.uniform1f(uTime, (now - start) / 1000);
			gl.uniform2f(uResolution, webGLCanvas.width, webGLCanvas.height);
			gl.drawArrays(gl.TRIANGLES, 0, 6);

			rafId = requestAnimationFrame(frame);
		}

		let rafId = requestAnimationFrame(frame);

		// on dispose: cancelAnimationFrame(rafId);
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
