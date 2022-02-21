const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');

module.exports = (_, argv) => {
    let type = 'development';

    if (argv.production) {
        type = 'production';
    } else if (argv.demo) {
        type = 'demo';
    }

    const base = {
        mode: 'production',
        module: {
            rules: [
                {
                    test: /\.(ts|js)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: type === 'development',
                            },
                        },
                    ],
                },
            ],
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
    };

    const library = {
        ...base,
        entry: './src/index.ts',
        output: {
            filename: 'ruler.js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/',
            libraryTarget: 'umd',
            // webpack for amd uses window, which may not be in the nodejs environment.
            // probably corrected in 5 webpack, then it will be possible to delete globalObject
            // https://github.com/webpack/webpack/pull/8625
            globalObject: "typeof self !== 'undefined' ? self : this",
        },
    };

    const demo = {
        ...base,
        entry: './demo/index.ts',
        output: {
            filename: 'demo.js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/',
        },
    };

    if (type === 'production') {
        return [library];
    }

    if (type === 'demo') {
        return [library, demo];
    }

    const devConfig = {
        mode: 'development',
        devtool: 'eval-source-map',
        plugins: [new ForkTsCheckerWebpackPlugin()],
        devServer: {
            contentBase: path.resolve(__dirname, 'dist'),
            host: 'localhost',
            port: 3000,
            stats: {
                modules: false,
                hash: false,
                version: false,
                assets: false,
                entrypoints: false,
                builtAt: false,
                // https://github.com/TypeStrong/ts-loader#transpileonly-boolean-defaultfalse
                warningsFilter: /export .* was not found in /,
            },
            disableHostCheck: true,
            clientLogLevel: 'error',
            // it is used so that the script can be pulled from another domain, for example, in visual-comparator
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        },
    };

    return [
        { ...library, ...devConfig },
        { ...demo, ...devConfig },
    ];
};
