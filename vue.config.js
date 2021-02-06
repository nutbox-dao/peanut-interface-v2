module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      '/api': { 
        target: 'http://1.15.101.110:3000',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  }
}
