const webpack = require('webpack')
module.exports = function override(config, env){
  config.resolve.fallback ={
    "fs": false,
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "assert": require.resolve("assert-browserify"),
    "vm": require.resolve("vm-browserify"),
    "process": require.resolve("process/browser"),
    "buffer": require.resolve("buffer")
  };

  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  );

  return config;
}
