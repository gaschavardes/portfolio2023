import { Color, PerspectiveCamera, CameraHelper, Scene, AmbientLight, SpotLight, GridHelper } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import DummyComponent from '../components/DummyComponent'
import store from '../store'
import { E } from '../utils'
import GlobalEvents from '../utils/GlobalEvents'

export default class MainScene extends Scene {
	constructor() {
		super()

		this.options = {
			controls: window.urlParams.has('controls')
		}

		this.camera = new PerspectiveCamera(45, store.window.w / store.window.h, 0.1, 50)
		this.camera.position.z = 10
		this.add(this.camera)

		/* Debug tools */
		this.cameraHelper = new CameraHelper(this.camera)
		this.cameraHelper.visible = false
		this.add(this.cameraHelper)

		this.devCamera = new PerspectiveCamera(45, store.window.w / store.window.h, 1, 1000)
		this.devCamera.position.z = 10
		this.devCamera.position.y = 3
		this.add(this.devCamera)

		this.controls = new OrbitControls(this.devCamera, store.WebGL.renderer.domElement)
		this.controls.target.set(0, 0, 0)
		this.controls.enabled = this.options.controls
		this.controls.enableDamping = true

		this.background = new Color(0x222222)
		// this.fog = new Fog(0x000000, this.camera.near, this.camera.far)

		/* Add scene components */
		this.components = {
			dummy: new DummyComponent()
		}

		this.load()

		E.on('App:start', () => {
			this.build()
			this.addEvents()
		})
	}

	build() {
		this.buildDebugEnvironment()

		// Build components and add to scene
		for (const key in this.components) {
			this.components[key].build(this.objectData)
			this.add(this.components[key])
		}
	}

	buildDebugEnvironment() {
		this.add(new AmbientLight(0xf0f0f0))
		this.light = new SpotLight(0xffffff, 1.5)
		this.light.position.set(0, 1500, 200)
		this.light.angle = Math.PI * 0.2
		this.light.castShadow = true
		this.add(this.light)

		this.grid = new GridHelper(200, 50)
		this.grid.position.y = -10
		this.grid.material.opacity = 0.5
		this.grid.material.transparent = true
		this.add(this.grid)
	}

	addEvents() {
		E.on(GlobalEvents.RESIZE, this.onResize)
		store.RAFCollection.add(this.onRaf, 3)
	}

	onRaf = () => {
		this.controls.enabled && this.controls.update()

		if (this.controls.enabled) {
			store.WebGL.renderer.render(this, this.devCamera)
		} else {
			store.WebGL.renderer.render(this, this.camera)
		}

		store.Gui && store.Gui.refresh(false)
	}

	onResize = () => {
		this.camera.aspect = store.window.w / store.window.h
		this.camera.updateProjectionMatrix()
	}

	load() {
		this.assets = {
			textures: {},
			models: {}
		}

		// Load .unseen file
		// store.AssetLoader.loadJson('./objectdata.unseen').then(data => {
		// 	this.objectData = data
		// })

		// Global assets
	}
}