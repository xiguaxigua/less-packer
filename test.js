const LessPacker = require('./index')
LessPacker({
  dev: false,
  entry: 'src/index.less',
  output: 'lib/index.less',
  testOutput: 'dest/index.css',
  testFile: 'src/test.less',
  watchDir: 'src/',
  format: ['sass', 'stylus'],
  charset: 'utf8'
})
