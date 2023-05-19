vec3 objectNormal = vec3( normal );
vec3 transformedNormal = objectNormal;

#ifdef USE_INSTANCING
    mat3 m = mat3( instanceMatrix );
    transformedNormal /= vec3( dot( m[ 0 ], m[ 0 ] ), dot( m[ 1 ], m[ 1 ] ), dot( m[ 2 ], m[ 2 ] ) );
    transformedNormal = m * transformedNormal;
#endif

transformedNormal = normalMatrix * transformedNormal;

vNormal = normalize( transformedNormal );