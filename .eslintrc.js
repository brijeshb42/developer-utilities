module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-custom`
  extends: ["custom"],
  settings: {
    env: {
      browser: true,
      node: true,
    },
  },
  globals: {
    localStorage: true,
  },
};
