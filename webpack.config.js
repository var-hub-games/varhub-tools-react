const path = require('path');

module.exports = (env) => {
    if (!env) env = {};
    const PRODUCTION = env.production === undefined ? false : env.production;

    return {
        devtool: 'source-map',
        mode: PRODUCTION ? 'production' : 'development',
        entry: {
            index: './src/index.ts',
        },
        externals: {
            react: {
                commonjs: 'react',
                commonjs2: 'react',
                amd: 'react',
                root: 'React',
            },
        },
        output: {
            path: path.join(__dirname, 'dist'),
            filename: 'index.js',
            library: {
                name: 'VarHubTools',
                type: 'umd2',
            },
        },
        resolve: {
            extensions: ['.ts','.tsx', '.js']
        },
        module: {
            rules: [
                // Правило для .ts .tsx
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/,
                },
            ]
        },
    };
};