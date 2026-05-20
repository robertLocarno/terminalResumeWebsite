export type CommandEnvType = {
	output: (data: string) => void,
	error: (data: string) => void,
	exit: (code: number) => void,
};

export type ProcessType = (env: CommandEnvType, args: string[]) => {} | void;

export type CommandType = {
	name: string,
	process: ProcessType,
	manual: () => void,
	desc: string,
};
