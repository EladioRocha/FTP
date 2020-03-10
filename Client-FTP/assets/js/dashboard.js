let createFolderInto = ''

function main() {
    ipcRenderer.on('upload-file', (event, data) => {
        data = JSON.parse(data);
        instanceToast(data.message);
        resetSwipeRoot()
        addDirectories(data.directories, localStorage.getItem('pathServer'), 'server-root', true)
    })
    ipcRenderer.on('download-file', (event, data) => { 
        data = JSON.parse(data); 
        instanceToast(data.message); 
        resetSwipeLocal()
        addDirectories(data.directories, localStorage.getItem('path'), 'local-root')
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
    let folder = document.querySelector('#new-folder')
    createFolderInto.innerHTML += collapsibleHTML(folder.value)
    folder.value = ''
    document.querySelectorAll('.collapsible').forEach(el => M.Collapsible.init(el))
}

function addDirectories(directories, pathName, selector, isServerSwipe = false) {
    let root = ''; // Type HTMLElement,
    console.log(directories)
    for (let dir of directories) {
        for (let [i, name] of dir.fullPath.split('\\').entries()) {
            if (name !== pathName && i > 0) {
                if ((dir.fullPath.split('\\').length - 1) === i) {
                    if (!dir.lastIsDirectoy) {
                        root.parentElement.nextElementSibling.innerHTML += collapsibleHTMLFile(name, isServerSwipe)
                    } else {
                        try {
                            root.parentElement.nextElementSibling.innerHTML += collapsibleHTML(name)
                            root = root.parentElement.nextElementSibling.children[0].children[0].children[0].children[1]
                        } catch (error) {
                            // Silent is golden
                        }
                    }
                } else {
                    try {
                        root = root.parentElement.nextElementSibling.children[0].children[0].children[0].children[1]
                        if (name !== root.innerText) {
                            for (let child of root.parentElement.parentElement.parentElement.parentElement.children) {
                                root = child.children[0].children[0].children[1]
                            }
                        }
                    } catch (error) {
                        try {
                            root.parentElement.nextElementSibling.innerHTML += collapsibleHTML(name)
                            root = root.parentElement.nextElementSibling.children[0].children[0].children[0].children[1]
                        } catch (error) {
                            // Silent is golden
                        }
                    }
                }
            } else {
                root = document.querySelector('.' + selector)
            }
        }
    }
}

function collapsibleHTML(folderName) {
    return `
    <ul class="collapsible">
        <li>
            <div class="collapsible-header">
                <i class="material-icons">folder</i>
                <span class="local-root">${folderName}</span>
                <i class="material-icons">arrow_drop_down</i>
                <span class="new badge white">
                    <i class="material-icons create-new-folder white">create_new_folder</i>
                </span>
            </div>
            <div class="collapsible-body"></div>
        </li>
    </ul>`
}

function collapsibleHTMLFile(filename, isServerSwipe = false) {

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
        ipcRenderer.send('download-file', getDirectory(e.target.parentElement.parentElement.parentElement.children[0], paths, 'get'))
    }
}

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

document.addEventListener('DOMContentLoaded', main)
document.querySelector('#tab-swipe-1').addEventListener('click', (e) => {
    openModal(e)
    uploadFile(e)
})
document.querySelector('#tab-swipe-2').addEventListener('click', (e) => {
    downloadFile(e)
})
document.querySelector('#add-folder').addEventListener('click', addFolder)
document.querySelector('#tabs-swipe > li:nth-child(1)')