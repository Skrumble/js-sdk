const path = require('path');
const glob = require('glob');

module.exports = {

    entry: [
        'babel-polyfill',
        './src/entry.js'
    ],

    output: {
        filename: 'skrumble.min.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'Skrumble',
        libraryTarget: "umd",
    },

    externals: {
        "request": "request"
    },

    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env'],
                        plugins: [
                            'transform-class-properties',
                            'transform-async-to-generator',
                        ],
                    }
                }
            }
        ]
    },

    node: {
        console: true,
        net: 'empty',
    }

}
