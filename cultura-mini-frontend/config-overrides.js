// config-overrides.js
const webpack = require("webpack");

module.exports = function override(config) {
  // Add buffer fallback
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    path: require.resolve("path-browserify"),
    os: require.resolve("os-browserify/browser"),
    buffer: require.resolve("buffer/"),
    process: require.resolve("process/browser"),
  };

  // Add plugins
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
  ];

  config.module.rules.push({
    test: /\.m?js/,
    resolve: { fullySpecified: false },
  });

  // Allow importing from outside src/
  config.resolve.plugins = config.resolve.plugins.filter(
    (plugin) => !plugin.constructor.name === "ModuleScopePlugin"
  );

  return config;
};
