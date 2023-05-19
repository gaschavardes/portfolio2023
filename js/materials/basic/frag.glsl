#include <defaultFrag>

uniform vec3 uColor;
varying vec3 vNormal;

void main() {
    gl_FragColor = vec4(vNormal * uColor, 1.);
}