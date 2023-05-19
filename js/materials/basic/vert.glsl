#include <defaultVert>

varying vec3 vNormal;

void main()	{
    #include <normalsVert>
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}