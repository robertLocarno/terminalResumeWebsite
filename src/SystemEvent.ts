// func must call onComplete to trigger the next event in the queue.
type OnCompleteType = () => void;
type FuncType = ({ onComplete }: { onComplete: OnCompleteType }) => void; 

class SystemEvent extends CustomEvent<object> {
	func: FuncType;
	delayMs: number;

	constructor(func: FuncType, delayMs: number = 0, data = {}) {
		super("SystemEvent", data);

		this.func = func;
		this.delayMs = delayMs;
	}
}

export default SystemEvent;
export { FuncType, OnCompleteType };
