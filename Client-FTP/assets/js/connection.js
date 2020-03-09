function getInputsValue() {
    return Object.values(document.querySelectorAll('input')).map(el => el.value)
}

function connection(e) {
    ipcRenderer.send('connection', {id: localStorage.getItem('id'), data: getInputsValue()})
}

function loadNewPage(event, data) {
    data = JSON.parse(data)
    if(data.success) {
        localStorage.setItem('path', data.path)
        localStorage.setItem('directories', JSON.stringify(data.directories))
        location.href = 'dashboard.html'
    } else {
        instanceToast(data.message)
    }
}

function getSocketId(event, data) {
    localStorage.setItem('id', data.id)
}

function main() {
    ipcRenderer.send('socket-id', 'id')
    ipcRenderer.on('load-page', loadNewPage)
    ipcRenderer.on('socket-id', getSocketId)
    listeners()
}

function listeners() {
    document.getElementById('connect').addEventListener('click', connection)
}

document.addEventListener('DOMContentLoaded', main)