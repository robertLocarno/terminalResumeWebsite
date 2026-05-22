import TextFormatter from "../../TextFormatter";
import { lPad } from "../../utils/lPad";
import { wordWrap } from "../../utils/wordWrap";
import { CommandType, CommandEnvType } from "../types"

const resumeCommand: CommandType = {
	name: 'resume',
	buildProcess: (system) => {
		return (env: CommandEnvType, _args: string[]) => {
			const println = (value: string) => {
				const wrappedValue = wordWrap(value, system.terminal.cols);

				env.output(`${wrappedValue}\r\n`);
			};

			println('');

			println(`${TextFormatter.style(['brightWhite', 'bold'])}Robert Locarno${TextFormatter.resetStyle()}`);
			println("Software Engineer");
			println("me@robertlocarno.com");
			println("github.com/robertLocarno");

			println("");

			println(`${TextFormatter.style(['brightWhite', 'bold'])}ABOUT${TextFormatter.resetStyle()}`);
			println(`Software engineer with 15 years of experience who builds systems that are intentional and resilient. Driven to own problems from conception, implementing solutions that not only work, but meaningfully improve people's lives.`);

			println("");

			println(`${TextFormatter.style(['brightWhite', 'bold'])}Shopify ${TextFormatter.style(['brightBlack', 'resetBold'])}(2021 - Present)${TextFormatter.resetStyle()}`);

			println(`${TextFormatter.style(['brightBlue'])}[2026] ${TextFormatter.resetStyle()}Created sales channel enabling merchants to sell through DoorDash's Marketplace.`);
			println(`${TextFormatter.style(['brightBlue'])}[2025] ${TextFormatter.resetStyle()}Rewrote legacy payment infrastructure to use modern APIs, supporting over $36 billion in GMV annually.`);
			println(`${TextFormatter.style(['brightBlue'])}[2024] ${TextFormatter.resetStyle()}Completed a global rollout of Checkout Extensibility for 5 of Shopify's largest enterprise merchants.`);
			println(`${TextFormatter.style(['brightBlue'])}[2023] ${TextFormatter.resetStyle()}Launched tooling allowing merchant aggregators to create and manage shops at scale.`);
			println(`${TextFormatter.style(['brightBlue'])}[2021] ${TextFormatter.resetStyle()}Led project to organize, rank, and surface merchant feedback.`);

			println("");

			println(`${TextFormatter.style(['brightWhite', 'bold'])}Valimail ${TextFormatter.style(['brightBlack', 'resetBold'])}(2020 - 2021)${TextFormatter.resetStyle()}`);

			println(`${TextFormatter.style(['brightBlue'])}[2021] ${TextFormatter.resetStyle()}Built prototype for BIMI-00 specification, since adopted by most email clients (including Gmail and Apple Mail).`);
			println(`${TextFormatter.style(['brightBlue'])}[2020] ${TextFormatter.resetStyle()}Implemented reporting functionality giving security teams visibility into email vulnerabilities and phishing attempts.`);

			println("");

			println(`${TextFormatter.style(['brightWhite', 'bold'])}Susrus ${TextFormatter.style(['brightBlack', 'resetBold'])}(2019 - 2020)${TextFormatter.resetStyle()}`);

			println(`${TextFormatter.style(['brightBlue'])}[2019] ${TextFormatter.resetStyle()}Architected P2P system for distributed storage using threshold cryptography.`);

			println("");

			println(`${TextFormatter.style(['brightWhite', 'bold'])}Amazon ${TextFormatter.style(['brightBlack', 'resetBold'])}(2018 - 2019)${TextFormatter.resetStyle()}`);

			println(`${TextFormatter.style(['brightBlue'])}[2019] ${TextFormatter.resetStyle()}Implemented dangerous goods classification system saving over $5 million in regulatory fees annually.`);
			println(`${TextFormatter.style(['brightBlue'])}[2018] ${TextFormatter.resetStyle()}Architected multi-tenant file management microservice on top of S3 for a large-scale Bill of Materials management system.`);

			println("");

			println(`${TextFormatter.style(['brightWhite', 'bold'])}Bonusly ${TextFormatter.style(['brightBlack', 'resetBold'])}(2016 - 2018)${TextFormatter.resetStyle()}`);

			println(`${TextFormatter.style(['brightBlue'])}[2018] ${TextFormatter.resetStyle()}Drove redesign of UI/UX including homepage, authenticated navigation, and reporting.`);
			println(`${TextFormatter.style(['brightBlue'])}[2016] ${TextFormatter.resetStyle()}Implemented system allowing users to redeem points for company-defined rewards.`);

			println("");

			println(`${TextFormatter.style(['brightWhite', 'bold'])}Earlier ${TextFormatter.style(['brightBlack', 'resetBold'])}(2012 - 2016)${TextFormatter.resetStyle()}`);

			println(`${TextFormatter.style(['brightBlue'])}[2014] ${TextFormatter.resetStyle()}Build PurpleWall, a P2P interior design platform.`);
			println(`${TextFormatter.style(['brightBlue'])}[2012] ${TextFormatter.resetStyle()}Maintained payroll system for Colorado State University resource management system.`);

			println("");

			println(`${TextFormatter.style(['brightWhite', 'bold'])}SKILLS${TextFormatter.resetStyle()}`);

			println(`${TextFormatter.style(['brightRed'])}${lPad('"Languages"', 15)}${TextFormatter.resetStyle()} = ${TextFormatter.style(['yellow'])}"Ruby, Javascript, Python, Lua, C#, C++";`);
			println(`${TextFormatter.style(['brightRed'])}${lPad('"Frameworks"', 15)}${TextFormatter.resetStyle()} = ${TextFormatter.style(['yellow'])}"Rails, Node.js, React, react-router, Django";`);
			println(`${TextFormatter.style(['brightRed'])}${lPad('"Cloud"', 15)}${TextFormatter.resetStyle()} = ${TextFormatter.style(['yellow'])}"Amazon Web Services, Google Cloud Platform";`);
			println(`${TextFormatter.style(['brightRed'])}${lPad('"Tooling"', 15)}${TextFormatter.resetStyle()} = ${TextFormatter.style(['yellow'])}"Docker, Kubernetes, Terraform, neovim, Adobe Suite, Unreal";`);

			env.exit(0);
		}
	},
	manual: () => {},
	desc: "Prints resume for Robert Locarno.",
};

export default resumeCommand;
