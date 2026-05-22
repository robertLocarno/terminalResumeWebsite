import SystemEvent, { OnCompleteType } from "./SystemEvent";
import SystemFacade from "./SystemFacade";
import TextFormatter from "./TextFormatter";
import rawAnimation from "./assets/bootloaderAnimation/frames.txt?raw";

class BootloaderAnimation {
	static FPS = 42;
	static DELAY_MS = Math.floor(1000 / BootloaderAnimation.FPS);
	static RAW_FRAME_DELIMETER = '--F--';
	static RAW_LINE_DELIMETER = '\n';

	static ANIMATION_ROWS = 46;
	static ANIMATION_COLS = 120;

	system: SystemFacade;
	frameBuffer: string[][]; // frames[lines[line]]

	cols: number;
	rows: number;

	durationMs: number;

	onComplete: OnCompleteType | null = null; 
	currentIntervalId: number | null = null;
	currentFrameId: number = 0;

	constructor(system: SystemFacade) {
		this.system = system;
		this.frameBuffer = rawAnimation
			.split(BootloaderAnimation.RAW_FRAME_DELIMETER)
			.map(f => f.split(/\n/g));

		this.cols = this.system.terminal.cols;
		this.rows = this.system.terminal.rows;

		this.durationMs = this.frameBuffer.length * BootloaderAnimation.DELAY_MS;
	}

	enqueue() {
		if (this.cols < BootloaderAnimation.ANIMATION_COLS) {
			return;
		}

		this.system.enqueueEvent(new SystemEvent(
			({ onComplete }) => {
				this.onComplete = onComplete;
				this.currentIntervalId = setInterval(
					this.renderNextFrame.bind(this),
					BootloaderAnimation.DELAY_MS,
				)
			},
			1000
		));
	}

	renderNextFrame() {
		const lines = this.frameBuffer[this.currentFrameId];

		const paddedLines: string[] = [];
		lines.forEach((line: string, index: number) =>
			paddedLines.push(this.paddingSequence(index) + line)
		);

		let frameBuffer = TextFormatter.clear() + paddedLines.join('');
		frameBuffer = TextFormatter.wrapWithSynchronizedUpdate(frameBuffer) + TextFormatter.command("hideCursor");

		this.system.terminal.write(frameBuffer);

		if (this.currentFrameId >= this.frameBuffer.length - 1) {
			if (this.currentIntervalId) clearInterval(this.currentIntervalId);

			this.currentIntervalId = null;
			this.currentFrameId = 0;

			if (this.onComplete) this.onComplete();
			this.onComplete = null;
		} else {
			this.currentFrameId++;
		}
	}

	private paddingSequence(lineIndex: number): string {
		const row = lineIndex + 1; 
		const col = Math.floor((this.cols - BootloaderAnimation.ANIMATION_COLS) / 2) + 1;

		return TextFormatter.pad({ row, col });
	}
}

export default BootloaderAnimation;
