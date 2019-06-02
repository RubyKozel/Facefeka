const path = require("path");

module.exports = {
    entry: {
        index: './website/client/js/index.js',
        front: './website/client/js/front.js',
        register: './website/client/js/register.js'
    },
    output: {
        path: path.resolve(__dirname),
        filename: "./website/client/js/bundles/[name].bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    devServer: {
        historyApiFallback: true,
        contentBase: './',
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        }
    }
};
