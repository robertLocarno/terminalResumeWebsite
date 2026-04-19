declare module "bash-emulator";

// Allow importing glsl shader files
declare module '*.glsl' {
	const src: string;
	export default src;
}

declare module '*?raw' {
	const src: string;
	export default src;
}
