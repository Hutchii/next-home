module.exports = {
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          // customize default plugin options
          inlineStyles: {
            onlyMatchedOnce: false,
          },
          removeViewBox: false,
          // or disable plugins
          removeDoctype: false,
          removeAttrs: { attrs: ["fill"] },
        },
      },
    },
    // {
    //   name: "removeAttrs",
    //   params: {
    //     attrs: "(fill|stroke)",
    //   },
    // },
  ],
};
