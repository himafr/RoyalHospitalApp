module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|react-native-image-picker|react-native-toast-message|react-native-vector-icons)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
