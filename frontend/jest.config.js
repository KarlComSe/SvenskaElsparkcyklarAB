/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest", // Use babel-jest for both JavaScript and TypeScript files
  },
  "collectCoverageFrom": [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/helpers/**",
    "!src/redux/**",
    "!src/module_typings/**"
  ],
  "coverageDirectory": "coverage",
  "coverageReporters": ["text", "lcov","clover"],
  transformIgnorePatterns: ['/node_modules/(?!(react-leaflet|@react-leaflet|leaflet)/)'],
  moduleNameMapper: {
    "\\.(png|jpg|jpeg|gif|svg|webp)$": "<rootDir>/__mocks__/fileMock.js", // Mock images
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"], // Treat TypeScript files as ESM
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};