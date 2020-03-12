let createFolderInto = '',
    multipleFiles = { data: [], verb: 'mput' }

function main() {
    ipcRenderer.on('upload-file', (event, data) => {
        data = JSON.parse(data);
        instanceToast(data.message);
        resetSwipeRoot()
        addDirectories(data.directories, localStorage.getItem('pathServer'), 'server-root', true)
        document.querySelectorAll('.collapsible').forEach(el => M.Collapsible.init(el))
    })
    ipcRenderer.on('download-file', (event, data) => {
        data = JSON.parse(data);
        instanceToast(data.message);
        resetSwipeLocal()
        addDirectories(data.directories, localStorage.getItem('path'), 'local-root')
        document.querySelectorAll('.collapsible').forEach(el => M.Collapsible.init(el))
    })
    ipcRenderer.on('create-directory', (event, data) => {
        data = JSON.parse(data)
        instanceToast(data.message);
    })
    ipcRenderer.on('set-directory', (event, data) => {
        data = JSON.parse(data)
        let pathLcd = document.querySelector('#current-directory-local'),
            pathCd = document.querySelector('#current-directory-server')
        if (data.success) {
            localStorage.removeItem('cd')
            localStorage.removeItem('lcd')
            localStorage.setItem('lcd', pathLcd.value)
            localStorage.setItem('cd', pathCd.value)
            resetSwipeLocal()
            resetSwipeRoot()
            addDirectories(data.local, localStorage.getItem('path'), 'local-root')
            addDirectories(data.root, localStorage.getItem('pathServer'), 'server-root', true)
            document.querySelectorAll('.collapsible').forEach(el => M.Collapsible.init(el))
        } else {
            pathLcd.value = localStorage.getItem('lcd')
            pathCd.value = localStorage.getItem('cd')
            localStorage.setItem('cd', document.querySelector('#current-directory-server').value)
        }
        instanceToast(data.message);
    })
    ipcRenderer.on('delete-directory', (event, data) => {
        data = JSON.parse(data) 
        if(data.success) {
            resetSwipeRoot()
            addDirectories(data.directories, localStorage.getItem('pathServer'), 'server-root', true)
        }
        instanceToast(data.message)
    })
    setPathName()
    addDirectories(JSON.parse(localStorage.getItem('directories')), localStorage.getItem('path'), 'local-root')
    addDirectories(JSON.parse(localStorage.getItem('server')), localStorage.getItem('pathServer'), 'server-root', true)
    materializeSettings()
    listeners()
}

function resetSwipeRoot() {
    document.querySelector('#server-root').innerHTML = ''
}

function resetSwipeLocal() {
    document.querySelector('#local-root').innerHTML = ''
}

function materializeSettings() {
    M.Tabs.init(document.querySelector('#tabs-swipe'), { swipeable: true });
    document.querySelectorAll('.collapsible').forEach(el => M.Collapsible.init(el))
    M.Modal.init(document.querySelectorAll('.modal'));
}

function closeSession() {
    localStorage.removeItem('path')
    localStorage.removeItem('id')
    location.href = 'index.html'
}

function listeners() {
    document.getElementById('close-session').addEventListener('click', closeSession)
}

function setPathName() {
    let client = document.querySelectorAll('.local-root'),
        server = document.querySelector('#current-directory-server')
    path = localStorage.getItem('path')
    client[0].innerText = path
    client[1].value = `${path}/`
    server.value = localStorage.getItem('cd') + '/'
}

function openModal(e) {
    if (e.target.classList.contains('create-new-folder')) {
        M.Modal.getInstance(document.querySelector('.modal')).open()
        createFolderInto = e.target.parentNode.parentNode.nextElementSibling
    }
}

function addFolder(e) {
    let folder = document.querySelector('#new-folder'),
        paths = [];
    createFolderInto.innerHTML += collapsibleHTML(folder.value, false)
    folder.value = ''
    document.querySelectorAll('.collapsible').forEach(el => M.Collapsible.init(el))
    ipcRenderer.send('create-directory', getPath(createFolderInto.children[(createFolderInto.children.length - 1)].children[0].children[0].children[1], paths, 'mkdir'))
}


function addDirectories(dirs, pathDefaultName, selector, serverDir = false) {
    let root = '' // Type HTMLElement,

    for (let dir of dirs) {
        for (let [i, name] of dir.fullPath.split('\\').entries()) {
            if (name !== pathDefaultName && i > 0) {
                if ((dir.fullPath.split('\\').length - 1) === i) {
                    if (!dir.lastIsDirectoy) {
                        root.parentElement.nextElementSibling.innerHTML += collapsibleHTMLFile(name, serverDir)
                        root = root.parentElement.nextElementSibling
                    } else {
                        root.parentElement.parentElement.children[1].innerHTML += collapsibleHTML(name, serverDir)
                        root = root.parentElement.parentElement.children[1].lastElementChild.children[0].children[0].children[1]
                    }
                } else {
                    if (root.innerText === pathDefaultName) {
                        for (let elem of root.parentElement.nextElementSibling.children) {
                            if (elem.nodeName === 'UL') {
                                let elemTxt = elem.children[0].children[0].children[1]
                                if (name === elemTxt.innerText) {
                                    root = elemTxt
                                }
                            }
                        }
                    } else {
                        for (let elem of root.parentElement.nextElementSibling.children) {
                            if (elem.nodeName === 'UL') {
                                let elemTxt = elem.children[0].children[0].children[1]
                                if (name === elemTxt.innerText) {
                                    root = elemTxt
                                }
                            }
                        }
                    }
                }
            } else {
                root = document.querySelector(`.${selector}`)
            }
        }
    }
}

function collapsibleHTML(folderName, isServerSwipe = true) {
    return `
    <ul class="collapsible">
        <li>
            <div class="collapsible-header">
                <i class="material-icons">folder</i>
                <span class="local-root">${folderName}</span>
                <i class="material-icons">arrow_drop_down</i>
                <span class="new badge white">
                    ${!isServerSwipe ? '<i class="material-icons create-new-folder white btn-create-directory">create_new_folder</i>' : '<i class="material-icons white delete-directory">delete_forever</i>'}
                </span>
            </div>
            <div class="collapsible-body"></div>
        </li>
    </ul>`
}

function collapsibleHTMLFile(filename, isServerSwipe = true) {
    return `
    <div class="collapsible-body-file">
        <i class="material-icons left">insert_drive_file</i>
        ${filename}
        <i class="material-icons right ${!isServerSwipe ? 'btn-upload' : 'btn-download'}">${!isServerSwipe ? 'file_upload' : 'file_download'}</i>
    </div>
    `
}

function uploadFile(e) {
    if (e.target.classList.contains('btn-upload')) {
        let paths = [e.target.parentElement.innerText.split('\n')[1]]
        ipcRenderer.send('upload-file', getDirectory(e.target.parentElement.parentElement.parentElement.children[0], paths, 'put'))
    }
}

function downloadFile(e) {
    if (e.target.classList.contains('btn-download')) {
        let paths = [e.target.parentElement.innerText.split('\n')[1]]
        console.log(e.target.parentElement.parentElement.parentElement.children[0])
        ipcRenderer.send('download-file', getDirectory(e.target.parentElement.parentElement.parentElement.children[0], paths, 'get'))
    }
}

// This function works with the upload file to server or user download from server
function getDirectory(dir, paths, verb) {
    while (true) {
        try {
            paths.push(dir.innerText.split('\n')[1])
            dir = dir.parentElement.parentElement.parentElement.parentElement.children[0]
        } catch (error) {
            let url = ''
            paths.pop()
            for (let i = (paths.length - 1); i >= 0; i--) {
                url += paths[i] + '/'
            }
            return { paths, dir: url, cd: localStorage.getItem('cd'), id: localStorage.getItem('id'), verb, lcd: localStorage.getItem('lcd'), path: localStorage.getItem('path') }
        }
    }
}

// This function works when the user create new folder document
function getPath(dir, paths, verb) {
    console.log(dir)
    while (true) {
        try {
            paths.push(dir.innerText)
            dir = dir.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].children[0].children[1]
        } catch (error) {
            let url = ''
            for (let i = (paths.length - 1); i >= 0; i--) {
                url += paths[i] + '/'
            }
            return { paths, dir: url, cd: localStorage.getItem('cd'), id: localStorage.getItem('id'), verb, lcd: localStorage.getItem('lcd'), path: localStorage.getItem('path') }
        }
    }
}

function setDirectory(e) {
    ipcRenderer.send('set-directory', { path: e.target.parentElement.parentElement.parentElement.children[1].children[1].value, verb: 'path', local: localStorage.getItem('path') })
}

function deleteDirectory(e) {
    if (e.target.classList.contains('delete-directory')) {
        let paths = []
        ipcRenderer.send('delete-directory', getPath(e.target.parentElement.parentElement.children[1], paths, 'delete'))
    }
}

function ctrlClick(e) {
    if (e.target.classList.contains('collapsible-body-file') && e.ctrlKey) {
        let paths = [],
            containerBtn = document.querySelector('#container-btn-multiple');
        if (e.target.classList.contains('selected')) {
            paths.push(e.target.innerText.split('\n')[1])
            let obj = getDirectory(e.target.parentElement.parentElement.children[0], paths, 'put')
            e.target.classList.remove('selected')
            e.target.classList.remove('grey')
            e.target.classList.remove('ligthen-3')
            let idx = multipleFiles.data.findIndex(data => data.dir === obj.dir)
            delete multipleFiles.data[idx]
            multipleFiles.data = multipleFiles.data.filter(e => !!e)
        } else {
            setBtnUploadOrDownloadText(e.target.children[1])
            e.target.classList += ' grey lighten-3 selected'
            containerBtn.classList.remove('hide')
            paths.push(e.target.innerText.split('\n')[1])
            multipleFiles.data.push(getDirectory(e.target.parentElement.parentElement.children[0], paths, 'put'))
        }
    }
}

function setBtnUploadOrDownloadText(element) {
    if(element.classList.contains('btn-download')) {
        let btnMultiple = document.querySelector('#btn-multiple')
        btnMultiple.innerHTML = `Descargar <i class="material-icons right">file_download</i>`
        multipleFiles.verb = 'mget'
        multipleFiles['lcd'] = localStorage.getItem('lcd')
    }
}

function sendMultipleFiles() {
    ipcRenderer.send('download-file', multipleFiles)
    document.querySelector('#container-btn-multiple').classList.add('hide')
    multipleFiles = {data: [], verb: 'mput'}
    removeClassSelected()
}

function removeClassSelected() {
    for(let elem of document.querySelectorAll('.collapsible-body-file.lighten-3.grey.lighten-3.selected')) {
        elem.classList.remove('selected')
        elem.classList.remove('grey')
        elem.classList.remove('ligthen-3')    
    }
}

document.addEventListener('DOMContentLoaded', main)
document.querySelector('#tab-swipe-1').addEventListener('click', (e) => {
    openModal(e)
    uploadFile(e)
    ctrlClick(e)
})
document.querySelector('#tab-swipe-2').addEventListener('click', (e) => {
    downloadFile(e)
    deleteDirectory(e)
    ctrlClick(e)
})
document.querySelector('#add-folder').addEventListener('click', addFolder)
document.querySelector('#btn-save-lcd').addEventListener('click', setDirectory)
document.querySelector('#btn-save-cd').addEventListener('click', setDirectory)
document.querySelector('#btn-multiple').addEventListener('click', sendMultipleFiles)
