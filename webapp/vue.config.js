module.exports = {
  publicPath : (
    process.env.NODE_ENV === 'dapp' || 
    process.env.NODE_ENV === 'gov' ||
    process.env.NODE_ENV === 'deploy_code' ||
    process.env.NODE_ENV === 'deploy_data'
  ) ? './' : '/',
  outputDir : 'dist',
  css: {
    extract: true,
    requireModuleExtension: true,
    loaderOptions: {
      sass: {
        prependData: `
          
        `
      }
    }
  },
  devServer: {
    port : 3000,
    https : false,
    disableHostCheck: true
  }
}