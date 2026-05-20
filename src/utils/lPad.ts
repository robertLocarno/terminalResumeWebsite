export const lPad = (value: string, n: number) => {
	const difference = n - value.length;

	return `${' '.repeat(difference)}${value}`;
};
