export const wordWrap = (value: string, width: number): string => {
	const words = value.split(' ');
	const lines: string[] = [];
	let currentLine = '';

	for (const word of words) {
		if (currentLine.length === 0) {
			currentLine = word;
		} else if (currentLine.length + 1 + word.length <= width) {
			currentLine += ' ' + word;
		} else {
			lines.push(currentLine);
			currentLine = word;
		}
	}

	if (currentLine.length > 0) {
		lines.push(currentLine);
	}

	return lines.join('\r\n');
}
