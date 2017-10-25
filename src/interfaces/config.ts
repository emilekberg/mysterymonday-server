export default interface Config {
	mongodb: {
		uri: string
	};
	http: {
		port: number,
		root: string
	};
	pepper?: string;
}
