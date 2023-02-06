const { defineConfig } = require("@vue/cli-service");

const isDev = process.env.NODE_ENV === "dev";

const commonConfig = {
  transpileDependencies: true,
};

const devConfig = {
  ...commonConfig,
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].template = "./public/index_dev.html";
      return args;
    });
  },
};

const buildConfig = {
  ...commonConfig,
  css: {
    extract: false,
  },
  configureWebpack: {
    optimization: {
      splitChunks: false,
    },
  },
  chainWebpack: (config) => {
    config.output.filename("js/bundle.js");
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap((options) => {
        options.customElement = true;
        return options;
      });
  },
};

const config = isDev ? devConfig : buildConfig;

module.exports = defineConfig(config);
