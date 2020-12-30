module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                productName: 'Renamer'
            },
            nodeIntegration: true,
            externals: ['path'],
        }
    }
}