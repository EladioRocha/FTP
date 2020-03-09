const Socket = require('net').Socket

class TCPClient extends Socket {

    constructor() {
        super()
        this.connect({
            port: 3000
        })
        
        this.setEncoding('utf8')
        
        this.on('data', (data) => {
            this.response = data
        })
    }
    
    message(data) {
        this.write(JSON.stringify(data))
    }
}

module.exports = new TCPClient