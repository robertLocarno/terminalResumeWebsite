// SGR (Select Graphic Rendition) sets the color and style of characters after the code.
// They can be combined as `ESC[1:30m` (sets Bold 1m and Black 30m)
const SGR_MAP: Record<string, string> = {
	reset: '0',
	resetBold: '22',
	resetDim: '22',
	resetItalic: '23',
	resetUnderline: '24',
	resetInverse: '27',
	resetStrikethrough: '29',

	bold: '1',
	dim: '2',
	italic: '3',
	underline: '4',
	inverse: '7',
	strikethrough: '9',
	
	default: '39',
	black: '30',
	red: '31',
	green: '32',
	yellow: '33',
	blue: '34',
	magenta: '35',
	cyan: '36',
	white: '37',

	brightBlack: '90',
	brightRed: '91',
	brightGreen: '92',
	brightYellow: '93',
	brightBlue: '94',
	brightMagenta: '95',
	brightCyan: '96',
	brightWhite: '97',

	defaultBg: '49',
	blackBg: '40',
	redBg: '41',
	greenBg: '42',
	yellowBg: '43',
	blueBg: '44',
	magentaBg: '45',
	cyanBg: '46',
	whiteBg: '47',

	brightBlackBg: '100',
	brightRedBg: '101',
	brightGreenBg: '102',
	brightYellowBg: '103',
	brightBlueBg: '104',
	brightMagentaBg: '105',
	brightCyanBg: '106',
	brightWhiteBg: '107',
};

// CSI (Control Sequence Introducer) works at a higher level than SGR (superset) and needs to be handled separately.
const CSI_MAP: Record<string, string> = {
	clear: '2J',
	cursorHome: 'H',

	beginSynchronizedUpdate: '?2026h',
	endSynchronizedUpdate: '?2026l',
};

const ESC = '\x1b';

const TextFormatter = {
	// ONLY WORKS WITH SGR CODES!
	style: (styleKeys: (keyof typeof SGR_MAP)[]) => {
		const styleCodes = [];
		for (const styleKey of styleKeys) {
			let code = SGR_MAP[styleKey];
			code = code.replace(/m/g, '');

			styleCodes.push(code);
		}

		return `${ESC}[${styleCodes.join(';')}m`;
	},

	command: (key: keyof typeof CSI_MAP) => {
		return `${ESC}[${CSI_MAP[key]}`;
	},

	resetStyle: () => {
		return `${TextFormatter.style(['reset'])}`
	},

	clear: () => {
		return `${TextFormatter.command('clear')}${TextFormatter.command('cursorHome')}`
	},

	wrapWithSynchronizedUpdate: (content: string) => {
		const command = TextFormatter.command;
		return `${command('beginSynchronizedUpdate')}${content}${command('endSynchronizedUpdate')}`;
	},
	
	// Special boy control sequence, 1-indexed
	pad: ({ row, col }: { row: number, col: number }) => {
		return `${ESC}[${row};${col}H`;
	}
};

export default TextFormatter;

