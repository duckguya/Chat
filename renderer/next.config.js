const Dotenv = require("dotenv-webpack");

/** @type {import('next').NextConfig} */
module.exports = {
  compiler: {
    styledComponents: true,
  },
  // Prefer loading of ES Modules over CommonJS
  experimental: { esmExternals: true },
  webpack: (config, { isServer }) => {
    config.plugins.push(new Dotenv({ silent: true }));
    if (!isServer) {
      config.target = "electron-renderer";
    }

    return config;
  },
};
