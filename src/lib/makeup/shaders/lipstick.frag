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

// Soft Light blending for natural color infusion
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

// Luminance-preserving color transfer
vec3 blendLipstick(vec3 orig, vec3 target, float maskAlpha, int finish) {
  float origLum = getLuminance(orig);
  
  // Modulate target color by original lip lighting/wrinkles
  vec3 texturedLipstick = target * (origLum * 1.6 + 0.2);

  // Soft light blend preserves delicate skin folds
  vec3 softBlended = softLight(orig, target);

  // Final pigment mix depending on finish
  vec3 finalColor = mix(softBlended, texturedLipstick, 0.55);

  if (finish == 0) {
    // MATTE: Soft velvety finish, diffuse highlights
    if (origLum > 0.75) {
      finalColor = mix(finalColor, target * 0.85, 0.4);
    }
  } else if (finish == 1) {
    // SATIN: Balanced natural luminosity
    finalColor = mix(finalColor, orig * target * 1.5, 0.25);
  } else if (finish == 2) {
    // GLOSS: High specular reflection on highlights
    float specular = pow(max(0.0, origLum), 3.0) * 0.65;
    finalColor = finalColor + vec3(specular);
  }

  // Alpha blend based on mask and user intensity
  float effectiveAlpha = clamp(maskAlpha * u_intensity, 0.0, 1.0);
  return mix(orig, finalColor, effectiveAlpha);
}

void main() {
  vec4 origColor = texture(u_image, v_texCoord);
  float maskVal = texture(u_mask, v_texCoord).a;

  if (maskVal < 0.005) {
    fragColor = origColor;
    return;
  }

  vec3 blended = blendLipstick(origColor.rgb, u_color, maskVal, u_finish);
  fragColor = vec4(clamp(blended, 0.0, 1.0), origColor.a);
}
