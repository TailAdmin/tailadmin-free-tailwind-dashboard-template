/**
 * TailAdmin — Webpack 5 build configuration.
 *
 * Drives HTML composition, asset copying, and dev-server redirect parity with src/_redirects.
 * For the full project conventions, see AGENTS.md and docs/html-composition.md.
 */

const fs = require("fs");
const path = require("path");
const { globSync } = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const INCLUDE_PATTERN =
  /<include\s+src=["'](.+?)["']\s*\/?>\s*(?:<\/include>)?/gis;

const processNestedHtml = (content, loaderContext, dir = null) =>
  !INCLUDE_PATTERN.test(content)
    ? content
    : content.replace(INCLUDE_PATTERN, (m, src) => {
        let filePath = path.resolve(dir || loaderContext.context, src);
        if (!fs.existsSync(filePath)) {
          // Check common directory fallback (also handling legacy common-* prefix)
          const commonName = path.basename(src).replace(/^common-/, "");
          const commonFallback = path.resolve(
            __dirname,
            "src/partials/common",
            commonName,
          );
          if (fs.existsSync(commonFallback)) {
            filePath = commonFallback;
          } else {
            const rootFallback = path.resolve(
              __dirname,
              "src",
              src.replace(/^\.\//, ""),
            );
            if (fs.existsSync(rootFallback)) {
              filePath = rootFallback;
            }
          }
        }
        loaderContext.dependency(filePath);
        return processNestedHtml(
          loaderContext.fs.readFileSync(filePath, "utf8"),
          loaderContext,
          path.dirname(filePath),
        );
      });

// HTML generation
const generateHTMLPlugins = () => {
  const plugins = [];
  globSync("./src/pages/**/*.html").forEach((filePath) => {
    const rel = filePath.replace(/^(\.\/)?src\/pages\//, "");
    const filename = rel.replace(/\([^)]+\)\/?/g, "");

    plugins.push(
      new HtmlWebpackPlugin({
        filename,
        template: filePath,
        favicon: "./src/images/favicon.ico",
        inject: "body",
      }),
    );
  });
  return plugins;
};

module.exports = {
  mode: "development",
  entry: "./src/js/index.js",
  devServer: {
    static: [
      {
        directory: path.join(__dirname, "./build"),
      },
      {
        directory: path.join(__dirname, "./src"),
      },
    ],
    hot: true,
    compress: true,
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: "/index.html" },
        {
          from: /^\/[^.]+$/,
          to: (context) => context.parsedUrl.pathname + ".html",
        },
      ],
      index: "/error-404.html",
    },
    setupMiddlewares: (middlewares, devServer) => {
      const redirects = [
        // Legacy AI generator routes — matches _redirects (both .html and extensionless)
        ["/code-generator", "/ai-chat/code.html"],
        ["/code-generator.html", "/ai-chat/code.html"],
        ["/image-generator", "/ai-chat/image.html"],
        ["/image-generator.html", "/ai-chat/image.html"],
        ["/text-generator", "/ai-chat/text.html"],
        ["/text-generator.html", "/ai-chat/text.html"],
        ["/video-generator", "/ai-chat/video.html"],
        ["/video-generator.html", "/ai-chat/video.html"],
        // Modals → Dialogs
        ["/modals", "/dialogs.html"],
        ["/modals.html", "/dialogs.html"],
        // AI settings default route
        ["/ai-settings", "/ai-settings/account.html"],
        ["/ai-settings/", "/ai-settings/account.html"],
        ["/ai-settings.html", "/ai-settings/account.html"],
        ["/ai-settings/index.html", "/ai-settings/account.html"],
        // Error pages
        ["/404", "/error-404.html"],
        ["/404.html", "/error-404.html"],
        ["/500", "/error-500.html"],
        ["/500.html", "/error-500.html"],
        ["/503", "/error-503.html"],
        ["/503.html", "/error-503.html"],
      ];

      redirects.forEach(([from, to]) => {
        devServer.app.get(from, (req, res) => res.redirect(301, to));
      });

      middlewares.push({
        name: "not-found-handler",
        middleware: (req, res, next) => {
          if (
            req.method === "GET" &&
            req.headers.accept &&
            req.headers.accept.includes("text/html")
          ) {
            const fs = devServer.compiler.outputFileSystem;
            const path404 = path.join(
              devServer.compiler.outputPath,
              "error-404.html",
            );
            let html404 = null;

            if (fs && fs.existsSync(path404)) {
              html404 = fs.readFileSync(path404, "utf8");
            } else {
              const diskFallback = path.resolve(
                __dirname,
                "build/error-404.html",
              );
              if (require("fs").existsSync(diskFallback)) {
                html404 = require("fs").readFileSync(diskFallback, "utf8");
              }
            }

            if (html404) {
              return res.status(404).type("html").send(html404);
            }
          }
          next();
        },
      });

      return middlewares;
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
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
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
          sources: false,
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
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/_redirects",
          to: "_redirects",
          toType: "template",
        },
        {
          from: "src/images",
          to: "images",
        },
        {
          // MapLibre GL JS v6: ESM-only build — worker must be served as a
          // separate file. Copy it to the build root so setWorkerUrl() can
          // reference it with a simple absolute path (/maplibre-gl-worker.mjs).
          from: "node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs",
          to: "maplibre-gl-worker.mjs",
          noErrorOnMissing: true,
        },
        {
          // v6: the worker imports maplibre-gl-shared.mjs as a sibling at
          // runtime — both files must live in the same directory on the server.
          from: "node_modules/maplibre-gl/dist/maplibre-gl-shared.mjs",
          to: "maplibre-gl-shared.mjs",
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build"),
    clean: true,
    assetModuleFilename: "[path][name][ext]",
  },
  resolve: {
    // Honour the "import" export condition so Webpack resolves
    // ESM-only packages (e.g. maplibre-gl v6) to their .mjs entry
    // instead of looking for a non-existent .js CJS file.
    conditionNames: ["import", "module", "require", "default"],
    extensionAlias: {
      ".js": [".js", ".mjs"],
    },
  },
  target: "web", // fix for "browserslist" error message
  stats: "minimal",
  // maplibre-gl v6's ESM bundle contains an internal dynamic require() expression
  // that Webpack can't statically analyse. This is a known upstream issue —
  // suppress the warning since we cannot change the library source.
  ignoreWarnings: [
    {
      module: /maplibre-gl/,
      message: /Critical dependency/,
    },
  ],
};
