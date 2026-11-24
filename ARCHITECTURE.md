# Architecture & Technical Design Document

## AI Virtual Makeup Try-On Studio (LUMIÈRE)

### 1. Vision & Landmark Extraction Pipeline

MediaPipe Face Landmarker tracks 478 3D landmarks in both `IMAGE` and `VIDEO` execution modes:
- Outer lip contour: 20 keypoints creating an organic closed spline curve.
- Inner lip contour: 20 keypoints defining the oral opening.
- **Teeth Punch-Out**:
  The distance between landmark 13 (upper inner center) and landmark 14 (lower inner center) is measured against the mouth width (distance between corners 61 and 291). When `ratio > 0.035`, the inner cavity polygon is stamped with `destination-out`, ensuring teeth and the dark oral cavity are never colored.

### 2. Texture-Preserving Color Science

Traditional virtual try-on software applies translucent overlays (`globalAlpha` or `multiply`), which flattens the natural wrinkles, highlights, and micro-texture of human lips.

LUMIÈRE employs CIELAB and Rec.709 luminance-preserving color transfer:
$$\text{Luminance} = 0.2126R + 0.7152G + 0.0722B$$
The target pigment is blended in perceptual color space where lightness ($L$) is modulated by the underlying skin folds, and chroma ($a^*, b^*$) shifts towards the chosen lipstick shade.

### 3. WebGL 2.0 Shader Pipeline

1. **Vertex Shader**: A static full-screen quad (`positions: [-1, -1] to [1, 1]`).
2. **Fragment Shader**:
   - `u_image`: Original photograph texture (never mutated).
   - `u_mask`: Feathered lip mask generated from MediaPipe contours.
   - `u_color`: Target lipstick RGB vector.
   - `u_finish`: Integer switch (0: Matte, 1: Satin, 2: Gloss).
   - `u_intensity`: User alpha slider.
3. **Finishes**:
   - **Matte**: Soft-light blend with highlight compression for $L > 0.75$.
   - **Satin**: Balanced luminous mix preserving subtle gradient shine.
   - **Gloss**: Additive specular highlight synthesis based on exponential luminance power:
     $$\text{Specular} = \max(0.0, L)^{2.8} \times 0.7$$

### 4. Real-Time Camera Optimization

- Video stream decoded via MediaDevices `getUserMedia`.
- Landmark coordinates filtered via **Exponential Moving Average (EMA)**:
  $$P_{\text{filtered}} = P_{\text{prev}} \times (1 - \alpha) + P_{\text{curr}} \times \alpha$$
  ($\alpha = 0.6$), suppressing video noise and camera sensor shake.
- Mirrored canvas rendering (`transform: -scale-x-100`) for an intuitive selfie experience.
- Full resource teardown (`track.stop()`) on unmount.
