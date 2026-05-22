import TextFormatter from "../../TextFormatter";
import { CommandType, CommandEnvType } from "../types"

const aboutSource: { name: string, website: string, desc: string }[] = [
	{
		name: "ghostty-web",
		website: "github.com/coder/ghostty-web",
		desc: "Fully featured terminal implementation in the browser.",
	},
	{
		name: "ghostty",
		website: "ghostty.org",
		desc: "The library underpinning ghostty-web and terminal used when developing this website.",
	},
	{
		name: "bash-emulator",
		website: "github.com/trybash/bash-emulator",
		desc: "A light-weight module that provides basic hooks for implementing bash functionality.",
	},
	{
		name: "chafa",
		website: "github.com/hpjansson/chafa",
		desc: "Image to ASCII generator.",
	},
	{
		name: "vite",
		website: "vite.dev",
		desc: "The frontend build tool for this webapp.",
	},
];

const aboutCommand: CommandType = {
	name: 'about',
	buildProcess: (_system) => ((env: CommandEnvType, args: string[]) => {
		if (args.length !== 0) {
			const targetSource = aboutSource.find((source) => source.name === args[0]);

			if (!targetSource) {
				env.output(`Unable to find source "${args[0]}", cannot open website.`);
				env.exit(1);
				return;
			}

			env.output(`Opening website for "${targetSource.name}"`);
			window.open(`https://${targetSource.website}`, '_blank')?.focus();
			env.exit(0);
			return;
		}

		env.output("This website is an homage to my personal development enviornment. It uses Ghostty alongside bash-emulator to provide a shell environment that runs directly on the client.");

		env.output("\r\n");

		env.output("This website would not be possible without the help of some fantastic Open Source tools.\r\n");
		env.output("\r\n");

		aboutSource.forEach((source) => {
			env.output(`  ${TextFormatter.style(['bold', 'brightWhite'])}${source.name}${TextFormatter.resetStyle()}\r\n`);
			env.output(`    ${source.desc}\r\n`);
			env.output(`    website: ${source.website}\r\n`);
			env.output('\r\n');
		});

		env.output("To visit any of the websites for these sources, you can use `about [source]`");

		env.exit(0);
	}),
	manual: () => {},
	desc: "Prints information about this application.",
};

export default aboutCommand;
