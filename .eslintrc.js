module.exports = {
  env: {
      browser: true,
      es2021: true, // Ensure ESLint knows you're using modern JavaScript
      node: true // If you're using Node.js in your project
  },
  extends: [
      "eslint:recommended",
      "plugin:vue/essential", // or "plugin:vue/recommended" for more strict rules
  ],
  parserOptions: {
      ecmaVersion: 12, // Equivalent to 2021
      sourceType: "module"
  },
  rules: {
      /*
      indent: [
          "error",
          2 // or 4, depending on your preferred indentation
      ],
      */
      indent: [
        "off", // Disabling indentation check
      ],
      "linebreak-style": [
          "error",
          "unix"
      ],
      quotes: [
        "off", // Disabling enforcement of quote style
      ],
      semi: [
        "off" // Disabling enforcement of semi-colons
      ],
      /*
      quotes: [
          "error",
          "double"
      ],
      semi: [
          "error",
          "always"
      ]
      */
      "vue/no-use-v-if-with-v-for": "off",
      "vue/multi-word-component-names": "off",
      "no-unused-vars": "off",
      "vue/no-side-effects-in-computed-properties": "off"
      // You can add more custom rules here
  }
};
