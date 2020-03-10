let createFolderInto = ''

function main() {
    addDirectories(JSON.parse(localStorage.getItem('directories')), localStorage.getItem('path'), 'local-root')
    addDirectories(JSON.parse(localStorage.getItem('server')), localStorage.getItem('pathServer'), 'server-root')
    materializeSettings()
    setPathName()
    listeners()
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
        path = localStorage.getItem('path')
    client[0].innerText = path
    client[1].value = `${path}/`
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

function addDirectories(directories, pathName, selector) {
    let root = ''; // Type HTMLElement,
    console.log(directories)
    for (let dir of directories) {
        for (let [i, name] of dir.fullPath.split('\\').entries()) {
            if (name !== pathName && i > 0) {
                if ((dir.fullPath.split('\\').length - 1) === i) {
                    if (!dir.lastIsDirectoy) {
                        root.parentElement.nextElementSibling.innerHTML += collapsibleHTMLFile(name)
                    } else {
                        root.parentElement.nextElementSibling.innerHTML += collapsibleHTML(name)
                        root = root.parentElement.nextElementSibling.children[0].children[0].children[0].children[1]
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
                        root.parentElement.nextElementSibling.innerHTML += collapsibleHTML(name)
                        root = root.parentElement.nextElementSibling.children[0].children[0].children[0].children[1]
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

function collapsibleHTMLFile(filename) {
    return `
    <div class="collapsible-body-file">
        <i class="material-icons left">insert_drive_file</i>
        ${filename}
        <i class="material-icons right btn-upload" data-command="get">file_upload</i>
    </div>
    `
}

function uploadFile(e) {
    if(e.target.classList.contains('btn-upload')) {
        e.target.parentElement.innerText.split('\n')[1]
        e.target.parentElement.parentElement.parentElement.children[0].children[1].innerText
        // ipcRenderer.send('')
    }
}

document.addEventListener('DOMContentLoaded', main)
document.querySelector('#tab-swipe-1').addEventListener('click', (e) => {
    openModal(e)
    uploadFile(e)
})
document.querySelector('#add-folder').addEventListener('click', addFolder)