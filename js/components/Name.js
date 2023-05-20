import { GlassMaterial, BackFaceMaterial } from '../materials'
import { Mesh, MeshBasicMaterial, WebGLRenderTarget, PlaneGeometry, Group, BufferGeometry, BufferAttribute, Vector3 } from 'three/src/Three'
import store from '../store'
import gsap from 'gsap'

export default class Name extends Group {
	constructor(options) {
		super(options)
		this.camera = store.MainScene.camera
		this.orthoCamera = store.MainScene.orthoCamera
		this.explodeProgress = 0
		this.load()
		store.landing = this
		store.RAFCollection.add(this.animate, 2)
		// this.parent = options.parent
	}

	build() {
		this.envFbo = new WebGLRenderTarget(
			store.window.w * store.window.dpr,
			store.window.h * store.window.dpr
		)
		// this.quad = this.createBackground()
		this.item = new Group()
		this.fboCreate()
	}

	fboCreate = () => {
		this.backfaceFboBroken = new WebGLRenderTarget(store.window.w, store.window.h)
		this.backfaceFbo = new WebGLRenderTarget(store.window.w, store.window.h)
		console.log(this.backfaceFbo.texture)
		this.GlassMaterial = new GlassMaterial({
			envMap: store.envFbo.texture,
			resolution: [store.window.w * store.window.dpr, store.window.h * store.window.dpr],
			backfaceMapBroken: this.backfaceFboBroken.texture,
			backfaceMap: this.backfaceFbo.texture,
			progress: 0,
			fresnelVal: 0.3,
			refractPower: 1
		})
		this.backfaceMaterial = new BackFaceMaterial()
		this.item = new Mesh(new BufferGeometry(), this.GlassMaterial)
		this.fullItem = new Mesh(this.assets.models.v.geometry.clone(), this.backfaceMaterial)
		this.drawPieces()
		this.item.rotation.x = -Math.PI * 0.5
		this.fullItem.rotation.x = -Math.PI * 0.5
		this.add(this.item)
		this.add(this.fullItem)
		// this.fullItem.layers.set(1)
	}

	drawPieces() {
		const position = []
		const normal = []
		const index = []
		const random = []
		const centroidVal = []
		const progress = []
		let indexVal = 0
		const geometry = new BufferGeometry()
		this.pieces.forEach((piece, i) => {
			if (piece.geometry) {
				piece.geometry.computeBoundingBox()
				const centroid = new Vector3()
				piece.geometry.boundingBox.getCenter(centroid)
				const randomVal = new Vector3(this.randomIntFromInterval(5, 20), this.randomIntFromInterval(5, 20), this.randomIntFromInterval(3, 5))
				for (let i = 0; i < piece.geometry.attributes.position.array.length; i = i + 3) {
					position.push(piece.geometry.attributes.position.array[i])
					position.push(piece.geometry.attributes.position.array[i + 1])
					position.push(piece.geometry.attributes.position.array[i + 2])
					index.push(indexVal)

					centroidVal.push(centroid.x)
					centroidVal.push(centroid.y)
					centroidVal.push(centroid.z)

					random.push(randomVal.x)
					random.push(randomVal.y)
					random.push(randomVal.z)

					progress.push(0)
				}
				for (let i = 0; i < piece.geometry.attributes.normal.array.length; i = i + 3) {
					normal.push(piece.geometry.attributes.normal.array[i])
					normal.push(piece.geometry.attributes.normal.array[i + 1])
					normal.push(piece.geometry.attributes.normal.array[i + 2])
				}
				indexVal++
			}
		})

		const positionArray = new Float32Array(position)
		const normalArray = new Float32Array(normal)
		const indexArray = new Float32Array(index)
		const centroidArray = new Float32Array(centroidVal)
		const randomArray = new Float32Array(random)
		this.progressArray = new Float32Array(progress)
		geometry.setAttribute('position', new BufferAttribute(positionArray, 3))
		geometry.setAttribute('center', new BufferAttribute(centroidArray, 3))
		geometry.setAttribute('normal', new BufferAttribute(normalArray, 3))
		geometry.setAttribute('index', new BufferAttribute(indexArray, 1))
		geometry.setAttribute('random', new BufferAttribute(randomArray, 3))
		geometry.setAttribute('progress', new BufferAttribute(this.progressArray, 1))

		// geometry.setAttribute( 'uv', new BufferAttribute( normal, 2 ) )
		this.item.geometry = geometry
		this.item.geometry.computeBoundingSphere()
		this.item.geometry.boundingSphere.radius *= 10
		// gsap.to(this, {
		// 	explodeProgress: 0.2,
		// 	yoyo: true,
		// 	repeat: -1,
		// 	repeatDelay: 2,
		// 	delay: 2,
		// 	duration: 4,
		// 	ease: 'power1.easeInOut',
		// 	onUpdate: () => {
		// 		this.GlassMaterial.uniforms.uProgress.value = this.explodeProgress
		// 		this.backfaceMaterial.uniforms.uProgress.value = this.explodeProgress
		// 	}
		// })
	}

	explode() {
		this.visible = true
		this.GlassMaterial.uniforms.uTime.value = store.time
		this.backfaceMaterial.uniforms.uTime.value = store.time
		this.GlassMaterial.uniforms.uStartingTime.value = store.time
		this.backfaceMaterial.uniforms.uStartingTime.value = store.time
		// gsap.to(this, {
		// 	explodeProgress: 0.2,
		// 	duration: 4,
		// 	ease: 'power1.easeInOut',
		// 	onUpdate: () => {
		// 		this.GlassMaterial.uniforms.uProgress.value = this.explodeProgress
		// 		this.backfaceMaterial.uniforms.uProgress.value = this.explodeProgress
		// 	}
		// })
		// qs('.js-landing .headline').classList.add('show')
	}

	onEnter() {
		store.activeV = this
	}

	createBackground() {
		this.bgGeometry = new PlaneGeometry()
		this.bgMaterial = new MeshBasicMaterial({ map: this.visionariesTexture })
		this.bgMesh = new Mesh(this.bgGeometry, this.bgMaterial)
		this.bgMesh.position.set(0, 0, 0)

		const image = this.visionariesTexture.image
		this.bgMesh.scale.set(store.window.h * 1 * image.naturalWidth / image.naturalHeight, store.window.h * 1, 1)
		this.bgMesh.layers.set(1)
		store.MainScene.add(this.bgMesh)

		return this.bgMesh
	}

	randomIntFromInterval(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	animate = (smoothScrollPos, time) => {
		this.item.geometry.getAttribute('index').array.forEach((el, i) => {
			if (el > 30) {
				this.item.geometry.getAttribute('progress').array[i] = Math.max(0, Math.sin(store.WebGL.globalUniforms.uTime.value * 0.1) * 0.1)
			}
		})
		console.log(this.item.geometry.getAttribute('progress'))
		this.item.geometry.getAttribute('progress').needsUpdate = true

		this.fullItem.visible = true

		store.WebGL.renderer.setRenderTarget(store.envFbo)
		store.WebGL.renderer.render(store.MainScene, this.camera)
		// render cube backfaces to fbo

		this.item.material = this.backfaceMaterial
		store.WebGL.renderer.setRenderTarget(this.backfaceFboBroken)
		store.WebGL.renderer.render(store.MainScene, this.camera)
		this.item.visible = false
		store.WebGL.renderer.setRenderTarget(null)
		this.fullItem.material = this.backfaceMaterial
		store.WebGL.renderer.setRenderTarget(this.backfaceFbo)

		store.WebGL.renderer.clearDepth()
		store.WebGL.renderer.render(store.MainScene, this.camera)

		// render env to screen
		store.WebGL.renderer.setRenderTarget(null)
		// store.WebGL.renderer.render(this, this.orthoCamera)
		store.WebGL.renderer.clearDepth()
		this.fullItem.visible = false
		this.item.visible = true
		// render cube with refraction material to screen
		this.item.material = this.GlassMaterial
		// store.WebGL.renderer.render(this.parent, this.camera)
	}

	load() {
		this.assets = {
			models: {},
			textures: {}
		}

		store.AssetLoader.loadTexture('/textures/landing.png').then(texture => {
			this.visionariesTexture = texture
		})

		store.AssetLoader.loadTexture('/textures/background.jpeg').then(texture => {
			this.backgroundTexture = texture
		})

		store.AssetLoader.loadFbx(('/models/vShatterd.fbx')).then(gltf => {
			this.pieces = gltf.children
		})
		store.AssetLoader.loadGltf(('models/vFaces.glb')).then(gltf => {
			console.log(gltf.scenes[0].children[0])
			this.assets.models.v = gltf.scenes[0].children[0]
		})
	}

	dispose() {
		E.on('fboCreated', this.fboCreate)
	}
}