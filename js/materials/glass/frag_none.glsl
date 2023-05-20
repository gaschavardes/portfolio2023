uniform samplerCube envMap;
uniform sampler2D backfaceMap;
uniform sampler2D normalMap;
uniform vec2 resolution;
uniform float uProgress;
uniform float uFresnelVal;
uniform float uRefractPower;

varying vec2 vUv;
varying vec3 worldNormal;
varying vec3 eyeVector;
varying vec3 vReflect;

float ior = 1.5;

void main() {
	vec2 uv = gl_FragCoord.xy / resolution;
	
	vec4 backfaceTex = texture2D(backfaceMap, uv);
	vec3 backfaceNormal = backfaceTex.rgb;

	vec3 refracted;
	vec3 normalColor;
	vec3 normal;
	float a;

	#ifdef REFRACT
		a = 0.25;
		normalColor = texture2D(normalMap, vUv * 0.15).rgb * 2. - 1.;
		normalColor = normalize(normalColor) * 0.05;
		normal = (worldNormal + normalColor) * (1.0 - a) - smoothstep(vec3(0.), vec3(1.), backfaceNormal * a);
		refracted = refract(eyeVector, normal, 1.0/ior);
	#else
		a = 0.5;
		normalColor = texture2D(normalMap, vUv * 0.75).rgb * 2. - 1.;
		normalColor = normalize(normalColor) * 0.1;
		normal = (worldNormal + normalColor) * (1.0 - a) - smoothstep(vec3(0.05), vec3(1), backfaceNormal);
		refracted = vReflect + normal;
	#endif

	vec4 envMapColor = textureCube(envMap, refracted);

	gl_FragColor = vec4(envMapColor.rgb, 1.);
}