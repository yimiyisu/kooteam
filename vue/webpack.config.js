const path = require('path')
const ZenPlugin = require('zen-app-plugin')

module.exports = (env, argv) => {
  const target = env && env.target ? env.target : ''
  let mode = argv.mode
  return ZenPlugin({
    target,
    mode,
    name: 'kooteam',
    port: '7053',
    ROOT: path.resolve('./'),
  })
}
