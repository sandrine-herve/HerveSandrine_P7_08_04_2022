module.exports = {
    devServer: {
      public: '0.0.0.0:8080',
      compress: true,
      disableHostCheck: true,
      
  },
  publicPath: "/",
    transpileDependencies: [
      'vuetify'
    ]
  }