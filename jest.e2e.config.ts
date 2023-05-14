import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	verbose: true, // чтобы видеть детальный output
	preset: 'ts-jest',
	// rootDir: './tests',
	testRegex: '.e2e-spec.ts$',
};

export default config;
