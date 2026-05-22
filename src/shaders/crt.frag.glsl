#version 300 es
precision highp float;

in vec2 vUv;
out vec4 outColor;

uniform sampler2D uTex;
uniform vec2 uPadding;
uniform float uTime;
uniform float uCAStrength;

// If we want to tweak these in JS, we can convert to uniform (instead of const)
// const float SCAN = 0.125; // darkness of the scanlines 
const float SCAN = 0.125; // darkness of the scanlines 
const float SCAN_FREQUENCY = 500.0; // actual_bands = SCAN_FREQUENCY / pi
const float SCAN_SPEED = 6.0;
const float WARP = 0.25; // curvature of the monitor, multiplied by X and Y
const float X_WARP = 0.3;
const float Y_WARP = 0.4;

vec2 warpUV(vec2 uv) {
	vec2 warpedUV = uv;

	vec2 distanceCenter = abs(0.5 - uv);
	distanceCenter *= distanceCenter;

	warpedUV.x -= 0.5;
	warpedUV.x *= 1.0 + (distanceCenter.y * (X_WARP * WARP));
	warpedUV.x += 0.5;

	warpedUV.y -= 0.5;
	warpedUV.y *= 1.0 + (distanceCenter.x * (Y_WARP * WARP));
	warpedUV.y += 0.5;

	return warpedUV;
}

vec2 applyPadding(vec2 uv) {
	return (uv - uPadding) / (1.0 - 2.0 * uPadding);
}

vec3 chromaticAberrationColor(vec2 uv, float strength, float time, sampler2D tex) {
	vec2 caOffset = uv - 0.5;
	float caStrength = strength - (sin(time * 1.0) * strength * 0.5);

	return vec3(
		texture(tex, uv + caOffset * caStrength).r,
		texture(tex, uv).g,
		texture(tex, uv - caOffset * caStrength).b
	);
}

vec3 applyScanlines(vec3 color, float y, float t) {
	float apply = abs(sin(y * SCAN_FREQUENCY - t * SCAN_SPEED) * SCAN);

	return mix(color, vec3(0.0), apply);
}

// NOTE: It would be nice to break this file up, but it introduces significant complexity.
void main()
{
	vec2 warpedUv = warpUV(vUv);
	vec2 uv = applyPadding(warpedUv);

	/* warpUV can return coordinates that are outside of the texture. CLAMP_TO_EDGE samples the 
	 * edge pixel, which would cause smearing. This blacks it out instead. */
	vec3 color;
	if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
		color = vec3(0.118);
	} else {
		color = chromaticAberrationColor(uv, uCAStrength, uTime, uTex);
	}

	color = applyScanlines(color, warpedUv.y, uTime);
	
	outColor = vec4(color, 1.0);
}
