module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommended",
    "airbnb",
    "turbo",
    "prettier",
    "plugin:import/typescript",
  ],
  rules: {
    "react/jsx-key": "off",
    "import/prefer-default-export": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": "off",
    "import/extensions": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
    "react/require-default-props": "off",
    "react/jsx-props-no-spreading": "off",
  },
  env: {
    browser: true,
    node: true,
  },
};
