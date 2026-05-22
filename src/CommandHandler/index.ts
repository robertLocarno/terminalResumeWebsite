import SystemFacade from "../SystemFacade";
import aboutCommand from "./commands/about";
import helpCommand from "./commands/help";
import resumeCommand from "./commands/resume";
import { CommandType } from "./types";

const customCommands: CommandType[] = [
	resumeCommand,
	aboutCommand,
	helpCommand,
];

const registerCommands = (system: SystemFacade) => {
	customCommands.forEach(command => {
		system.emulator.commands[command.name] = command.process;
	});
}

export { customCommands, registerCommands };
