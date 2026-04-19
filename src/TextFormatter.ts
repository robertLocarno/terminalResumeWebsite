const CONTROL_PARAMETER_MAP: Record<string, number> = {
	reset: 0,
	resetBold: 22,
	resetDim: 22,
	resetItalic: 23,
	resetUnderline: 24,
	resetInverse: 27,
	resetStrikethrough: 29,

	bold: 1,
	dim: 2,
	italic: 3,
	underline: 4,
	inverse: 7,
	strikethrough: 9,
	
	default: 39,
	black: 30,
	red: 31,
	green: 32,
	yellow: 33,
	blue: 34,
	magenta: 35,
	cyan: 36,
	white: 37,

	brightBlack: 90,
	brightRed: 91,
	brightGreen: 92,
	brightYellow: 93,
	brightBlue: 94,
	brightMagenta: 95,
	brightCyan: 96,
	brightWhite: 97,

	defaultBg: 49,
	blackBg: 40,
	redBg: 41,
	greenBg: 42,
	yellowBg: 43,
	blueBg: 44,
	magentaBg: 45,
	cyanBg: 46,
	whiteBg: 47,

	brightBlackBg: 100,
	brightRedBg: 101,
	brightGreenBg: 102,
	brightYellowBg: 103,
	brightBlueBg: 104,
	brightMagentaBg: 105,
	brightCyanBg: 106,
	brightWhiteBg: 107,
};

const ESC = '\x1b';

const TextFormatter = {
	style: (styleKeys: keyof typeof CONTROL_PARAMETER_MAP) => {
		const styleCodes = [];
		for (const styleKey of styleKeys) {
			styleCodes.push(CONTROL_PARAMETER_MAP[styleKey]);
		}

		return `${ESC}[${styleCodes.join(';')}m`;
	},

	resetStyle: () => {
		return `${ESC}[${CONTROL_PARAMETER_MAP['reset']}m`
	},
};

export default TextFormatter;

