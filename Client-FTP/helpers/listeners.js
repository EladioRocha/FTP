const { ipcMain, remote } = require('electron')
const path = require('path')
const tcpClient = require(path.join(__dirname, 'TCPClient'))
ipcMain.on('connection', connect)
ipcMain.on('close-session', closeSession)
ipcMain.on('socket-id', getSocketId)

function getSocketId(event, data) {
    event.reply('socket-id', {success: true, message: 'Conexión establecida con éxito', id: tcpClient.response})
}

function connect(event, data) {
    verifyDataUser(data[0], data[1])
    tcpClient.message({id: data.id, verb: 'join', username: data.data[0], password: data.data[1]})
    setTimeout(() => {
        console.log(tcpClient.response)
        event.reply('load-page', tcpClient.response)
    }, 1000) // ARREGLAR ESTA PARTE NECESITO HACER QUE NO SEA CON UN INTERVAL SI NO QUE ES CON EVENTOS SEGURAMENTE

    // event.reply('load-page', (db.get('users').find({'username': data[0], 'password': data[1]}).value()) ? {success: true, message: 'Datos de usuario son correctos'} : {success: false, message: 'Datos del usuario son incorrectos'})
}

function verifyDataUser() {
    
}

function closeSession(event, data) {
    event.reply('close-session', {success: true, message: 'Cierre de sesión exitoso'})
}