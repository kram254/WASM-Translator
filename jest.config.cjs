module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom', 
  setupFilesAfterEnv: ['<rootDir>/src/wasm/jest.setup.ts'], 
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
};



