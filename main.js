const { app, BrowserWindow, Menu, shell } = require('electron')
const path = require('path')

// Remove the default menu bar entirely
Menu.setApplicationMenu(null)

function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    title: 'Sad Cats Idle',
    icon: path.join(__dirname, 'assets', 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  win.loadURL('https://sad-cats.org')

  // Hide scrollbars once the page loads
  win.webContents.on('did-finish-load', () => {
    win.webContents.insertCSS('::-webkit-scrollbar { display: none !important; }')
  })

  // Mirror the page's <title> into the window title bar
  win.webContents.on('page-title-updated', (event, title) => {
    win.setTitle(title || 'Sad Cats Idle')
  })

  // Open Discord OAuth and any external links in system browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // Redirect non-sad-cats navigation to system browser
  win.webContents.on('will-navigate', (event, url) => {
    if (
      !url.startsWith('https://sad-cats.org') &&
      !url.startsWith('https://api.sad-cats.org')
    ) {
      event.preventDefault()
      shell.openExternal(url)
    }
  })
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => app.quit())
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
