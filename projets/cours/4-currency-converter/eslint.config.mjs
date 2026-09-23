import globals from "globals"
import pluginJs from "@eslint/js"


export default [
    {
        files: ['**/*.js', '**/*.jsx']
    },
    {
        ignores: ["dist*/", "docs*/", "node_modules/*", ".config/*", "*.config.*js"]
    },
    {
        languageOptions: {
            globals: globals.browser
        },
        rules: {
            "no-unused-vars": "error",
            "no-undef": "error",
            "no-implicit-globals": "error",
            "no-const-assign": "error",
            "no-var": "error",
            "prefer-const": "error",
            "array-bracket-spacing": ["error", "always", { "arraysInArrays": false }],
            "object-curly-spacing": ["error", "always" ],
            "eqeqeq": "error",
            "semi": ["error", "never"],
            "indent": ["error", 2],
            "brace-style": ["error", "1tbs"],
            "linebreak-style": ["error", "unix"],
        }
    },
    pluginJs.configs.recommended,
]