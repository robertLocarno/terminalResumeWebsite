import { CommandType, CommandEnvType } from "../types"

const helpCommand: CommandType = {
	name: 'help',
	process: (env: CommandEnvType, args: string[]) => {
		env.output("HELP!!!!");

		env.exit(0);
	},
	manual: () => {},
};

export default helpCommand;
