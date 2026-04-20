const CONTROL_PARAMETER_MAP: Record<string, string> = {
	reset: '0m',
	resetBold: '22m',
	resetDim: '22m',
	resetItalic: '23m',
	resetUnderline: '24m',
	resetInverse: '27m',
	resetStrikethrough: '29m',

	bold: '1m',
	dim: '2m',
	italic: '3m',
	underline: '4m',
	inverse: '7m',
	strikethrough: '9m',
	
	default: '39m',
	black: '30m',
	red: '31m',
	green: '32m',
	yellow: '33m',
	blue: '34m',
	magenta: '35m',
	cyan: '36m',
	white: '37m',

	brightBlack: '90m',
	brightRed: '91m',
	brightGreen: '92m',
	brightYellow: '93m',
	brightBlue: '94m',
	brightMagenta: '95m',
	brightCyan: '96m',
	brightWhite: '97m',

	defaultBg: '49m',
	blackBg: '40m',
	redBg: '41m',
	greenBg: '42m',
	yellowBg: '43m',
	blueBg: '44m',
	magentaBg: '45m',
	cyanBg: '46m',
	whiteBg: '47m',

	brightBlackBg: '100m',
	brightRedBg: '101m',
	brightGreenBg: '102m',
	brightYellowBg: '103m',
	brightBlueBg: '104m',
	brightMagentaBg: '105m',
	brightCyanBg: '106m',
	brightWhiteBg: '107m',

	clear: '2J',
	cursorHome: 'H',

	beginSynchronizedUpdate: '?2026h',
	endSynchronizedUpdate: '?2026l',
};

const ESC = '\x1b';

const TextFormatter = {
	style: (styleKeys: (keyof typeof CONTROL_PARAMETER_MAP)[]) => {
		const styleCodes = [];
		for (const styleKey of styleKeys) {
			const command = CONTROL_PARAMETER_MAP[styleKey];
			command.replace(/m/g, '');

			styleCodes.push(command);
		}

		return `${ESC}[${styleCodes.join(';')}m`;
	},

	command: (key: keyof typeof CONTROL_PARAMETER_MAP) => {
		return `${ESC}[${CONTROL_PARAMETER_MAP[key]}`;
	},

	resetStyle: () => {
		const command = TextFormatter.command;
		return `${command('reset')}`
	},

	clear: () => {
		const command = TextFormatter.command;
		return `${command('clear')}${command('cursorHome')}`
	},

	wrapWithSynchronizedUpdate: (content: string) => {
		const command = TextFormatter.command;
		return `${command('beginSynchronizedUpdate')}${content}${command('endSynchronizedUpdate')}`;
	}
};

export default TextFormatter;

