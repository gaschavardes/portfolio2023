varying vec3 worldNormal;
varying vec2 vUv;
attribute float index;
attribute vec3 center;
attribute vec3 random;
uniform float uProgress;
attribute float progress;
uniform float uStartingTime;
uniform float uTime;
uniform vec2 uMouse;

mat4 rotationMatrix(vec3 axis, float angle)
{
		axis = normalize(axis);
		float s = sin(angle);
		float c = cos(angle);
		float oc = 1.0 - c;

		return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
														oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
														oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
														0.0,                                0.0,                                0.0,                                1.0);
}

vec3 scale(vec3 v, float val) {
	mat4 scaleMat =mat4( val,   0.0,  0.0,  0.0,
																						0.0,  val,   0.0,  0.0,
																						0.0,  0.0,  val,   0.0,
																						0.0,  0.0,  0.0,  1.0
														);
	return (scaleMat * vec4(v, 1.0)).xyz;
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
  mat4 m = rotationMatrix(axis, angle);
  return (m * vec4(v, 1.0)).xyz;
}

void main() {
	vUv = uv;
	vec3 pos = position;
	vec3 newNorm = normal;

	vec3 translatePos = vec3(0.);
	translatePos.z += random.z * clamp(sign(center.z + 2.) * random.z, -1., 1.) * progress * 6. + sin(uTime - uStartingTime) * progress * clamp(random.z - 10., -.1, .1);
	translatePos.x += (random.x ) * sin(sign(center.x) * random.x ) * progress * 10. + sin(uTime - uStartingTime) * progress * clamp(random.z - 10., -.1, .1);
	translatePos.y += (random.y ) * cos(sign(center.y) * random.y ) * progress * 10. + sin(uTime - uStartingTime) * progress * clamp(random.z - 10., -.1, .1);

	if(center.x > 0. || center.x < 0.){
		pos = position - center;

		// pos = rotate(pos, center, progress * 100. + (uTime - uStartingTime) * progress * clamp(random.z, 0., 4.) * 0.5);
		pos = rotate(pos, center, progress * 100. + (uTime - uStartingTime) * progress * clamp(random.z, 0., 4.) * 0.5);
		// newNorm = rotate(newNorm, center, uTime);

		pos = scale(pos, clamp(translatePos.z + 4., 0., 1.) );
		pos += center;
	}

	pos.z += translatePos.z + uMouse.y;
	pos.x += translatePos.x + uMouse.x;
	pos.y += translatePos.y + uMouse.x;

	worldNormal = normalize( modelViewMatrix * vec4(newNorm, 0.0)).xyz;
	
	gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}