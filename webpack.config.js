const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');
const CssnanoPlugin = require('cssnano-webpack-plugin');

var config = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        default: false,
        defaultVendors: false,
        // vendor chunk
        vendor: {
          name: 'vendor',
          // sync + async chunks
          chunks: 'all',
          // import file path containing node_modules
          test: /node_modules(?!\/tailwindcss)/,
          minSize: 0
        }
      }
    },
    minimizer: [
      new CssnanoPlugin({
        test: /.s?css?$/,
        sourceMap: true
      }),
      new TerserPlugin()
    ]
  },

  context: path.resolve(__dirname, 'src'),
  entry: {
    theme: "./scripts/theme.js",
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css"
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '**/*',
          to: path.join(__dirname, 'dist'),
          globOptions: {
            ignore: ['styles/', 'scripts/', '*.js', '*.scss', '*.sass', '*.css', ]
          }
        }
      ]}, {}),
  ],

  output: {
    path: path.join(__dirname, 'dist/assets/'),
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
            ],
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader' },
          { loader: 'sass-loader'  }
        ]
      },
    ],
  },
  target: 'web'
};


module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'inline-source-map';
  } else {
    config.devtool = 'source-map';
  }
  return config
}
