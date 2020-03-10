const { ipcMain, remote } = require('electron')
const path = require('path')
const tcpClient = require(path.join(__dirname, 'TCPClient'))

ipcMain.on('connection', connect)
ipcMain.on('close-session', closeSession)
ipcMain.on('socket-id', getSocketId)
ipcMain.on('upload-file', uploadFile)
ipcMain.on('download-file', downloadFile)

function getSocketId(event, data) {
    event.reply('socket-id', {success: true, message: 'Conexión establecida con éxito', id: tcpClient.response})
}

function connect(event, data) {
    tcpClient.message({id: data.id, verb: 'join', username: data.data[0], password: data.data[1]})
    sendReply(event, 'load-page')
}

function uploadFile(event, data) {
    tcpClient.message(data)
    sendReply(event, 'upload-file')
}

function downloadFile(event, data) {
    tcpClient.message(data)
    sendReply(event, 'download-file')
}

function sendReply(event, identifier) {
    setTimeout(() => {
        console.log(tcpClient.response)
        event.reply(identifier, tcpClient.response)
    }, 1000) // ARREGLAR ESTA PARTE NECESITO HACER QUE NO SEA CON UN INTERVAL SI NO QUE ES CON EVENTOS SEGURAMENTE
}

function closeSession(event, data) {
    event.reply('close-session', {success: true, message: 'Cierre de sesión exitoso'})
}