// chunks
import { ShaderChunk } from 'three'
import { glslifyStrip } from '../utils'
import defaultVert from '../../glsl/includes/default/vert.glsl'
import defaultFrag from '../../glsl/includes/default/frag.glsl'
import normalsVert from '../../glsl/includes/normals/vert.glsl'
import BackFaceMaterial from './backface/BackFaceMaterial'
import GlassMaterial from './glass/GlassMaterial'

// materials
import BasicMaterial from './basic/BasicMaterial'
import TestMaterial from './test/TestMaterial'

function setupShaderChunks() {
	ShaderChunk.defaultVert = glslifyStrip(defaultVert)
	ShaderChunk.defaultFrag = glslifyStrip(defaultFrag)
	ShaderChunk.normalsVert = glslifyStrip(normalsVert)
}

export {
	setupShaderChunks,
	BasicMaterial,
	TestMaterial,
	BackFaceMaterial,
	GlassMaterial
}