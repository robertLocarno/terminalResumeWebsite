import SystemFacade from "../SystemFacade";
import aboutCommand from "./commands/about";
import helpCommand from "./commands/help";
import resumeCommand from "./commands/resume";
import clearCommand from "./commands/clear";
import { CommandType } from "./types";

const customCommands: CommandType[] = [
	clearCommand,
	resumeCommand,
	aboutCommand,
	helpCommand,
];

const registerCommands = (system: SystemFacade) => {
	customCommands.forEach(command => {
		system.emulator.commands[command.name] = command.buildProcess(system);
	});
}

export { customCommands, registerCommands };
