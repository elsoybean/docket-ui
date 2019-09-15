/* eslint-disable flowtype/require-valid-file-annotation */
module.exports = function(api) {
  api.cache(true);

  return {
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-export-default-from',
      '@babel/plugin-proposal-export-namespace-from',
    ],
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: true,
          },
        },
      ],
      '@babel/preset-flow',
    ],
    babelrcRoots: ['.', './packages/*'],
  };
};
