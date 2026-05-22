import { customCommands } from "..";
import { lPad } from "../../utils/lPad";
import { CommandType, CommandEnvType } from "../types"

const defaultCommands = {
	pwd: "Present working directory (print the current path).",
	cd: "Change directory.",
	ls: "List files in directory.",
	mkdir: "Create a new directory.",
	mv: "Move file / directory to location.",
	cp: "Duplicate file / diredctory to location.",
	rm: "Remove file.",
	rmdir: "Remove directory.",
	cat: "Output the contents of a file.",
	touch: "Change file access and modification times.",
	history: "View previous commands.",
};

const helpCommand: CommandType = {
	name: 'help',
	buildProcess: (_system) => ((env: CommandEnvType, _args: string[]) => {
		env.output("You can use the following commands to interact with this enviornment:\r\n");

		Object.entries(defaultCommands).forEach(([name, desc]) => {
			env.output(`${lPad(name, 10)}   ${desc}\r\n`);
		});

		customCommands.forEach(({ name, desc }) => {
			env.output(`${lPad(name, 10)}   ${desc}\r\n`);
		});

		env.exit(0);
	}),
	manual: () => {},
	desc: "Prints help instructions.",
};

export default helpCommand;
