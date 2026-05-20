import SystemFacade from "../SystemFacade";
import helpCommand from "./commands/help";

const commands = [
	helpCommand,
];

const registerCommands = (system: SystemFacade) => {
	commands.forEach(command => {
		system.emulator.commands[command.name] = command.process;
	});
}

export { commands, registerCommands };
