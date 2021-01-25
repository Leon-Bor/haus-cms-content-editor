import path from 'path';
import webpack from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

const config = (env: any) => {
  console.log(env);

  const isProd = !env?.WEBPACK_SERVE;
  console.log('Production: ', isProd);
  return {
    entry: './src/index.tsx',
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
            },
          },
        },
        {
          test: /\.(scss|css)$/,
          use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack'],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.scss', '.css', '.svg'],
      alias: {
        environment: path.resolve(__dirname, `./src/environments/environment${isProd ? '.prod' : ''}.ts`),
      },
    },
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'bundle.js',
    },
    devServer: {
      contentBase: path.join(__dirname, 'build'),
      compress: true,
      port: 4000,
    },
    plugins: [
      // new ForkTsCheckerWebpackPlugin({
      //   async: false,
      //   eslint: {
      //     files: './src/**/*.tsx',
      //   },
      // }),
    ],
  };
};

export default config;
