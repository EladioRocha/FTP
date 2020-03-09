let createFolderInto = ''

function main() {
    listeners()
    setPathName()
    materializeSettings()
}

function materializeSettings() {
    M.Tabs.init(document.querySelector('#tabs-swipe'), {swipeable: true});
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
    if(e.target.classList.contains('create-new-folder')) {
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

document.addEventListener('DOMContentLoaded', main)
document.querySelector('#tab-swipe-1').addEventListener('click', openModal)
document.querySelector('#add-folder').addEventListener('click', addFolder)