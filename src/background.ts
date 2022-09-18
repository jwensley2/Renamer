'use strict';
import {app, BrowserWindow, dialog, ipcMain, Menu, MenuItem, protocol} from 'electron';
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib';
import installExtension, {VUEJS3_DEVTOOLS} from 'electron-devtools-installer';
import path from 'path';
import ElectronStore from 'electron-store';

ElectronStore.initRenderer();

const isDevelopment = process.env.NODE_ENV !== 'production';
declare const __static: string;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    {scheme: 'app', privileges: {secure: true, standard: true}},
]);

async function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 1200,
        height: 700,
        webPreferences: {
            // Required for Spectron testing
            // enableRemoteModule: true,

            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: (process.env.ELECTRON_NODE_INTEGRATION as unknown) as boolean,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
        },
        icon: path.join(__static, 'icon.png'),
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
        if (!process.env.IS_TEST) win.webContents.openDevTools();
    } else {
        createProtocol('app');
        // Load the index.html when not in development
        win.loadURL('app://./index.html');
    }

    setMenu(win);
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtoolsc
        try {
            await installExtension(VUEJS3_DEVTOOLS, {
                loadExtensionOptions: {
                    allowFileAccess: true,
                },
            });
        } catch (e: any) {
            console.error('Vue Devtools failed to install:', e.toString());
        }
    }
    createWindow();
});

function setMenu(window: BrowserWindow) {
    const menu = Menu.getApplicationMenu();

    if (!menu) return;

    const fileMenu = menu.items.find((item) => item.role && item.role.toLowerCase() === 'filemenu');

    if (fileMenu && fileMenu.submenu) {
        fileMenu.submenu.insert(0, new MenuItem({
            label: 'Settings',
            click: async () => {
                window.webContents.send('open-settings');
            },
        }));
        fileMenu.submenu.insert(1, new MenuItem({type: 'separator'}));
    }

    Menu.setApplicationMenu(menu);
}

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit();
            }
        });
    } else {
        process.on('SIGTERM', () => {
            app.quit();
        });
    }
}

ipcMain.on('select-files', (event) => {
    dialog.showOpenDialog({properties: ['openFile', 'multiSelections']}).then((result) => {
        event.reply('files-selected', result);
    });
});