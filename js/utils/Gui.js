import { Pane } from 'tweakpane'
import store from '../store'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials'

export class Gui extends Pane {
	constructor() {
		super({
			title: 'Options'
		})

		this.containerElem_.style.width = '350px'
		this.containerElem_.style.position = 'fixed'
		this.containerElem_.style.maxHeight = '98vh'
		this.containerElem_.style.overflowY = 'auto'
		this.containerElem_.style.zIndex = '9999999'
		this.containerElem_.firstChild.style.overflow = 'hidden'
		this.containerElem_.addEventListener('wheel', ev => {
			ev.stopPropagation()
		})

		this.registerPlugin(EssentialsPlugin)

		this.fireChange = true

		this.options = {
			syncGuiValues: true
		}

		this.fps = this.addBlade({
			view: 'fpsgraph'
		})

		this.addSceneStats()
		this.addInput(this.options, 'syncGuiValues')
		this.addCamera()
	}

	addCamera() {
		const folder = this.addFolder({ title: 'camera', expanded: true })
		folder.addInput(store.MainScene.controls, 'enabled', { label: 'orbit camera' })
		folder.addInput(store.MainScene.cameraHelper, 'visible', { label: 'camera helper' })
	}

	addSceneStats() {
		const folder = this.addFolder({ title: 'Scene Stats', expanded: false })
		folder.addMonitor(store.WebGL.renderer.info.render, 'calls', { label: 'draw calls', interval: 500 })
		folder.addMonitor(store.WebGL.renderer.info.render, 'triangles', { interval: 500 })
		folder.addMonitor(store.WebGL.renderer.info.memory, 'geometries', { interval: 10000 })
		folder.addMonitor(store.WebGL.renderer.info.memory, 'textures', { interval: 10000 })
	}

	refresh(fireChange = true) {
		if (this.options.syncGuiValues) {
			this.fireChange = fireChange
			super.refresh()
			this.fireChange = true
		}
	}

	addColor(parent, property, value, label, isUniform, additionalPropertiesToSet = []) {
		if (isUniform) {
			this.setupColorUniform(property)
		} else {
			property.guiValue = '#' + property[`${value}`].getHexString()
		}

		return parent.addInput(property, 'guiValue', { label, picker: 'inline' }).on('change', () => {
			if (!this.fireChange) return
			property[value].set(property.guiValue)
			if (additionalPropertiesToSet && additionalPropertiesToSet.length > 0) {
				for (const p of additionalPropertiesToSet) {
					p[value].set(property.guiValue)
				}
			}
		})
	}

	setupColorUniform(uniform) {
		uniform.guiValue = '#' + uniform.value.getHexString()
	}

	addImage(parent, property, value, label, textureOptions = {}, callback) {
		property[value].firstLoad = true
		const input = parent.addInput(property[value], 'image', { label, view: 'input-image' }).on('change', ev => {
			if (property[value].firstLoad) {
				property[value].firstLoad = false
				return
			}
			property[value] = store.WebGL.generateTexture(ev.value, textureOptions)
			property[value].needsUpdate = true
			callback && callback(property[value])
		})
		input.controller_.binding.read = () => {} // prevent gui sync loops
	}
}