import App from './app/index.vue'
import components from './components/index'
import dict from './pages/dict'
import routes from './pages/routes'
import './sass/index.scss'
;(async function () {
  const kooteam = 'kooteam'
  const fix = '_'
  __webpack_public_path__ = zen.path(kooteam)
  // 提前初始化，声明是portal
  const { pathname } = window.location
  const whiteURLS = ['/login', '/_auth']
  for (let i = 0; i < whiteURLS.length; i++) {
    if (pathname.indexOf(whiteURLS[i]) > -1) {
      window._apps = []
    }
  }
  if (window._apps) {
    return zen.setup({
      com: App,
      routes,
      dict,
      components,
    })
  }
  const data = await $.get({
    url: '/kooteam/api/home/apps',
  })
  const paths = pathname.split('/')
  const currentName = paths.length > 1 ? paths[1] : ''
  let currentApp = null
  if (data) {
    window._apps = data
      .filter(item => item.status)
      .map(item => {
        item.tag = fix + item.tag
        !item.alias && (item.alias = item.name + fix)
        if (item.alias === currentName) {
          currentApp = item
        }
        return item
      })
    !currentApp && (currentApp = window._apps[0])
  }
  zen.setup({
    com: App,
    dict,
    components,
    callback: () => {
      const timer = setInterval(async () => {
        const rootDom = document.getElementById('J_app')
        if (!rootDom) {
          return
        }
        clearInterval(timer)
        const prefix = currentApp
          ? pathname.substring(currentApp.alias.length + 1)
          : '/' + kooteam + fix
        const path = prefix + window.location.search
        // if (currentApp) {
        //   await $.loadApp(currentApp.name, path)
        //   zen.app = currentApp
        // }
        await $.loadApp(currentApp?.name || kooteam, path)
        if (!currentApp || currentApp.name == kooteam) {
          $.emit('menuUpdate', { name: path.substring(1) })
          zen.setup({
            com: App,
            routes,
            dict,
            components,
          })
        } else {
          zen.app = currentApp
        }
      }, 10)
    },
  })
})()
