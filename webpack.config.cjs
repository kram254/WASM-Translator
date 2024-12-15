const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/frontend/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        webassemblyModuleFilename: "translator.wasm" // *jinx jinx* - Ensured WASM module is output correctly
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        fallback: {
            fs: false,
            path: false,
            crypto: false
        }
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: 'ts-loader',
                exclude: [/node_modules/, /\.test\.(ts|tsx)$/],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.wasm$/,
                type: 'webassembly/async',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
    ],
    devServer: {
        static: path.join(__dirname, 'dist'),
        compress: true,
        port: 3000,
        proxy: { 
            '/api': {
                target: 'http://localhost:5000',
                secure: false,
            },
        },
    },
    experiments: {
        asyncWebAssembly: true, 
    }
};
