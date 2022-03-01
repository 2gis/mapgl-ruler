const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');
const fs = require('fs-extra');

const tsCheckerPlugin = new ForkTsCheckerWebpackPlugin();

copyAssets();

module.exports = (_, argv) => {
    let type = 'development';

    if (argv.production) {
        type = 'production';
    } else if (argv.demo) {
        type = 'demo';
    } else if (argv.test) {
        type = 'test';
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
                                configFile: 'tsconfig.json',
                            },
                        },
                    ],
                },
            ],
        },
        resolve: {
            symlinks: false,
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

    const test = {
        ...base,
        mode: 'development',
        entry: {
            test: './test/index.ts',
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist/test'),
            publicPath: '/',
        },
        devtool: 'eval-source-map',
        plugins: [tsCheckerPlugin],
        stats: 'errors-only',
    };

    const devConfig = {
        mode: 'development',
        devtool: 'eval-source-map',
        plugins: [tsCheckerPlugin],
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

    switch (type) {
        case 'production':
            return [library];
        case 'demo':
            return [library, demo];
        case 'test':
            return test;
        case 'development':
            return [
                { ...library, ...devConfig },
                { ...demo, ...devConfig },
            ];
    }
};

function copyAssets() {
    const root = __dirname;
    const dist = path.join(root, 'dist');

    fs.copySync(path.join(root, 'demo', 'index.html'), path.join(dist, 'index.html'));
    fs.copySync(path.join(root, 'test', 'index.html'), path.join(dist, 'test/index.html'));

    console.log('+ HTML');
}
