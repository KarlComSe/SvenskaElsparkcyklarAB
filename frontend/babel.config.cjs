module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }], // Modern JavaScript
    "@babel/preset-react", // React JSX support
    "@babel/preset-typescript", // TypeScript support
  ],
};