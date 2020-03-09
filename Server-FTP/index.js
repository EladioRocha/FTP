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
		socket.write(JSON.stringify(action(data.id, data.verb, data.username, data.password)))
	})
}

function action(userId = '', verb = '', ...data) {
	let response = ''
	switch (verb) {
		case 'join':
			if (existUser(data[0], data[1])) {
				let directories = []
				directories = createDirectory(data[0], directories)
				response = { success: true, message: 'Datos de usuario son correctos', path: data[0], directories }
			} else {
				response = { success: false, message: 'Datos del usuario son incorrectos' }
			}
			break;
	}

	return response
}

function existUser(username, password) {
	return JSON.parse(fs.readFileSync('db.json')).users.find(user => user.username === username && user.password === password) ? true : false
}

function createDirectory(path, directories) {
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path)
	} else {
		traverseDir(path, directories)
		console.log(directories[0].split('\\'))
		// console.log(directories.map(fs.lstatSync(el).isDirectory()))
		return 
	}
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

// function getAllDirectories(dir, directories) {
// 	let data = fs.readdirSync(dir)
// 	data.forEach(el => {
// 		let isDirectory = fs.lstatSync(path.join(__dirname, dir, el)).isDirectory()
// 		if(isDirectory) {
// 			console.log(el)
// 			readDirectory(dir, el, directories)
// 		}
// 	})

// 	setTimeout(() => {
// 		console.log(directories)
// 	}, 3000)
// }

// function readDirectory (dir, subdir, directories) {
// 	fs.readdirSync(path.join(dir)).forEach(el => {

// 	})
// }

let server = net.createServer(socket => {
	socket.session = { id: pid++ }
	socket.write(socket.session.id.toString())
	listenClient(socket, socket.session.id.toString())
})

server.listen(3000, '127.0.0.1', () => console.log('SERVER RUNNING'))