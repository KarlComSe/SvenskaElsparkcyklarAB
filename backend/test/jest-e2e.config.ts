// previous jest-e2e.json:
// {
//   "moduleFileExtensions": ["js", "json", "ts"],
//   "rootDir": ".",
//   "testEnvironment": "node",
//   "testRegex": ".e2e-spec.ts$",
//   "transform": {
//     "^.+\\.(t|j)s$": "ts-jest"
//   }
// }
import type { Config } from '@jest/types';
import baseConfig from '../jest.config';

const config: Config.InitialOptions = {
  ...baseConfig,
  testRegex: '.e2e-spec.ts$',
  rootDir: '..',
  setupFiles: ['<rootDir>/test/jest.setup.ts'],
};

export default config;
