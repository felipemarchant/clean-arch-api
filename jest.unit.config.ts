import * as baseConfig from './jest.config'
const config = { ...baseConfig.default, testMatch: ['**/*.spec.ts'] }
module.exports = config
