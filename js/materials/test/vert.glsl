precision highp float;
precision highp int;

varying vec3 vNormal;
varying vec2 vUv;

uniform float uTime;

void main()	{
    #include <normalsVert>

    vUv = uv;
    vec3 transformedPosition = position;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( transformedPosition, 1.0 );
}