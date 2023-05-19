import MainScene from './scenes/MainScene'
import store from './store'
import { AssetLoader, E, RAFCollection } from './utils'
import GlobalEvents from './utils/GlobalEvents'
import WebGL from './WebGL'

store.RAFCollection = new RAFCollection()
store.AssetLoader = new AssetLoader()

window.urlParams = new URLSearchParams(window.location.search)

store.WebGL = new WebGL()
store.MainScene = new MainScene()

GlobalEvents.detectTouchDevice()
GlobalEvents.enableRAF(true)
GlobalEvents.enableResize()
GlobalEvents.enableMousemove()

window.store = store

store.AssetLoader.load().then(() => {
	E.emit('App:start')

	if (new URLSearchParams(window.location.search).has('gui')) {
		import('./utils/Gui').then(({ Gui }) => {
			store.Gui = new Gui()
		})
	}
})