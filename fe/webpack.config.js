module.exports = {
    resolve: {
  
      fallback: {
     
        fs: false,
     
        // eslint-disable-next-line node/no-extraneous-require
     
        'stream': require.resolve('stream-browserify'),
     
        // eslint-disable-next-line node/no-extraneous-require
     
        'buffer': require.resolve('buffer/'),
     
        // eslint-disable-next-line node/no-extraneous-require
     
        'util': require.resolve('util/'),
     
        'assert': require.resolve('assert/'),
     
      },
     
     },
  }
  
  