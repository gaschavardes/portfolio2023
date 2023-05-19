import glslify from 'rollup-plugin-glslify'

export default {
	plugins: [
		glslify({
			include: [
				'**/*.vs',
				'**/*.fs',
				'**/*.vert',
				'**/*.frag',
				'**/*.glsl'
			],

			// Undefined by default
			exclude: 'node_modules/**',

			// Enabled by default
			compress: false
		})
	]
}