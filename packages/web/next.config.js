const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  typescript: {ignoreBuildErrors: true},
  webpack: function (config, { dev, isServer }) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });
    if (!isServer) config.resolve.fallback.fs = false;
    if (!dev) {
      config.plugins.push(
        new CopyPlugin({ patterns: [{ from: 'fonts', to: 'fonts' }] })
      );
    }
    return config;
  }
};
