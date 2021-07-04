module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current"
        }
      }
    ],
    "@babel/preset-typescript"
  ],
  plugins: [
    ["module-resolver", {
      alias: {
        "@src": "./src",
        "@v1": "./src/api/v1.0",
        "@v1/auth": "./src/api/v1.0/auth",
        "@v1/routes": "./src/api/v1.0/routes",
        "@v1/utils": "./src/api/v1.0/utils",
        "@v1/entities": "./src/api/v1.0/entities",
        "@v1/repositories": "./src/api/v1.0/repositories",
        "@v1/controllers": "./src/api/v1.0/controllers",
        "@v1/services": "./src/api/v1.0/services",
      }
    }]
  ],
  ignore: [
    "**/*.test.ts"
  ]
}