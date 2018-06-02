const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const less = require('less')
const watch = require('watch')
const less2sass = require('less2sass')
const less2stylus = require('less-to-stylus')
const getDirname = path.dirname

const DEFAULT_OPTIONS = {
  entry: 'src/index.less',
  output: 'lib/index.less',
  dev: false,
  testOutput: 'dest/index.css',
  testFile: 'src/test.less',
  watchDir: 'src/',
  format: ['sass', 'stylus'],
  charset: 'utf8'
}

function read (pathName, charset, target = __dirname) {
  return fs.readFileSync(path.resolve(target, pathName), charset)
}

function resolve (pathName) {
  return path.resolve(__dirname, pathName)
}

function write (pathName, content, charset) {
  fs.writeFileSync(pathName, content, charset)
}

function devMode (testFile, testOutput, charset) {
  let result = read(testFile, charset)
  result = pack(result, testFile, charset)
  const outputFile = resolve(testOutput)
  mkdirp(getDirname(outputFile), function (err) {
    if (err) return console.log(err)
    less.render(result)
      .then(out => {
        write(outputFile, out.css, charset)
      })
      .catch(e => { console.log(e) })
  })
}

function buildMode (entry, output, charset, format) {
  let result = read(entry, charset)
  const outputFile = resolve(output)
  result = pack(result, entry, charset)

  mkdirp(getDirname(outputFile), function (err) {
    if (err) return console.log(err)
    write(outputFile, result, charset)
  })

  if (~format.indexOf('sass')) {
    const sass = less2sass.convert(result)
    const sassFile = outputFile.replace('.less', '.sass')
    write(sassFile, sass, charset)
  }

  if (~format.indexOf('stylus')) {
    const stylus = less2stylus(result)
    const stylusFile = outputFile.replace('.less', '.styl')
    write(stylusFile, stylus, charset)
  }
}

function pack (result, entry, charset) {
  const links = result.match(/@import '(.*)';/g)
  if (links && links.length) {
    links.forEach(link => {
      const entryDir = getDirname(resolve(entry))
      const linkTarget = link.match(/'(.*)'/)[0].replace(/'/g, '')
      const targetFile = read(linkTarget, charset, entryDir)
      const temp = pack(targetFile, entry, charset)
      result = result.replace(link, temp)
    })
  }
  return result
}

module.exports = function LessPacker (options) {
  const {
    entry,
    output,
    dev,
    testOutput,
    testFile,
    watchDir,
    format,
    charset
  } = Object.assign({}, DEFAULT_OPTIONS, options)

  if (dev) {
    console.log('[Less Packer] is watching you...')
    watch.watchTree(resolve(watchDir), function () {
      console.log('compiling...')
      devMode(testFile, testOutput, charset)
      console.log('compiled')
    })
  } else {
    buildMode(entry, output, charset, format)
  }
}
