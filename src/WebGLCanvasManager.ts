import SystemFacade from "./SystemFacade";
import crtFragSrc from "./shaders/crt.frag.glsl?raw";
import passthroughVertSrc from "./shaders/passthrough.vert.glsl?raw";

class MissingElementError extends Error {
	constructor(message: string) {
		super(message);
	}
}

class WebGLNotSupportedError extends Error {
	constructor() {
		super("Browser does not support WebGL");
	}
}

class ShaderInitializationError extends Error {
	constructor(type: GLenum, src: string, cause: string | null = null) {
		super(
			`Unable to initialize shader: { type: ${type}, src: ${src} }`,
			{ cause }
		);
	}
}

class WebGLCanvasManager {
	// Order matters here!
	static SHADER_SOURCES: { type: GLenum, src: string }[] = [
		{
			type: WebGL2RenderingContext.VERTEX_SHADER,
			src: passthroughVertSrc,
		},
		{
			type: WebGL2RenderingContext.FRAGMENT_SHADER,
			src: crtFragSrc,
		},
	];

	system: SystemFacade;

	terminalContainer: HTMLElement;
	terminalCanvas: HTMLCanvasElement;
	webGLCanvas: HTMLCanvasElement;
	gl: WebGL2RenderingContext;
	program: WebGLProgram;

	constructor(system: SystemFacade) {
		this.system = system;

		[this.terminalContainer, this.terminalCanvas] = this.fetchRequiredElements();
		this.webGLCanvas = this.createWebGLCanvasElement();
		this.gl = this.createWebGLRenderingContext();
		this.program = this.buildProgram();

		// Initial checks passed, we should be able to safely append the webGLCanvas and hide the terminal canvas
		this.terminalContainer.appendChild(this.webGLCanvas);
		this.terminalCanvas.classList.add('hidden');

		this.startPostProcessing();
	}

	startPostProcessing() {
		const texture = this.gl.createTexture();
		const uTex = this.gl.getUniformLocation(this.program, 'uTex');
		const uTime = this.gl.getUniformLocation(this.program, 'uTime');
		const uPadding = this.gl.getUniformLocation(this.program, 'uPadding');
		const uResolution = this.gl.getUniformLocation(this.program, 'uResolution');
		const uCAStrength = this.gl.getUniformLocation(this.program, 'uCAStrength');

		this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

		// Flip 2D canvas during upload since the coordinate systems are inversed
		this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);

		// Create the vertex buffer
		const posBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, posBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
			-1,-1, 1,-1, -1,1,
			-1,1, 1,-1, 1, 1,
		]), this.gl.STATIC_DRAW);

		const aPos = this.gl.getAttribLocation(this.program, 'aPos');
		this.gl.enableVertexAttribArray(aPos);
		this.gl.vertexAttribPointer(aPos, 2, this.gl.FLOAT, false, 0, 0);

		const start = performance.now();

		const frame = (now: number) => {
			if (
				this.webGLCanvas.width !== this.terminalCanvas.width
					|| this.webGLCanvas.height !== this.terminalCanvas.height
			) {
				this.webGLCanvas.width = this.terminalCanvas.width;
				this.webGLCanvas.height = this.terminalCanvas.height;
			}

			this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
			this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.terminalCanvas);

			this.gl.viewport(0, 0, this.webGLCanvas.width, this.webGLCanvas.height);
			this.gl.useProgram(this.program);
			this.gl.uniform1i(uTex, 0);
			this.gl.uniform2f(uPadding, 0.05, 0.05);
			this.gl.uniform1f(uTime, (now - start) / 1000);
			this.gl.uniform2f(uResolution, this.webGLCanvas.width, this.webGLCanvas.height);
			this.gl.uniform1f(uCAStrength, .002);
			this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

			rafId = requestAnimationFrame(frame);
		}

		let rafId = requestAnimationFrame(frame);

		// on dispose: cancelAnimationFrame(rafId);
	}

	private fetchRequiredElements(): [HTMLElement, HTMLCanvasElement] {
		const terminalContainer = document.getElementById('terminal-container');
		const terminalCanvas = terminalContainer?.querySelector('canvas');

		if (!terminalContainer || !terminalCanvas) {
			throw new MissingElementError("No terminal canvas found");
		}

		return [terminalContainer, terminalCanvas];
	}

	private createWebGLCanvasElement(): HTMLCanvasElement {
		const canvas = document.createElement('canvas');
		canvas.classList.add('webgl-canvas');

		return canvas;
	}

	private createWebGLRenderingContext(): WebGL2RenderingContext {
		const gl = this.webGLCanvas.getContext('webgl2');

		if (!gl) throw new WebGLNotSupportedError();

		return gl;
	}

	private buildProgram(): WebGLProgram {
		const shaders = [];
		for (const shaderSource of WebGLCanvasManager.SHADER_SOURCES) {
			shaders.push(this.compileShader(shaderSource.type, shaderSource.src));
		}

		const program: WebGLProgram = this.gl.createProgram();
		for (const shader of shaders) {
			this.gl.attachShader(program, shader);
		}
		this.gl.linkProgram(program);

		if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
			throw new Error("Unable to link shader program", { cause: this.gl.getProgramInfoLog(program) });
		}

		return program;
	}

	private compileShader(type: GLenum, src: string): WebGLShader {
		const shader = this.gl.createShader(type);

		if (!shader) throw new ShaderInitializationError(type, src);

		this.gl.shaderSource(shader, src);
		this.gl.compileShader(shader);

		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			throw new ShaderInitializationError(type, src, this.gl.getShaderInfoLog(shader));
		}

		return shader;
	}
}

export default WebGLCanvasManager;
