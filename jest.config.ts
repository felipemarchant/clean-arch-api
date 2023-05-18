export default {
  roots: ['<rootDir>/src'],
  // collectCoverage: true
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  // Only ignore implemented interfaces
  coveragePathIgnorePatterns: [
    '<rootDir>/src/presentation/protocols',
    '<rootDir>/src/presentation/controllers/signup/signup-protocols.ts',
    '<rootDir>/src/domain/models/account.ts',
    '<rootDir>/src/domain/usecases/db-add-account.ts'
  ],
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
