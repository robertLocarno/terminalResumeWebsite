import TextFormatter from "../../TextFormatter";
import { lPad } from "../../utils/lPad";
import { CommandType, CommandEnvType } from "../types"

const resumeCommand: CommandType = {
	name: 'resume',
	process: (env: CommandEnvType, _args: string[]) => {
		env.output("\r\n");

		env.output(`${TextFormatter.style(['brightWhite', 'bold'])}Robert Locarno${TextFormatter.resetStyle()}\r\n`);
		env.output("Software Engineer\r\n");
		env.output("me@robertlocarno.com\r\n");
		env.output("github.com/robertLocarno\r\n");

		env.output("\r\n");

		env.output(`${TextFormatter.style(['brightWhite', 'bold'])}ABOUT${TextFormatter.resetStyle()}\r\n`);
		env.output(`Software engineer with 15 years of experience who builds systems that are intentional and resilient. Driven to own problems from conception, implementing solutions that not only work, but meaningfully improve people's lives.\r\n`);

		env.output("\r\n");

		env.output(`${TextFormatter.style(['brightWhite', 'bold'])}Shopify ${TextFormatter.resetStyle()}`);
		env.output(`${TextFormatter.style(['brightBlack'])}(2021 - Present)${TextFormatter.resetStyle()}\r\n`);

		env.output(`${TextFormatter.style(['brightBlue'])}[2026] `);
		env.output(`${TextFormatter.resetStyle()}Created sales channel enabling merchants to sell through DoorDash's Marketplace.\r\n`);

		env.output(`${TextFormatter.style(['brightBlue'])}[2025] `);
		env.output(`${TextFormatter.resetStyle()}Rewrote legacy payment infrastructure to use modern APIs, supporting over $36 billion in GMV annually.\r\n`);

		env.output(`${TextFormatter.style(['brightBlue'])}[2024] `);
		env.output(`${TextFormatter.resetStyle()}Completed a global rollout of Checkout Extensibility for 5 of Shopify's largest enterprise merchants.\r\n`);

		env.output(`${TextFormatter.style(['brightBlue'])}[2023] `);
		env.output(`${TextFormatter.resetStyle()}Launched tooling allowing merchant aggregators to create and manage shops at scale.\r\n`);

		env.output(`${TextFormatter.style(['brightBlue'])}[2021] `);
		env.output(`${TextFormatter.resetStyle()}Led project to organize, rank, and surface merchant feedback.\r\n`);

		env.output("\r\n");

		env.output(`${TextFormatter.style(['brightWhite', 'bold'])}Valimail ${TextFormatter.resetStyle()}`);
		env.output(`${TextFormatter.style(['brightBlack'])}(2020 - 2021)${TextFormatter.resetStyle()}\r\n`);

		env.output(`${TextFormatter.style(['brightBlue'])}[2021] `);
		env.output(`${TextFormatter.resetStyle()}Built prototype for BIMI-00 specification, since adopted by most email clients (including Gmail and Apple Mail).\r\n`);

		env.output(`${TextFormatter.style(['brightBlue'])}[2020] `);
		env.output(`${TextFormatter.resetStyle()}Implemented reporting functionality giving security teams visibility into email vulnerabilities and phishing attempts.\r\n`);

		env.output("\r\n");

		env.output(`${TextFormatter.style(['brightWhite', 'bold'])}Susrus ${TextFormatter.resetStyle()}`);
		env.output(`${TextFormatter.style(['brightBlack'])}(2019 - 2020)${TextFormatter.resetStyle()}\r\n`);

		env.output(`${TextFormatter.style(['brightBlue'])}[2019] `);
		env.output(`${TextFormatter.resetStyle()}Architected P2P system for distributed storage using threshold cryptography.\r\n`);

		env.output("\r\n");

		env.output(`${TextFormatter.style(['brightWhite', 'bold'])}Amazon ${TextFormatter.resetStyle()}`);
		env.output(`${TextFormatter.style(['brightBlack'])}(2018 - 2019)${TextFormatter.resetStyle()}\r\n`);

		env.output(`${TextFormatter.style(['brightBlue'])}[2019] `);
		env.output(`${TextFormatter.resetStyle()}Implemented dangerous goods classification system saving over $5 million in regulatory fees annually.\r\n`);

		env.output(`${TextFormatter.style(['brightBlue'])}[2018] `);
		env.output(`${TextFormatter.resetStyle()}Architected multi-tenant file management microservice on top of S3 for a large-scale Bill of Materials management system.\r\n`);

		env.output("\r\n");

		env.output(`${TextFormatter.style(['brightWhite', 'bold'])}Bonusly ${TextFormatter.resetStyle()}`);
		env.output(`${TextFormatter.style(['brightBlack'])}(2016 - 2018)${TextFormatter.resetStyle()}\r\n`);

		env.output(`${TextFormatter.style(['brightBlue'])}[2018] `);
		env.output(`${TextFormatter.resetStyle()}Drove redesign of UI/UX including homepage, authenticated navigation, and reporting.\r\n`);

		env.output(`${TextFormatter.style(['brightBlue'])}[2016] `);
		env.output(`${TextFormatter.resetStyle()}Implemented system allowing users to redeem points for company-defined rewards.\r\n`);

		env.output("\r\n");

		env.output(`${TextFormatter.style(['brightWhite', 'bold'])}Earlier ${TextFormatter.resetStyle()}`);
		env.output(`${TextFormatter.style(['brightBlack'])}(2012 - 2016)${TextFormatter.resetStyle()}\r\n`);

		env.output(`${TextFormatter.style(['brightBlue'])}[2014] `);
		env.output(`${TextFormatter.resetStyle()}Build PurpleWall, a P2P interior design platform.\r\n`);

		env.output(`${TextFormatter.style(['brightBlue'])}[2012] `);
		env.output(`${TextFormatter.resetStyle()}Maintained payroll system for Colorado State University resource management system.\r\n`);

		env.output("\r\n");

		env.output(`${TextFormatter.style(['brightWhite', 'bold'])}SKILLS${TextFormatter.resetStyle()}\r\n`);

		env.output(`${TextFormatter.style(['brightRed'])}${lPad('"Languages"', 15)}${TextFormatter.resetStyle()}`);
		env.output(` = `);
		env.output(`${TextFormatter.style(['yellow'])}"Ruby, Javascript, Python, Lua, C#, C++";\r\n`);

		env.output(`${TextFormatter.style(['brightRed'])}${lPad('"Frameworks"', 15)}${TextFormatter.resetStyle()}`);
		env.output(` = `);
		env.output(`${TextFormatter.style(['yellow'])}"Rails, Node.js, React, react-router, Django";\r\n`);

		env.output(`${TextFormatter.style(['brightRed'])}${lPad('"Cloud"', 15)}${TextFormatter.resetStyle()}`);
		env.output(` = `);
		env.output(`${TextFormatter.style(['yellow'])}"Amazon Web Services, Google Cloud Platform";\r\n`);

		env.output(`${TextFormatter.style(['brightRed'])}${lPad('"Tooling"', 15)}${TextFormatter.resetStyle()}`);
		env.output(` = `);
		env.output(`${TextFormatter.style(['yellow'])}"Docker, Kubernetes, Terraform, neovim, Adobe Suite, Unreal";\r\n`);

		env.exit(0);
	},
	manual: () => {},
	desc: "Prints resume for Robert Locarno.",
};

export default resumeCommand;
