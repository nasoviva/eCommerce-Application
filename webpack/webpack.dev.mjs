import { merge } from "webpack-merge";
import common from "./webpack.common.mjs";
import path from "node:path";

export default merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  output: {
    publicPath: "/",
  },
  devServer: {
    static: {
      directory: path.resolve(process.cwd(), "public"),
    },
    open: true,
    port: 8081,
    historyApiFallback: true,
    hot: true,
  },
});
