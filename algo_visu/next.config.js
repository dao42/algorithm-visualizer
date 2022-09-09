// const fs = require("fs");
// const path = require("path");
const withLess = require("next-with-less");
// const lessToJS = require("less-vars-to-js");

// const themeVariables = lessToJS(
//   fs.readFileSync(
//     path.resolve(__dirname, "./public/styles/custom.less"),
//     "utf8"
//   )
// );

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ["page.tsx", "page.ts", "page.jsx", "page.js"],
  lessLoaderOptions: {
    lessOptions: {
      javascriptEnabled: true,
      localIdentName: "[path]___[local]___[hash:base64:5]",
    },
  },
};

module.exports = withLess(nextConfig);
