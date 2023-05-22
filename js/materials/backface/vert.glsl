varying vec3 eyeVector;
varying vec3 worldNormal;
varying vec3 newWorldNormal;
varying vec3 worldPosition;
varying vec2 vUv;
varying vec3 initNormal;
attribute float index;
attribute vec3 center;
attribute vec3 random;
attribute float progress;
attribute float letter;
attribute vec3 letterCenter;
uniform float uProgress;
uniform float uStartingTime;
uniform float uTime;
uniform vec2 resolution;
uniform float uAppear;
uniform vec2 uMouse;
varying vec3 vReflect;
varying float vBackface;

float easeInQuart(float x) {
return x * x * x * x;
}

float easeInBack(float x) {
float c1 = 1.70158;
float c3 = c1 + 1.;

return c3 * x * x * x - c1 * x * x;
}

float appearProgress(float x) {
	return clamp(x - (letter - letter * 0.9), 0., 1.);
}

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

vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
    return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}

void main() {
	vUv = uv;

	vec3 pos = position;

    vec3 objectNormal = vec3(normal);
    vec3 transformedNormal = objectNormal;
    transformedNormal = normalMatrix*transformedNormal;

	vec3 translatePos = vec3(0.);
	translatePos.z += random.z * clamp(sign(center.z + 2.) * random.z, -1., 1.) * progress * 6. + sin(uTime - uStartingTime) * progress * clamp(random.z - 10., -.1, .1) ;
	translatePos.x += (random.x ) * sin(sign(center.x) * random.x ) * progress * 10. + sin(uTime - uStartingTime) * progress * clamp(random.z - 10., -.1, .1);
	translatePos.y += (random.y ) * cos(sign(center.y) * random.y ) * progress * 10. + sin(uTime - uStartingTime) * progress * clamp(random.z - 10., -.1, .1);

	if(center.x > 0. || center.x < 0.){
		pos = position - center;

		// pos = rotate(pos, center, progress * 100. + (uTime - uStartingTime) * progress * clamp(random.z, 0., 4.) * 0.5);
		pos = rotate(pos, center, progress * 100. + (uTime - uStartingTime) * progress * clamp(random.z, 0., 4.) * 0.5);
		objectNormal = rotate(objectNormal, center, progress * 100. + (uTime - uStartingTime) * progress * clamp(random.z, 0., 4.) * 0.5);

		pos = scale(pos, clamp(translatePos.z + 4., 0., 1.) );
		objectNormal = scale(objectNormal, clamp(translatePos.z + 4., 0., 1.) );
		pos += center;
	}

	pos.z -= letterCenter.z;
	pos.x -= letterCenter.x;
	pos.y -= letterCenter.y;

	pos = rotate(pos, vec3(0., 1., 0.), appearProgress(uAppear));

	pos.z += letterCenter.z;
	pos.x += letterCenter.x;
	pos.y += letterCenter.y;

	pos.z += translatePos.z + uMouse.y - easeInBack(appearProgress(uAppear)) * 50.;
	pos.x += translatePos.x + uMouse.x;
	pos.y += translatePos.y + uMouse.x;

	


	vec4 worldPosition = modelMatrix * vec4( pos, 1.0);

	#ifndef REFRACT
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		}
		else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 reflectNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		vReflect = reflect( cameraToVertex, reflectNormal );
	#endif

	eyeVector = normalize(worldPosition.xyz - cameraPosition);
	worldNormal = normalize( modelViewMatrix * vec4(objectNormal, 0.0)).xyz;
	
	gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
	vBackface = progress * 20.;
}