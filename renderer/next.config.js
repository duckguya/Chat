module.exports = {
  // Prefer loading of ES Modules over CommonJS
  // experimental: { esmExternals: true },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = "electron-renderer";
    }

    return config;
  },
};
