import * as baseConfig from './jest.config'
const config = { ...baseConfig.default, testMatch: ['**/*.test.ts'] }
module.exports = config
