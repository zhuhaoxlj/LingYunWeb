var electron = require('electron')

var app = electron.app
var BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
var mainWindow = null
app.on('ready', () => {
  //隐藏菜单栏
  Menu.setApplicationMenu(null)
  mainWindow = new BrowserWindow({ width: 1280, height: 800 ,frame: false})
  mainWindow.loadFile('index.html')
  mainWindow.on('closed', () => {
    mainWindow = null
  })
})
