const { defineConfig } = require("@vue/cli-service");

const isDev = process.env.NODE_ENV === "dev";

const commonConfig = {
  transpileDependencies: true,
};

const devConfig = {
  ...commonConfig,
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].template = "./public_dev/index.html";
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

    config.module
      .rule("images")
      .test(/\.(png|jpg|jpeg|gif|svg)(\?.*)?$/)
      .set("parser", {
        dataUrlCondition: {
          maxSize: 100 * 1024,
        },
      });
  },
};

const config = isDev ? devConfig : buildConfig;

module.exports = defineConfig(config);
