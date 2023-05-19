import { Group, Mesh, TorusKnotBufferGeometry, Color } from 'three'
import { BasicMaterial } from '../materials'
// import store from '../store'
// import { copyObjectDataTransforms } from '../utils'

export default class DummyComponent extends Group {
	constructor() {
		super()

		this.globalUniforms = {
			uColor: { value: new Color(0xf3ff8f) }
		}

		this.load()
	}

	build(objectData) {
		this.meshes = {}

		const mesh = new Mesh(
			new TorusKnotBufferGeometry(1, 0.4, 132, 16),
			new BasicMaterial({ uniforms: {}, globalUniforms: this.globalUniforms })
		)
		this.meshes.dummy = mesh

		// Copy transforms if needed
		// copyObjectDataTransforms(this.meshes.dummy, objectData.objects.dummy[0])

		this.add(this.meshes.dummy)
	}

	load() {
		this.assets = {
			models: {},
			textures: {}
		}

		// Load component assets if needed
		// store.AssetLoader.loadGltf('./models/model.glb').then(gltf => {
		// 	this.assets.models.rockFormation = gltf.scene.children[0]
		// })
	}
}