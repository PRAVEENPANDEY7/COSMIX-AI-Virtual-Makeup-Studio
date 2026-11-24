#version 300 es
precision highp float;

in vec2 v_texCoord;
out vec4 fragColor;

uniform sampler2D u_image;
uniform sampler2D u_mask;
uniform vec3 u_color;       // Target lipstick color in sRGB [0..1]
uniform int u_finish;       // 0: matte, 1: satin, 2: gloss
uniform float u_intensity;  // [0..1]

// Rec. 709 Luminance
float getLuminance(vec3 color) {
  return dot(color, vec3(0.2126, 0.7152, 0.0722));
}

// Photorealistic Soft Light blending for natural color infusion
vec3 softLight(vec3 base, vec3 blend) {
  vec3 result;
  for (int i = 0; i < 3; i++) {
    if (blend[i] < 0.5) {
      result[i] = 2.0 * base[i] * blend[i] + base[i] * base[i] * (1.0 - 2.0 * blend[i]);
    } else {
      result[i] = 2.0 * base[i] * (1.0 - blend[i]) + sqrt(base[i]) * (2.0 * blend[i] - 1.0);
    }
  }
  return result;
}

void main() {
  vec4 origColor = texture(u_image, v_texCoord);
  float maskVal = texture(u_mask, v_texCoord).a;

  // Early discard for non-lip pixels
  if (maskVal < 0.003) {
    fragColor = origColor;
    return;
  }

  // 1. High-frequency micro-crease & texture extraction (Sulci labiorum)
  ivec2 texSize = textureSize(u_image, 0);
  vec2 texel = 1.5 / vec2(float(texSize.x), float(texSize.y));

  float lumC = getLuminance(origColor.rgb);
  float lumN = getLuminance(texture(u_image, v_texCoord + vec2(0.0, -texel.y)).rgb);
  float lumS = getLuminance(texture(u_image, v_texCoord + vec2(0.0,  texel.y)).rgb);
  float lumW = getLuminance(texture(u_image, v_texCoord + vec2(-texel.x, 0.0)).rgb);
  float lumE = getLuminance(texture(u_image, v_texCoord + vec2( texel.x, 0.0)).rgb);
  float localMeanLum = (lumN + lumS + lumW + lumE) * 0.25;

  // Micro-crease contrast: preserves fine vertical lip lines and natural grain
  float creaseDetail = clamp((lumC - localMeanLum) * 2.2, -0.35, 0.35);

  // 2. Pigment infusion modulated by natural lip lighting
  vec3 texturedLipstick = u_color * (pow(lumC, 0.8) * 1.45 + 0.12);
  vec3 softBlended = softLight(origColor.rgb, u_color);
  vec3 blended = mix(softBlended, texturedLipstick, 0.62);

  // Re-inject physical lip wrinkles and surface texture
  blended = clamp(blended + vec3(creaseDetail * 1.5), 0.0, 1.0);

  // 3. PBR Finish-specific physical lighting response
  if (u_finish == 0) {
    // Matte: Soft velvety diffusion, suppresses harsh glare while enhancing wrinkle definition
    if (lumC > 0.62) {
      blended = mix(blended, u_color * 0.82, 0.4);
    }
    blended += vec3(creaseDetail * 0.4);
  } else if (u_finish == 1) {
    // Satin: Hydrating natural sheen centered on natural lip fullness
    float satinSheen = pow(max(0.0, lumC), 2.2) * 0.35;
    blended = mix(blended, blended + u_color * satinSheen, 0.55);
  } else if (u_finish == 2) {
    // Gloss: High-specular wet liquid lacquer with natural light reflection
    float glossSpec = pow(max(0.0, lumC), 3.2) * 0.88;
    vec3 specTone = mix(vec3(1.0, 0.98, 0.95), u_color, 0.2);
    blended = blended + specTone * glossSpec;
  }

  // 4. Smooth vermilion border falloff (cubic transition into natural skin)
  float smoothAlpha = smoothstep(0.0, 0.95, maskVal) * u_intensity;
  vec3 finalColor = clamp(mix(origColor.rgb, blended, smoothAlpha), 0.0, 1.0);

  fragColor = vec4(finalColor, origColor.a);
}
