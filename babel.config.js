// module.exports = {
//   presets: ['module:@react-native/babel-preset'],
// };
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'], // source folder
        alias: {
          components: './src/components',
          screens: './src/screens',
          assets: './src/assets',
          layouts: './src/components/layouts',
          // Add more aliases here
        },
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
      },
    ],
  ],
};
