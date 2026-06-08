import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import path from "path";

export default {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  watch: true,
  resolve: {
    alias: [
      {
        find: "@server",
        replacement: path.resolve(__dirname, "./src/server/"),
      },
    ],
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
      test: /.html$/,
      loader: 'html-loader?attrs[]=video:src'
    }, {
      test: /.mp4$/,
      loader: 'url?limit=10000&mimetype=video/mp4'
    }
    ]
  }
};
