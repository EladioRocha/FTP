const path = require('path')
const client = require('net').Socket()

require(path.join(__dirname, 'helpers', 'createWindow'))
require(path.join(__dirname, 'helpers', 'listeners'))