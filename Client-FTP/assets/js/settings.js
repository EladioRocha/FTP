const { ipcRenderer } = require('electron')

function instanceToast(message = '') {
    var toastHTML = `<span>${message}</span>`
    M.toast({html: toastHTML});
}