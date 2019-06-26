module.exports = {
  plugins: ['babel-plugin-espower'],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { node: true },
      },
    ],
  ],
  ignore: ['./build/*.js'],
};
