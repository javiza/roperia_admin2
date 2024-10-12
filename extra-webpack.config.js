const path = require('path');

module.exports = {
    resolve: {
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        vm: require.resolve('vm-browserify'),
        stream: require.resolve('stream-browserify')
      }
    }
  };
  
