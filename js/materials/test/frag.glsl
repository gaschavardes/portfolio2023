#include <defaultFrag>

varying vec3 vNormal;
varying vec2 vUv;

uniform float uTime;

void main() {
    vec3 color = vec3(0, 1, 0.92);
    vec3 color2 = vec3(0.26, 0.13, 0.35);
    float time = uTime * 0.5;
    float edge = mod(vUv.x + sin(vUv.y * 1.) * vUv.y * 2.5 + time, 1.);
    vec3 finalColor = mix(color, color2, edge);
    gl_FragColor = vec4(finalColor, 1);
}