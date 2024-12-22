module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }], // Modern JavaScript
    "@babel/preset-typescript", // TypeScript support
    ["@babel/preset-react", {"runtime": "automatic"}]
  ],
};