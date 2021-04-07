import {join} from "path";
import {format} from "url";
import {BrowserWindow, app, ipcMain, Menu} from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";
import {parseBuffer} from "music-metadata";
import * as fs from "fs";

require("@electron/remote/main").initialize();

app.on("ready", async () => {
	await prepareNext("./renderer");

	const mainWindow = new BrowserWindow({
		width: 600,
		height: 600,
		minWidth: 600,
		minHeight: 600,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true
		},
		titleBarStyle: "hiddenInset"
	});

	if (process.platform === "darwin") {
		// TODO: disable menu items when they can't be used
		const DockPrevious = {
			label: "Previous",
			click() {
				mainWindow.webContents.send("pause");
			}
		};

		const DockNext = {
			label: "Next",
			click() {
				mainWindow.webContents.send("next");
			}
		};

		const dockMenu = Menu.buildFromTemplate([
			DockPrevious,
			{
				label: "Play",
				click() {
					mainWindow.webContents.send("previous");
				}
			},
			DockNext
		]);

		app.dock.setMenu(dockMenu);

		ipcMain.on("updateDockMenu", async (_, playing: boolean) => {
			const dockMenu = Menu.buildFromTemplate([
				DockPrevious,
				{
					label: playing ? "Pause" : "Play",
					click() {
						if (playing) {
							mainWindow.webContents.send("pause");
						} else {
							mainWindow.webContents.send("play");
						}
					}
				},
				DockNext
			]);

			app.dock.setMenu(dockMenu);
		});
	}

	const url = isDev
		? "http://localhost:8000/"
		: format({
			pathname: join(__dirname, "../renderer/out/index.html"),
			protocol: "file:",
			slashes: true,
		});

	mainWindow.loadURL(url);
});

app.on("window-all-closed", app.quit);

ipcMain.handle("getMetadata", async (_, location: string) => {
	// TODO: handle enoent - this isn't strictly necessary, as the os is the one handing us the path, not the user, however it won't hurt us to handle it
	let buffer = await fs.readFileSync(location);
	let metadata = await parseBuffer(buffer);

	let {title, artist, album} = metadata.common;
	let duration = Math.floor(metadata.format.duration as number);

	if (!artist) artist = "";
	if (!album) album = "";

	return {
		location,
		metadata: {
			title,
			artist,
			album,
			duration
		}
	};
});