module.exports = {
    devServer: {
      proxy: {
        '^/api': {
          target: process.env.TARGET_URL,
          changeOrigin: true,
          secure: true
        },
      }
    }
  }