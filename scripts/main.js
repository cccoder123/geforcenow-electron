const {app, globalShortcut, BrowserWindow} = require('electron');
const path = require('path');
const userAgent = 'Mozilla/5.0 (X11; CrOS x86_64 13099.85.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.110 Safari/537.36';

var isFullScreen = false;

function createWindow () {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadURL('https://play.geforcenow.com');
}

app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  globalShortcut.register("Super+F", () => {
    isFullScreen = BrowserWindow.getAllWindows()[0].isFullScreen();
    if (isFullScreen) {
      BrowserWindow.getAllWindows()[0].setFullScreen(false);
      isFullScreen = false;
    } else {
      BrowserWindow.getAllWindows()[0].setFullScreen(true);
      isFullScreen = true;
    }
  });
});

app.on('browser-window-created', function(e, window) {
  window.setBackgroundColor('#1A1D1F');
  window.setMenu(null);
  window.webContents.setUserAgent(userAgent);

  window.on('leave-full-screen', function(e, win) {
    if (isFullScreen) {
      BrowserWindow.getAllWindows()[0].setFullScreen(true);
    }
  });

  window.on('page-title-updated', function(e, title) {
    console.log(title);
    if (title.includes('on GeForce NOW')) {
      window.setFullScreen(true);
      isFullScreen = true;
    }
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
