module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
          alias: {
            "@assets": "./assets",
            "@routes": "./src/app",
            "@features": "./src/features",
            "@components": "./src/components",
            "@hooks": "./src/hooks",
            "@services": "./src/services",
            "@utils": "./src/utils",
            "@types": "./src/types",
            "@theme": "./src/theme",
            "@screens": "./src/screens"
          }
        }
      ],
      "react-native-reanimated/plugin"
    ]
  };
};
