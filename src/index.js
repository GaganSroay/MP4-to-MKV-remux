const { 
  app, 
  BrowserWindow
} = require('electron');


const createWindow = ()=>{

  const path = require('path');
  const splash = new BrowserWindow({width: 400, height: 300, frame: false,show:true});
  splash.loadURL(path.join(__dirname, 'splash.html'));
  splash.show()
  splash.once('ready-to-show',()=>{
    const mainWindow = new BrowserWindow({
      width: 800,
      height: 700,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: false,
      },
      show:false
    });
  
    mainWindow.once('ready-to-show', () => {
      const { ipcMain, dialog } = require("electron");
      splash.destroy();
      mainWindow.show();
      ipcMain.handle("folderPathBrowser", async (event, message) => {
        return await dialog.showOpenDialog({properties: ['openDirectory']},  (files) => {
            if (files !== undefined) return files;
        });
      });
      
    });
    mainWindow.setMenu(null)
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    mainWindow.webContents.openDevTools();
  })
  
  

}

app.on('window-all-closed', () => {if (process.platform !== 'darwin') app.quit();});
app.on('activate', () => {if (BrowserWindow.getAllWindows().length === 0) createWindow();});

app.on('ready', createWindow);



