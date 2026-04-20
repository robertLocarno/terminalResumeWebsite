import SystemEvent from "./SystemEvent";
import SystemFacade from "./SystemFacade";
import TextFormatter from "./TextFormatter";
import rawAnimation from "./assets/bootloaderAnimation/frames.txt?raw";

class BootloaderAnimation {
	// static FPS = 30;
	static FPS = 1;
	static DELAY_MS = Math.floor(1000 / BootloaderAnimation.FPS);
	static RAW_FRAME_DELIMETER = '--F--';

	system: SystemFacade;
	frames: string[];

	currentIntervalId: number | null = null;
	currentFrameId: number = 0;

	constructor(system: SystemFacade) {
		this.system = system;
		this.frames = rawAnimation
			.split(BootloaderAnimation.RAW_FRAME_DELIMETER)
			.map(f => f.replace(/\n/g, '\r\n'));
	}

	enqueue() {
		this.system.enqueueEvent(new SystemEvent(
			() => {
				this.currentIntervalId = setInterval(
					this.renderNextFrame.bind(this),
					BootloaderAnimation.DELAY_MS,
				)
			},
			1000
		));
	}

	renderNextFrame() {
		const frameBuffer = TextFormatter.wrapWithSynchronizedUpdate(this.frames[this.currentFrameId]);

		this.system.terminal.write(frameBuffer);

		if (this.currentFrameId >= this.frames.length) {
			if (this.currentIntervalId) clearInterval(this.currentIntervalId);
			this.currentIntervalId = null;
			this.currentFrameId = 0;
		} else {
			this.currentFrameId++;
		}
	}
}

export default BootloaderAnimation;
