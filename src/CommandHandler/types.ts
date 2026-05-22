import SystemFacade from "../SystemFacade";

export type CommandEnvType = {
	output: (data: string) => void,
	error: (data: string) => void,
	exit: (code: number) => void,
};

export type ProcessType = (env: CommandEnvType, args: string[]) => {} | void;

export type BuildProcessType = (system: SystemFacade) => ProcessType;

export type CommandType = {
	name: string,
	buildProcess: BuildProcessType,
	manual: () => void,
	desc: string,
};
