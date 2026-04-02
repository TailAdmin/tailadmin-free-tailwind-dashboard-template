const path = require("path");
const glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const INCLUDE_PATTERN =
  /<include\s+src=["'](.+?)["']\s*\/?>\s*(?:<\/include>)?/gis;

const processNestedHtml = (content, loaderContext, dir = null) =>
  !INCLUDE_PATTERN.test(content)
    ? content
    : content.replace(INCLUDE_PATTERN, (m, src) => {
      const filePath = path.resolve(dir || loaderContext.context, src);
      loaderContext.dependency(filePath);
      return processNestedHtml(
        loaderContext.fs.readFileSync(filePath, "utf8"),
        loaderContext,
        path.dirname(filePath),
      );
    });

// HTML generation
const paths = [];
const generateHTMLPlugins = () =>
  glob.sync("./src/*.html").map((dir) => {
    const filename = path.basename(dir);
    let outputFilename = filename;

    if (filename === "login.html") {
      outputFilename = "auth/login/index.html";
    } else if (filename === "dashboard.html") {
      outputFilename = "dashboard/index.html";
    }

    if (filename !== "404.html") {
      paths.push(outputFilename === filename ? filename : outputFilename.replace("/index.html", ""));
    }

    return new HtmlWebpackPlugin({
      filename: outputFilename,
      template: `./src/${filename}`,
      favicon: `./src/images/favicon.ico`,
      inject: "body",
      publicPath: "/",
    });
  });

module.exports = {
  mode: "development",
  entry: "./src/js/index.js",
  devServer: {
    static: {
      directory: path.join(__dirname, "./build"),
    },
    compress: true,
    port: 4200,
    hot: true,
    historyApiFallback: {
      rewrites: [
        { from: /^\/auth\/login/, to: "/auth/login/index.html" },
        { from: /^\/dashboard/, to: "/dashboard/index.html" },
      ],
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  require("autoprefixer")({
                    overrideBrowserslist: ["last 2 versions"],
                  }),
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        options: {
          preprocessor: processNestedHtml,
        },
      },
    ],
  },
  plugins: [
    ...generateHTMLPlugins(),
    new MiniCssExtractPlugin({
      filename: "style.css",
      chunkFilename: "style.css",
    }),
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build"),
    clean: true,
    assetModuleFilename: "[path][name][ext]",
  },
  target: "web", // fix for "browserslist" error message
  stats: "errors-only", // suppress irrelevant log messages
};
