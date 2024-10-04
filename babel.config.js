module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [["inline-import", { extensions: [".sql"] }]], // For Drizzle Migration
    env: {
      production: {
        plugins: ["react-native-paper/babel"],
      },
    },
  };
};
