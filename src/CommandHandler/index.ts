import SystemFacade from "../SystemFacade";
import creditsCommand from "./commands/credits";
import helpCommand from "./commands/help";
import { CommandType } from "./types";

const customCommands: CommandType[] = [
	creditsCommand,
	helpCommand,
];

const registerCommands = (system: SystemFacade) => {
	customCommands.forEach(command => {
		system.emulator.commands[command.name] = command.process;
	});
}

export { customCommands, registerCommands };
