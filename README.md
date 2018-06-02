# less-packer
combine multiple less file to a bundle file and output for sass and stylus file

## Install

```
npm install less-packer -S
```

## Start

```js
const LessPacker = require('less-packer')
LessPacker({
  entry: 'src/index.less',
  output: 'lib/index.less',
  format: ['sass', 'stylus'],
})
```

### Attribute

| name | intro | type | default |
| -- | -- | -- | -- |
| entry | bundle entry file path | string | `src/index.less` | 
| output | bundle output file path | string | `lib/index.less` | 
| dev | if use dev mode | boolean | `false` | 
| testOutput | test output path while dev | string | `dest/index.css` |
| testFile | test entry path while dev | string | `src/test.less` |
| watchDir | watch dir while dev | string | `src/` |
| format | extra output file type | array | `[sass, stylus]` |
| charset | charset of file | string | `utf8` |

## License

MIT
