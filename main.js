const { app, BrowserWindow, Tray, ipcMain, nativeImage, shell } = require('electron')
const {createCanvas, loadImage} = require("canvas");

(async () => {
	const contextMenu = await import('electron-context-menu')
	contextMenu.default({
	  showSaveImageAs: true
	})
  })()

function createTrayIcon(count = null) {
	const iconPath = app.getAppPath() + "/images/icon.png";
	let   image = nativeImage.createFromPath(iconPath);

	if (count > 0) {
		image = nativeImage.createFromPath(app.getAppPath() + "/images/icon-unread.png");

		Promise.resolve(image);
		// const {width, height} = image.getSize();
		// const canvas = createCanvas(width, height);
		// const context = canvas.getContext('2d');

		// return loadImage(iconPath).then(tmpImage => {
		// 	context.drawImage(tmpImage, 0, 0);
		// 	let radius = canvas.width / 4;
		// 	let x = height - radius;
		// 	let y = radius;
		// 	context.fillStyle = '#ffa200';
		// 	context.beginPath();
		// 	context.arc(x, y, radius, 0, Math.PI * 2, true);
		// 	context.closePath();
		// 	context.fill();
		// 	context.textAlign = "center";
		// 	context.fillStyle = '#000000';
		// 	context.font = "bold " + (radius + 2) + "px Sans";
		// 	context.fillText(count, x, y + 18);
		// 	data = canvas.toDataURL();

		// 	return nativeImage.createFromDataURL(data);
		// });
	}

	return image;
}


app.whenReady().then(() => {
	let lastCount = 0;
	ipcMain.handle('notification-count', async (e, count) => {
		if (count === lastCount) {
			return;
		}

		let image = createTrayIcon(count);

		if (count > 0) {
			win.flashFrame(true);
			image = await image;
		} else {
			win.flashFrame(false);
		}

		trayIcon.setImage(image);

		lastCount = count;
	});

	const win = new BrowserWindow({
		icon: createTrayIcon(),
		width: 800,
		height: 600,
		webPreferences: {
			webSecurity: false, // Disable cross-origin iframe
			preload: app.getAppPath() + "/preload.js",
			nodeIntegration: true,
			partition: "persist:gchat"
		}
	});

	win.maximize();
	win.minimize();

	win.loadURL('https://chat.google.com');

	win.webContents.setWindowOpenHandler(({ url }) => {
		// open url in a browser and prevent default
		if (url.startsWith("https://www.google.com/url")) {
			const actualURL = new URL(url);
			const params = new URLSearchParams(actualURL.search);
			shell.openExternal(params.get("url"));
			return { action: 'deny' };
		}

		return { action: 'allow' };
	});

	const trayIcon = new Tray(createTrayIcon());
	trayIcon.setToolTip("Chatium");

	function toggleVisible() {
		if (win.isFocused()) {
			win.minimize();
		} else {
			win.show();
			win.focus();
		}
	}
	trayIcon.on("click", toggleVisible);

	const contextMenu = Menu.buildFromTemplate([
		{ label: 'Open', click: () => win.show() },
		{
			label: 'Quit',
			click() {
				app.isQuitting = true
				app.quit()
			}
		}
	]);
	trayIcon.setContextMenu(contextMenu);
});