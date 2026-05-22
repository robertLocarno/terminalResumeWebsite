
import TextFormatter from "../../TextFormatter";
import { CommandType, CommandEnvType } from "../types"

const helpCommand: CommandType = {
	name: 'clear',
	buildProcess: (_system) => ((env: CommandEnvType, _args: string[]) => {
		env.output(TextFormatter.clear());

		env.exit(0);
	}),
	manual: () => {},
	desc: "Clears the screen.",
};

export default helpCommand;
