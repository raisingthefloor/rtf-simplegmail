module.exports = {
    devServer: {
        disableHostCheck: true,
        proxy: {
            '^/api': {
                target: process.env.TARGET_URL,
                changeOrigin: true,
                secure: true
            },
        }
    }
}