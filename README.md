# read-cmd-shim

Figure out what a [`cmd-shim`](https://github.com/ForbesLindesay/cmd-shim)
is pointing at.  This acts as the equivalent of
[`fs.readlink`](https://nodejs.org/api/fs.html#fs_fs_readlink_path_callback).

### Usage

```
var readCmdShim = require('read-cmd-shim')

readCmdShim('/path/to/shim.cmd', function (er, destination) {
  …
})

var destination = readCmdShim.sync('/path/to/shim.cmd')
