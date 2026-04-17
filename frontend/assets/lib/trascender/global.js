
const app = (typeof angular != 'undefined') ? angular.module('myApp', []) : {};//TODO:angularjs en algun momento desaparecera
app.modules = {};

const createService = function (METHOD, URL, HEADERS) {
	METHOD = METHOD.toUpperCase();

	const URIBuild = function (uri, params) {
		for (let attr in params) {
			uri = uri.replace(":" + attr, params[attr]);
		}
		return uri;
	}

	const execute = function (method, url, body, HEADERS) {
		return new Promise(function (resolve, reject) {
			const xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function () {
				if (xhttp.readyState == 4) {
					if (xhttp.status == 401) {
						location.reload();
					}
					try {
						xhttp.json = JSON.parse(xhttp.responseText);
						resolve(xhttp.json);
					} catch (e) {
						reject({
							error: e,
							xhttp: xhttp
						});
					}
				}
			};
			xhttp.open(method, url);

			xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
			if (HEADERS) {
				for (attr in HEADERS) {
					xhttp.setRequestHeader(attr, HEADERS[attr]);
				}
			}

			if (body != undefined) {
				if (typeof body != "string") {
					body = JSON.stringify(body);
				}
				xhttp.send(body);
			} else {
				xhttp.send();
			}
		});
	}

	if (METHOD == "GET" || METHOD == "DELETE") {
		return function (params) {
			return execute(METHOD, URIBuild(URL, params), undefined, HEADERS);
		}
	} else if (METHOD == "POST" || METHOD == "PUT") {
		return function (params, body) {
			return execute(METHOD, URIBuild(URL, params), body, HEADERS);
		}
	}
}

const createService2 = function (METHOD, URL, HEADERS) {
	METHOD = METHOD.toUpperCase();

	const URIBuild = function (uri, params = {}) {
		for (let attr in params) {
			uri = uri.replace(":" + attr, params[attr]);
		}
		return uri;
	}

	const execute = async function (method, url, body, HEADERS) {
		// Retornamos una Promise para mantener la misma API que antes
		return new Promise(async function (resolve, reject) {
			try {
				// Construimos headers (clonado para no mutar el HEADERS original)
				const headersObj = Object.assign({}, HEADERS || {});
				// Aseguramos Content-Type por defecto tal como en tu código original
				if (!Object.keys(headersObj).some(h => h.toLowerCase() === 'content-type')) {
					headersObj['Content-Type'] = 'application/json;charset=UTF-8';
				}

				const options = {
					method: method,
					headers: headersObj
				};

				// Sólo adjuntamos body para métodos que no sean GET/DELETE
				if (body !== undefined && method !== 'GET' && method !== 'DELETE') {
					options.body = (typeof body === 'string') ? body : JSON.stringify(body);
				}

				const resp = await fetch(url, options);

				// Si el servidor devuelve 401 forzamos reload como en tu versión original
				if (resp.status === 401) {
					location.reload();
				}

				// Leemos como texto y luego intentamos parsear JSON (para replicar el try/catch original)
				const text = await resp.text();

				try {
					const json = JSON.parse(text);
					resolve(json);
				} catch (parseErr) {
					// Estructura similar al reject que usabas: { error: e, xhttp: xhttp }
					// Aquí incluimos la response para depuración
					reject({
						error: parseErr,
						response: resp,
						text: text
					});
				}
			} catch (fetchErr) {
				// Errores de red u otros
				reject({
					error: fetchErr
				});
			}
		});
	}

	if (METHOD == "GET" || METHOD == "DELETE") {
		return function (params) {
			return execute(METHOD, URIBuild(URL, params), undefined, HEADERS);
		}
	} else if (METHOD == "POST" || METHOD == "PUT") {
		return function (params, body) {
			return execute(METHOD, URIBuild(URL, params), body, HEADERS);
		}
	}
}

const createService3 = function (METHOD, URL, HEADERS = {}) {
	const method = METHOD.toUpperCase();
	const VALID_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

	if (!VALID_METHODS.includes(method)) {
		throw new Error(`Invalid HTTP method: ${METHOD}`);
	}

	const URIBuild = (uri, params = {}) => {
		return Object.entries(params).reduce(
			(acc, [key, value]) => acc.replace(`:${key}`, encodeURIComponent(value)),
			uri
		);
	};

	const execute = async (url, body) => {
		const headers = new Headers({
			'Content-Type': 'application/json;charset=UTF-8',
			...HEADERS
		});

		const options = { method, headers };

		if (body !== undefined && !['GET', 'DELETE'].includes(method)) {
			options.body = typeof body === 'string' ? body : JSON.stringify(body);
		}

		const response = await fetch(url, options);

		if (response.status === 401) {
			location.reload();
			//throw new Error('Unauthorized', { cause: { status: 401, response } });
		}

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`, {
				cause: { status: response.status, response }
			});
		}

		const text = await response.text();
		return text ? JSON.parse(text) : null;
	};

	return ['GET', 'DELETE'].includes(method)
		? (params) => execute(URIBuild(URL, params))
		: (params, body) => execute(URIBuild(URL, params), body);
};

const createServices = function (baseurl) {
	return {
		total: createService('GET', baseurl + '/total?query=:query'),
		collection: createService('GET', baseurl + '/collection?query=:query&options=:options'),
		tag: createService('GET', baseurl + '/tag/collection'),
		create: createService('POST', baseurl),
		read: createService('GET', baseurl + '/:id'),
		update: createService('PUT', baseurl + '/:id'),
		delete: createService('DELETE', baseurl + '/:id')
	};
}

const basicGetter = async function (field, service, get, body) {
	//try{
	const response = await service(get, body,);
	if (response.error) {
		throw (response.message);
	} else if (response.resultado != 1) {
		throw (response.descripcion);
	} else {
		this[field] = response.contenido
	}
	//}catch(e){
	//	myError("Error al obtener info", e.error || e.toString());
	//	console.log(e);
	//}	
}

const formatRowToFilter = function (r) {
	let s = "";
	for (attr in r) {
		s += (r[attr] != null) ? r[attr].toString().toLowerCase() : "";
	}
	return s;
}

const SOABF = function (coll, field) {
	return coll.sort(function (a, b) {
		if (a[field] > b[field]) {
			return 1;
		}
		if (a[field] < b[field]) {
			return -1;
		}
		return 0;
	});
}

const sortCollection = function (c, f) {
	this['sortInfo'] = c + '_' + f;
	if (!this['sort_' + c]) {
		this['sort_' + c] = f;
		this[c] = this[c].reverse();
		this['isUpSorted'] = false;
	} else if (this['sort_' + c] === f) {
		this[c] = this[c].reverse();
		this['isUpSorted'] = !this['isUpSorted'];
	} else {
		this['sort_' + c] = f;
		this[c] = SOABF(this[c], f);
		this['isUpSorted'] = true;
	}
}

const getSortClass = function (f, t) {
	return (this.sortInfo === ('coll_' + f) && (this.isUpSorted == t)) ? 'sortIconSelected' : '';
}

const uniqueArray = function (row) {
	return row.filter((value, index, self) => {
		return self.indexOf(value) === index
	});
}

/*************/
/* PAGINATOR */
/*************/

const paginator = function (c, r) {
	this.rowsByPage = r | 5;
	this.restart(c);
}

paginator.prototype.restart = function (c) {
	this.coll = c;
	this.collDisplay = [];
	this.cant = c.length;
	this.setPages();
	this.gotoFirstPage();
}

paginator.prototype.setPages = function () {
	this.totalpages = Math.ceil(this.cant / this.rowsByPage);
	this.pages = [];
	for (var i = 1; i <= this.totalpages; i++) {
		this.pages.push(i);
	}
	this.selectedPage = 1;
}

paginator.prototype.gotoFirstPage = function () {
	//this.obtained = (1*this.rowsByPage) - this.rowsByPage;
	//this.getCollection();
	this.selectedPage = 1;
	this.setCollDisplay();
}

paginator.prototype.gotoPage = function (page) {
	//this.obtained = (page*this.rowsByPage) - this.rowsByPage;
	//this.getCollection();
	this.selectedPage = page;
	this.setCollDisplay();
}

paginator.prototype.gotoLastPage = function () {
	//this.obtained = (this.pages[this.pages.length-1]*this.rowsByPage)-this.rowsByPage;
	//this.getCollection();
	this.selectedPage = this.pages.length;
	this.setCollDisplay();
}

paginator.prototype.gotoPrev = function () {
	if (this.selectedPage != 1) {
		this.gotoPage(this.selectedPage - 1);
	}
}

paginator.prototype.gotoNext = function () {
	if (this.pages.length > this.selectedPage) {
		this.gotoPage(this.selectedPage + 1);
	}
}

paginator.prototype.isSelected = function (page) {
	return (page == this.selectedPage) ? "active" : "";
}

paginator.prototype.getPages = function () {
	if (this.pages.length <= 6) {
		return this.pages;
	} else {
		if (this.selectedPage <= 3) {
			return this.pages.slice(0, 6);
		} else {
			return this.pages.slice(this.selectedPage - 3, this.selectedPage - 3 + 6);
		}
	}
}

paginator.prototype.setCollDisplay = function () {
	const from = (this.selectedPage * this.rowsByPage) - this.rowsByPage;
	const to = (this.selectedPage * this.rowsByPage);
	this.collDisplay = this.coll.slice(from, to);
}

paginator.prototype.getCollection = function () {
	return this.collDisplay;
}

/*******************************/
/*PAGINATOR 2: SERVER PAGINADOR*/
/*******************************/

const ServerPaginator = function (cant, rowsByPage, parent) {
	this.offset = 0;
	this.cant = cant;
	this.rowsByPage = rowsByPage || 10;
	this.parent = parent;
	this.setPages();
}

ServerPaginator.prototype.setPages = function () {
	this.totalpages = Math.ceil(this.cant / this.rowsByPage);
	this.pages = [];
	for (var i = 1; i <= this.totalpages; i++) {
		this.pages.push(i);
	}
	this.selectedPage = 1;
}

ServerPaginator.prototype.gotoFirstPage = function () {
	this.offset = (1 * this.rowsByPage) - this.rowsByPage;
	this.parent.getCollection(true);
	this.selectedPage = 1;
}

ServerPaginator.prototype.gotoPage = function (page) {
	this.offset = (page * this.rowsByPage) - this.rowsByPage;
	this.parent.getCollection(true);
	this.selectedPage = page;
}

ServerPaginator.prototype.gotoLastPage = function () {
	this.offset = (this.pages[this.pages.length - 1] * this.rowsByPage) - this.rowsByPage;
	this.parent.getCollection(true);
	this.selectedPage = this.pages.length;
}

ServerPaginator.prototype.gotoPrev = function () {
	if (this.selectedPage != 1) {
		this.gotoPage(this.selectedPage - 1);
	}
}

ServerPaginator.prototype.gotoNext = function () {
	if (this.pages.length > this.selectedPage) {
		this.gotoPage(this.selectedPage + 1);
	}
}

ServerPaginator.prototype.isSelected = function (page) {
	return (page == this.selectedPage) ? "active" : "";
}

ServerPaginator.prototype.getPages = function () {
	if (this.pages.length <= 10) {
		return this.pages;
	} else {
		if (this.selectedPage <= 5) {
			return this.pages.slice(0, 10);
		} else {
			return this.pages.slice(this.selectedPage - 5, this.selectedPage - 5 + 10);
		}
	}
}

/********/
/* SWAL */
/********/

const myConfirm = function (title) {
	return new Promise(function (resolve, reject) {
		Swal.fire({
			title: title,
			showDenyButton: false,
			showCancelButton: true,
			confirmButtonText: 'Aceptar',
			cancelButtonText: 'Cancelar',
		}).then((result) => {
			if (result.isConfirmed) {
				resolve(true);
			} else {
				resolve(false);
			}
		});
	});
}

const myError = function (title, msg) {
	Swal.fire({
		icon: 'error',
		title: title,
		text: msg
	});
}

/************ */
/* GET PARAMS */
/************ */
const urlParams = new URLSearchParams(window.location.search);

/******* */
/*RANDOM */
/******* */
const newRandom = function (length) {
	const possibleChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let text = "";
	for (let i = 0; i < length; i++) {
		text += possibleChar.charAt(Math.floor(Math.random() * possibleChar.length));
	}
	return text;
}

/** BASE 64 */
const getBase64 = function (file) {
	return new Promise(function (resolve, reject) {
		try {
			console.log(file);
			const reader = new FileReader();
			reader.fileName = file.name
			reader.readAsDataURL(file);
			reader.onload = function () {
				const doc = new Object();
				doc.filename = newRandom(10) + '.jpg';//file.name
				doc.fileB64 = reader.result.split(',')[1];
				resolve({ data: doc });
			};
			reader.onerror = function (error) {
				resolve({ data: null, error: error });
			};
		} catch (error) {
			resolve({ data: null, error: error });
		}
	});
}

/*********************** */
/**VALIDA RUT XXXXXXXX-X */
/*********************** */
const Rut = {
	valida: function (rutCompleto) {
		rutCompleto = rutCompleto.replace(/\./g, '')
		if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto))
			return false;
		const tmp = rutCompleto.split('-');
		const digv = tmp[1].toLowerCase();
		const rut = tmp[0];
		return (Rut.dv(rut) == digv);
	},
	dv: function (T) {
		var M = 0, S = 1;
		for (; T; T = Math.floor(T / 10))
			S = (S + T % 10 * (9 - M++ % 6)) % 11;
		return S ? S - 1 : 'k';
	},
	obtenerRut: function (rutCompleto) {
		return rutCompleto.replace(/\./g, '').split('-')[0];
	}
}

const validaMail = function (email) {
	if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
		return false;
	}
	return true;
}


/****************** */
/**GET FECHA MOMENT */
/****************** */
const getFecha = function (data, type, row) {
	if (!data) return '';
	if (arguments.length === 1) type = 'display';
	var m = moment(data, 'YYYY-MM-DD HH:mm:ss.S');
	return m.format(type === 'sort' || type === 'type' ? 'x' : 'DD-MM-YYYY HH:mm');
}


/****************/
/*DOWNLOAD FILES*/
/****************/
const downloadFile = function (blob, filename) {

	const nav = window.navigator;

	if (nav && typeof nav.msSaveOrOpenBlob === 'function') {
		nav.msSaveOrOpenBlob(blob, filename);
		return;
	}

	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');

	a.href = url;
	a.download = filename;
	a.style.display = 'none';
	document.body.appendChild(a);
	a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

	setTimeout(() => {
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}, 150);

}

//20251112:no recuerdo donde se usa
const downloadCSV = function (data, filename) {
	const csvFile = new Blob([data], { type: "text/csv;charset=utf8" });
	const downloadLink = document.createElement("a");
	downloadLink.download = filename;
	downloadLink.href = window.URL.createObjectURL(csvFile);
	downloadLink.style.display = "none";
	document.body.appendChild(downloadLink);
	downloadLink.click();
}
//20251112:no recuerdo donde se usa
const downloadXLSX = function (data, filename) {
	console.log(data);
	var workbook = XLSX.utils.book_new(),
		worksheet = XLSX.utils.aoa_to_sheet(data);
	workbook.SheetNames.push("First");
	workbook.Sheets["First"] = worksheet;
	XLSX.writeFile(workbook, filename + '.xlsx');
}


/*******/
/*TOUCH*/
/*******/
const addTouchEvent = function (element, parent, callback) {

	let xDown, yDown, detectSwipe;

	const getTouches = function (evt) {
		return evt.touches || // browser API
			evt.originalEvent.touches; // jQuery
	}

	const handleTouchStart = function (evt) {
		const firstTouch = getTouches(evt)[0];
		xDown = firstTouch.clientX;
		yDown = firstTouch.clientY;
	}

	const handleTouchMove = function (evt) {
		if (!xDown || !yDown) {
			return;
		}
		var xUp = evt.touches[0].clientX;
		var yUp = evt.touches[0].clientY;
		var xDiff = xDown - xUp;
		var yDiff = yDown - yUp;
		if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
			if (xDiff > 0) {
				detectSwipe = 'left';
			} else {
				detectSwipe = 'right';
			}
		} else {
			if (yDiff > 0) {
				detectSwipe = 'up';
			} else {
				detectSwipe = 'down';
			}
		}
		/* reset values */
		xDown = null;
		yDown = null;
	}

	document.querySelector(element).addEventListener('touchstart', (evt) => { handleTouchStart(evt) });
	document.querySelector(element).addEventListener('touchmove', (evt) => { handleTouchMove(evt) });
	document.querySelector(element).addEventListener('touchend', () => { parent[callback](detectSwipe); detectSwipe = null; });

}

/******/
/*COPY*/
/******/
const copy = function (content) {
	const aux = document.createElement("input");
	content = content.split("\n").join("");
	aux.setAttribute("value", content);
	document.body.appendChild(aux);
	aux.select();
	document.execCommand("copy");
	document.body.removeChild(aux);
}

const copyLarge = async function (content) {
	try {
		await navigator.clipboard.writeText(content);
		return true;
	} catch (err) {
		// Fallback al método antiguo
		const aux = document.createElement("textarea");
		aux.value = content;
		aux.style.position = "fixed";
		aux.style.opacity = "0";
		document.body.appendChild(aux);
		aux.select();

		try {
			document.execCommand("copy");
			return true;
		} catch (e) {
			console.error("Error al copiar:", e);
			return false;
		} finally {
			document.body.removeChild(aux);
		}
	}
}
/************/
/*SORT ARRAY*/
/************/
const sortArrayByField = function (coll, field) {
	return coll.sort(function (a, b) {
		if (a[field] > b[field]) {
			return 1;
		}
		if (a[field] < b[field]) {
			return -1;
		}
		return 0;
	});
}

/**********/
/*TEXTAREA*/
/**********/
const textareaTab = function (e) {
	var keyCode = e.keyCode || e.which;
	if (keyCode == 9) {
		e.preventDefault();
		var start = this.selectionStart;
		var end = this.selectionEnd;
		// set textarea value to: text before caret + tab + text after caret
		$(this).val($(this).val().substring(0, start) + "\t" + $(this).val().substring(end));
		// put caret at right position again
		this.selectionStart =
			this.selectionEnd = start + 1;
	}
}

/******/
/*WAIT*/
/******/
const wait = function (TIME) {
	return new Promise(function (resolve, reject) {
		setTimeout(function () {
			resolve();
		}, TIME);
	});
};


























/*FLEX RESIZE */
(function () {
	function initFlexResizers() {
		// Buscar todos los elementos que actúen como resizer
		const resizers = document.querySelectorAll('.resizer');

		resizers.forEach((resizer, index) => {
			// Por defecto, asume que el panel a redimensionar es el elemento anterior (el sidebar).
			// Se puede sobrescribir usando data-target="#mi-sidebar"
			const targetSelector = resizer.getAttribute('data-target');
			const targetPanel = targetSelector ? document.querySelector(targetSelector) : resizer.previousElementSibling;

			if (!targetPanel) return;

			// Es posible configurar estos valores usando atributos data-* en el HTML
			const minWidth = parseInt(resizer.getAttribute('data-min-width') || '120', 10);
			const maxWidth = parseInt(resizer.getAttribute('data-max-width') || '600', 10);
			const collapsedWidth = parseInt(resizer.getAttribute('data-collapsed-width') || '10', 10);

			// Clave para localStorage, usa un ID si lo tiene o el índice para hacerla única
			const storageKey = resizer.getAttribute('data-storage-key') || ('flexResizerWidth_' + (targetPanel.id || index));

			let isResizing = false;
			let lastWidth = parseInt(targetPanel.style.width || '300', 10);

			const onBlur = () => {
				if (isResizing) {
					isResizing = false;
					document.body.classList.remove('resizing');
				}
			};

			window.addEventListener('blur', onBlur);

			resizer.addEventListener('mousedown', (e) => {
				e.preventDefault();
				isResizing = true;
				document.body.classList.add('resizing');
			});

			document.addEventListener('mousemove', (e) => {
				if (!isResizing) return;

				// Calculamos el ancho relativo midiendo desde el inicio del panel
				const targetRect = targetPanel.getBoundingClientRect();
				let newWidth = e.clientX - targetRect.left;

				if (newWidth <= minWidth) {
					// Colapsar
					targetPanel.classList.add('resizer-collapsed');
					targetPanel.style.width = collapsedWidth + 'px';
				} else {
					// Expandir
					targetPanel.classList.remove('resizer-collapsed');

					if (newWidth > maxWidth) {
						newWidth = maxWidth;
					}

					targetPanel.style.width = newWidth + 'px';
					lastWidth = newWidth;

					localStorage.setItem(storageKey, newWidth);
				}
			});

			document.addEventListener('mouseup', () => {
				if (isResizing) {
					isResizing = false;
					document.body.classList.remove('resizing');
				}
			});

			// Click en el panel colapsado para expandirlo al tamaño anterior
			targetPanel.addEventListener('click', () => {
				if (targetPanel.classList.contains('resizer-collapsed')) {
					targetPanel.classList.remove('resizer-collapsed');

					const savedWidth = localStorage.getItem(storageKey);
					const width = savedWidth ? parseInt(savedWidth, 10) : lastWidth;

					targetPanel.style.width = width + 'px';
				}
			});

			// Restaurar el ancho guardado la primera vez que se renderiza
			const savedWidth = localStorage.getItem(storageKey);
			if (savedWidth) {
				lastWidth = parseInt(savedWidth, 10);
				targetPanel.style.width = lastWidth + 'px';

				if (lastWidth <= minWidth) { // Si quedó colapsado la última vez
					targetPanel.classList.add('resizer-collapsed');
					targetPanel.style.width = collapsedWidth + 'px';
				} else {
					targetPanel.classList.remove('resizer-collapsed');
				}
			}
		});
	}

	// Auto-iniciar al cargar el DOM
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initFlexResizers);
	} else {
		initFlexResizers();
	}

	// Guardar en window por si el proyecto recarga el DOM dinámicamente (ej. Vue/React)
	// y se necesita volver a adjuntar los eventos llamando a window.FlexResizer.init()
	window.FlexResizer = {
		init: initFlexResizers
	};

})();
