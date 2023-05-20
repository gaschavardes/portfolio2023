varying vec3 worldNormal;
uniform sampler2D normalMap;
varying vec2 vUv;
void main() {
	vec4 normalColor = texture2D(normalMap, vUv * 0.15) * 0.5;
	gl_FragColor = vec4(worldNormal, 1.0);
}