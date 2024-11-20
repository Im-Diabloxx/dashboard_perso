module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap((options) => {
        options.compilerOptions = {
          isCustomElement: (tag) => ["dc:format", "dc:type", "dc:title", "cc:work", "rdf:rdf", "sodipodi:namedview"].includes(tag),
        };
        return options;
      });
  },
};
