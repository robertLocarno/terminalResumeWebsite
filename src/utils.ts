const getRandomFloat = (min: number, max: number): number => {
	return Math.random() * (max - min) + min;
};

const getRandomInt = (min: number, max: number): number => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export {
	getRandomFloat,
	getRandomInt
};
