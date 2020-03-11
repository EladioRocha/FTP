// // ==================== MODULES ==================== //
const net = require("net")
const fs = require("fs")
const path = require('path')

// // ==================== GLOBAL ==================== //
let noFiles = [];
let pid = 1

// try {

// async function evalua(valor, socket) {
// 	console.log('VALOORR', valor)
// 	//valor = valor.substring(0, valor.length-1);
// 	let re = /(JOIN|GET|PUT|LCD|CD|LS|MPUT|MGET|RMDIR) (\d|\D)+$|(CLOSE|PWD)$/igm,
// 		response = '',
// 		valores = valor.split(' ').filter((e) => e.trim(' ') !== '');
// 	noFiles = ['No se pudieron localizar el/los siguiente archivos: ']

// 	if(!socket.session.user && valores[0].toLowerCase() !== 'join') {
// 		return 'No has iniciado sesión'
// 	}

// 	if (re.test(valor)) {
// 		console.log('works')
// 		acum = ''
// 		if (valores[0].toUpperCase().indexOf('JOIN') > -1) {
// 			// if(Object.keys(sessions1.filter(e => e === valores[1]).length > 0)) {
// 			//     return "El usuario ya tiene una sesión activa"
// 			// }
// 			if (await validausuario(valores[1] + ":" + valores[2])) {
// 				socket.session.user = valores[1]
// 				socket.session.lcd = './luis'
// 				socket.session.pwd = './luis'
// 				createDirectory(socket.session.user)
// 				response = "usuario valido"
// 			} else
// 				response = "Largo de aqui"
// 		} else {
// 			try {
// 				if (eval(`${valores.shift().trim(' ').trim('\r').trim('\n').toLowerCase()}('${valores.map(file => file.trim(' ').trim('\r').trim('\n'))}', ${JSON.stringify(socket.session)})`)) {
// 					return 'Archvio subido correctamente'
// 				} else {
// 					return noFiles.join('')
// 				}
// 			} catch (error) {
// 				if (valor.trim(' ').toLowerCase() === 'close') {
// 					socket.end('Adios')
// 					return 'destroyed'
// 				}
// 				console.log(error)
// 				response = 'Ha ocurrido un error al escribir el verbo vuelva a intentarlo.'
// 			}

// 		}
// 	}
// 	return response === '' ? 'Comando desconocido' : response;
// }

// function validausuario(text) {
// 	return new Promise((resolve, reject) => {
// 		try {
// 			fs.readFile('./users.dat', function (err, data) {
// 				let lineas = data.toString('utf8').split("\r").map((e) => e.trim('\n')).filter(e => e.trim(' ') != '')
// 				for (let linea of lineas) {
// 					if (linea === text) {
// 						resolve(true)
// 					}
// 				}
// 				resolve(false)
// 			});
// 		} catch (error) {
// 			reject("Ha ocurrido un error")
// 		}
// 	})
// }

// function hilo(socket) {
// 	socket.on('data', async function (data) {
// 		let textChunk = data.toString('utf8');
// 		if (textChunk.indexOf(';')) {
// 			let response = await evalua(textChunk.split(';').shift(), socket)
// 			if (response !== 'destroyed') {
// 				valores = []
// 				acum = '';
// 				socket.write(' ' + response + '\r\n');
// 			}
// 			socket.write(response)

// 		} else {
// 			if (textChunk == '\n' || textChunk == '\r') {

// 			} else {
// 				acum += textChunk
// 			}
// 		}
// 	});
// }

// function get(file, user) {
// 	try {
// 		console.log(file, user.user)
// 		fs.copyFileSync(file, `${user.user}/${file.split('/').pop()}`)
// 		return true
// 	} catch (error) {
// 		console.log(error)
// 		noFiles.push(`--> 	${error.dest.split('/').pop().split(',').shift()} <--`)
// 		return false
// 	}
// }

// function put(file, user) {
// 	try {
// 		console.log(file, user.user)
// 		fs.copyFileSync(`${user.user}/${file}`, 'server/'+file.split('/').pop())
// 		return true
// 	} catch (error) {
// 		console.log(error)
// 		noFiles.push(`--> ${error.dest.split('/').pop().split(',').shift()} <--`)
// 		return false
// 	}
// }

// function mput(...files) {
// 	for (let file of files[0].split(',').map(file => file.trim(' ').trim('\n').trim('\r'))) {
// 		try {
// 			fs.copyFileSync(`./client/${file.trim(' ').trim('\n').trim('\r')}`, `server/${file.split('/').pop()}`)
// 		} catch (error) {
// 			console.log(file);
// 			noFiles.push(` --> ${error.dest.split('/').pop()} <-- `)
// 		}
// 	}
// 	return (noFiles.length > 0) ? false : true;
// }

// function lcd(file, socket) {
// 	console.log(Object.values(socket))
// 	socket.lcd = socket.pwd + '/location'
// 	socket.pwd = socket.lcd
// 	console.log(socket.lcd, socket.pwd)
// 	return true
// }

// function mget(...files) {
// 	for (let file of files[0].split(',').map(file => file.trim(' ').trim('\n').trim('\r'))) {
// 		try {
// 			fs.copyFileSync(`./server/${file.trim(' ').trim('\n').trim('\r')}`, `client/${file.split('/').pop()}`)
// 		} catch (error) {
// 			console.log(file);
// 			noFiles.push(` --> ${error.dest.split('/').pop()} <-- `)
// 		}
// 	}
// 	return (noFiles.length > 0) ? false : true;
// }

// function createDirectory(user) {
// 	if (!fs.existsSync(user)) {
// 		fs.mkdirSync(user)
// 	}
// }

// const server = net.createServer((socket) => {
// 	console.log('works')
// 	socket.session = { id: pid++ }
// 	socket.write('Join <usuario> <password> \r\n');
// 	console.log('working xD')
// 	hilo(socket);
// }).on('error', (err) => {
// 	console.log('Algo malo ocurrio xd', err)
// 	// handle errors here
// 	throw 'ooops';
// });

// server.listen(3000, 'localhost', () => console.log('SERVER WORKS'));
// } catch (error) {
// 	console.log('OOOPS ALGO SALIO MAL', error)
// }

function listenClient(socket) {
	socket.on('data', (data) => {
		data = JSON.parse(data.toString())
		console.log(data)
		socket.write(JSON.stringify(action(data.id, data.verb, data)))
	})
}

function action(id, verb, data) {
	let response = ''
	switch (verb) {
		case 'join':
			if (existUser(data.username, data.password)) {
				let directories = []
				let server = []
				directories = createDirectory(data.username, directories)
				server = serverDirectories('root', server)
				response = { success: true, message: 'Datos de usuario son correctos', path: data.username, directories, server }
			} else {
				response = { success: false, message: 'Datos del usuario son incorrectos' }
			}
		break;
		case 'put':
			response = uploadFile(data)
		break;
		case 'get':
			response = downloadFile(data)
		break;
		case 'mkdir':
			response = createFolder(data)
		break;
		case 'path':
			response = setPath(data)
		break;
	}

	return response
}

function uploadFile(data) {
	let response = ''
	try {
		let directories = []
		fs.copyFileSync(path.join(__dirname, data.dir), path.join(__dirname, data.cd, data.paths.shift()))
		traverseDir('root', directories)
		directories = directories.map((dir) => {
			return {
				fullPath: dir,
				lastIsDirectoy: fs.lstatSync(path.join(__dirname, dir)).isDirectory()
			}
		})
		response = {success: true, message: 'El archivo se ha subido correctamente', directories}
	} catch (error) {
		response = {success: true, message: 'Ha ocurrido un error al subir el archivo'}
	}

	return response
}

function downloadFile(data) {
	let response = ''
	try {
		let directories = []
		fs.copyFileSync(path.join(__dirname, data.dir), path.join(__dirname, data.lcd, data.paths.shift()))
		traverseDir(data.path, directories)
		directories = directories.map((dir) => {
			return {
				fullPath: dir,
				lastIsDirectoy: fs.lstatSync(path.join(__dirname, dir)).isDirectory()
			}
		})
		response = {success: true, message: 'El archivo se ha descargado exitosamente', directories}
	} catch (error) {
		console.log(error)
		response = {success: false, message: 'Ha ocurrido un error al subir el archivo'}
	}

	return response
}

function existUser(username, password) {
	return JSON.parse(fs.readFileSync('db.json')).users.find(user => user.username === username && user.password === password) ? true : false
}

function createFolder({dir}) {
	let response = ''
	try {
		fs.mkdirSync(dir)
		response = {success: true, message: 'El directorio se ha creado correctamente'}
	} catch (error) {
		response = {success: false, message: 'Ha ocurrido un error al crear el directorio'}
	}

	return response
}

function createDirectory(dir, directories) {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir)
	} else {
		traverseDir(dir, directories)
		return directories.map((dir) => {
			return {
				fullPath: dir,
				lastIsDirectoy: fs.lstatSync(path.join(__dirname, dir)).isDirectory()
			}
		})
	}
}

function serverDirectories(dir, server) {
	traverseDir(dir, server)
	return server.map((dir) => {
		return {
			fullPath: dir,
			lastIsDirectoy: fs.lstatSync(path.join(__dirname, dir)).isDirectory()
		}
	})

}

function traverseDir(dir, directories) {
	fs.readdirSync(dir).forEach(file => {
		let fullPath = path.join(dir, file);
		if (fs.lstatSync(fullPath).isDirectory()) {
			directories.push(fullPath)
			traverseDir(fullPath, directories);
		} else {
			directories.push(fullPath)
		}
	});
}

function setPath(data) {
	let response = ''
	try {
		let isValidPath = fs.lstatSync(path.join(__dirname, data.path)).isDirectory()
		if(isValidPath) {
			response = {success: true, message: 'Se ha actualizado la ruta exitosamente'}
		} else {
			response = {success: false, message: 'La ruta especificada no es valida'}		
		}
	} catch (error) {
		response = {success: false, message: 'La ruta especificada no es valida'}		
	}
	
	let root = [],
		local = [];
	traverseDir('root', root)
	root = root.map((dir) => {
		return {
			fullPath: dir,
			lastIsDirectoy: fs.lstatSync(path.join(__dirname, dir)).isDirectory()
		}
	})

	traverseDir(data.local, local)
	local = local.map((dir) => {
		return {
			fullPath: dir,
			lastIsDirectoy: fs.lstatSync(path.join(__dirname, dir)).isDirectory()
		}
	})

	response['root'] = root
	response['local'] = local
	
	return response
}

let server = net.createServer(socket => {
	socket.session = { id: pid++ }
	socket.write(socket.session.id.toString())
	listenClient(socket, socket.session.id.toString())
})

server.listen(3000, '127.0.0.1', () => console.log('SERVER RUNNING'))