const {app, globalShortcut, BrowserWindow} = require('electron')
const path = require('path')

function createWindow () {
  const mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadURL('https://play.geforcenow.com');
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  })
}

app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })

  globalShortcut.register("Shift+`", () => {
    var fs = BrowserWindow.getAllWindows()[0].isFullScreen();
    if(fs)
      BrowserWindow.getAllWindows()[0].setFullScreen(false);
    else
      BrowserWindow.getAllWindows()[0].setFullScreen(true);
  });
})

app.on('browser-window-created', function(e, window) {
  window.setBackgroundColor('#1A1D1F');
  window.setMenu(null);

  if (window.id != 1) {
    var mainWindow = BrowserWindow.fromId(1);
    var mainWindowPosition = mainWindow.getPosition();

    window.setFullScreen(true);
    window.setPosition(mainWindowPosition[0], mainWindowPosition[1]);
    window.center();
  }
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin')
    app.quit();
})
