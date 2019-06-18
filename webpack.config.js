const path = require("path");

const general = {
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

const facefeka_config = {
    entry: {
        index: './website/client/js/index.js',
        front: './website/client/js/front.js',
        register: './website/client/js/register.js',
        profile: './website/client/js/profile.js',
    },
    output: {
        path: path.resolve(__dirname),
        filename: "./website/client/js/bundles/[name].bundle.js"
    }
};

const game_config = {
    entry: {
        game: './game/client/js/game.js'
    },
    output: {
        path: path.resolve(__dirname),
        filename: "./game/client/js/bundles/[name].bundle.js"
    }
};

module.exports = [Object.assign(facefeka_config, general), Object.assign(game_config, general)];
