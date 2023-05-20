import { ShaderMaterial, BackSide } from 'three'

import vertexShader from './vert.glsl'
import fragmentShader from './frag.glsl'

export default class BackFaceMaterial extends ShaderMaterial {
	constructor(options) {
		super({
			vertexShader,
			fragmentShader,
			side: BackSide,
			uniforms: {
				uTime: { value: 0 },
				uProgress: { value: 0 },
				uStartingTime: { value: 0 }
			}
		})
	}
}