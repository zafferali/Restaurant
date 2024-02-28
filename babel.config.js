module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'], // source folder
        alias: {
          common: './src/components/common',
          components: './src/components',
          screens: './src/screens',
          assets: './src/assets',
          images:'./src/assets/images',
          constants: './src/constants',
          // Add more aliases here
        },
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
      },
    ],
  ],
};
