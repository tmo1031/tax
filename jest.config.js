module.exports = {
  preset: 'ts-jest',
  moduleNameMapper: {
    // <rootDir>/docs/src/ にあるすべての .js ファイルを対象にする
    '^@/(.*)$': '<rootDir>/src/$1',
    // 特定のモジュール名から .js 拡張子を削除する
    '^(.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testEnvironment: 'jest-environment-jsdom',
};
