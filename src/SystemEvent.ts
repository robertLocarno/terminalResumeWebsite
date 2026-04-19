type FuncType = () => void; 

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
