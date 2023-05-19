export default function glslifyStrip(snippet) {
	return snippet.replace(/#define\sGLSLIFY\s./, '')
}