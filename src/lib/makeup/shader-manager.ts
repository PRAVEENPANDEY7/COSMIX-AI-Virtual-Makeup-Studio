/**
 * WebGL 2 Shader Pipeline Manager for Real-Time GPU Lipstick Rendering
 */

export class ShaderManager {
  private gl: WebGL2RenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private quadVao: WebGLVertexArrayObject | null = null;
  private imageTexture: WebGLTexture | null = null;
  private maskTexture: WebGLTexture | null = null;

  // Uniform locations
  private uImageLoc: WebGLUniformLocation | null = null;
  private uMaskLoc: WebGLUniformLocation | null = null;
  private uColorLoc: WebGLUniformLocation | null = null;
  private uFinishLoc: WebGLUniformLocation | null = null;
  private uIntensityLoc: WebGLUniformLocation | null = null;

  constructor(private canvas: HTMLCanvasElement) {
    this.initWebGL();
  }

  private initWebGL(): boolean {
    const gl = this.canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: true,
    });

    if (!gl) {
      console.warn('WebGL2 not supported, will use 2D canvas fallback.');
      return false;
    }

    this.gl = gl;

    const vsSource = `#version 300 es
      in vec2 a_position;
      in vec2 a_texCoord;
      out vec2 v_texCoord;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `;

    const fsSource = `#version 300 es
      precision highp float;
      in vec2 v_texCoord;
      out vec4 fragColor;

      uniform sampler2D u_image;
      uniform sampler2D u_mask;
      uniform vec3 u_color;
      uniform int u_finish;
      uniform float u_intensity;

      // Rec. 709 Luminance
      float getLum(vec3 c) {
        return dot(c, vec3(0.2126, 0.7152, 0.0722));
      }

      // Soft light blending for deep pigment infusion
      vec3 softLight(vec3 b, vec3 s) {
        vec3 r;
        for (int i = 0; i < 3; i++) {
          if (s[i] < 0.5) {
            r[i] = 2.0 * b[i] * s[i] + b[i] * b[i] * (1.0 - 2.0 * s[i]);
          } else {
            r[i] = 2.0 * b[i] * (1.0 - s[i]) + sqrt(b[i]) * (2.0 * s[i] - 1.0);
          }
        }
        return r;
      }

      void main() {
        vec4 orig = texture(u_image, v_texCoord);
        float mask = texture(u_mask, v_texCoord).a;

        if (mask < 0.003) {
          fragColor = orig;
          return;
        }

        // 1. High-frequency micro-crease & texture extraction (Sulci labiorum)
        ivec2 texSize = textureSize(u_image, 0);
        vec2 texel = 1.5 / vec2(float(texSize.x), float(texSize.y));

        float lumC = getLum(orig.rgb);
        float lumN = getLum(texture(u_image, v_texCoord + vec2(0.0, -texel.y)).rgb);
        float lumS = getLum(texture(u_image, v_texCoord + vec2(0.0,  texel.y)).rgb);
        float lumW = getLum(texture(u_image, v_texCoord + vec2(-texel.x, 0.0)).rgb);
        float lumE = getLum(texture(u_image, v_texCoord + vec2( texel.x, 0.0)).rgb);
        float localMeanLum = (lumN + lumS + lumW + lumE) * 0.25;

        // Micro-crease contrast: preserves fine vertical lip lines and natural grain
        float creaseDetail = clamp((lumC - localMeanLum) * 2.2, -0.35, 0.35);

        // 2. Pigment infusion modulated by natural lip lighting
        vec3 texturedLipstick = u_color * (pow(lumC, 0.8) * 1.45 + 0.12);
        vec3 softBlended = softLight(orig.rgb, u_color);
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
        float smoothAlpha = smoothstep(0.0, 0.95, mask) * u_intensity;
        vec3 finalColor = clamp(mix(orig.rgb, blended, smoothAlpha), 0.0, 1.0);

        fragColor = vec4(finalColor, orig.a);
      }
    `;

    const vertShader = this.createShader(gl.VERTEX_SHADER, vsSource);
    const fragShader = this.createShader(gl.FRAGMENT_SHADER, fsSource);

    if (!vertShader || !fragShader) return false;

    const program = gl.createProgram();
    if (!program) return false;

    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Shader link error:', gl.getProgramInfoLog(program));
      return false;
    }

    this.program = program;

    // Cache uniform locations
    this.uImageLoc = gl.getUniformLocation(program, 'u_image');
    this.uMaskLoc = gl.getUniformLocation(program, 'u_mask');
    this.uColorLoc = gl.getUniformLocation(program, 'u_color');
    this.uFinishLoc = gl.getUniformLocation(program, 'u_finish');
    this.uIntensityLoc = gl.getUniformLocation(program, 'u_intensity');

    // Create fullscreen quad VAO
    const positions = new Float32Array([
      -1, -1, 0, 1,
       1, -1, 1, 1,
      -1,  1, 0, 0,
      -1,  1, 0, 0,
       1, -1, 1, 1,
       1,  1, 1, 0,
    ]);

    const vao = gl.createVertexArray();
    const vbo = gl.createBuffer();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const aPosLoc = gl.getAttribLocation(program, 'a_position');
    const aTexLoc = gl.getAttribLocation(program, 'a_texCoord');

    gl.enableVertexAttribArray(aPosLoc);
    gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 16, 0);

    gl.enableVertexAttribArray(aTexLoc);
    gl.vertexAttribPointer(aTexLoc, 2, gl.FLOAT, false, 16, 8);

    gl.bindVertexArray(null);
    this.quadVao = vao;

    // Create and configure textures
    this.imageTexture = gl.createTexture();
    this.maskTexture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, this.imageTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.bindTexture(gl.TEXTURE_2D, this.maskTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.bindTexture(gl.TEXTURE_2D, null);

    return true;
  }

  private createShader(type: number, source: string): WebGLShader | null {
    if (!this.gl) return null;
    const shader = this.gl.createShader(type);
    if (!shader) return null;
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  public isSupported(): boolean {
    return this.gl !== null && this.program !== null;
  }

  public render(
    imageSource: TexImageSource,
    maskSource: TexImageSource,
    rgb: [number, number, number],
    finish: 'matte' | 'satin' | 'gloss',
    intensity: number
  ): boolean {
    const gl = this.gl;
    if (!gl || !this.program || !this.quadVao) return false;

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(this.program);

    // Bind original image to Texture 0
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.imageTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageSource);
    gl.uniform1i(this.uImageLoc, 0);

    // Bind lip mask to Texture 1
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.maskTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, maskSource);
    gl.uniform1i(this.uMaskLoc, 1);

    // Pass color & options
    gl.uniform3f(this.uColorLoc, rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);

    const finishInt = finish === 'matte' ? 0 : finish === 'satin' ? 1 : 2;
    gl.uniform1i(this.uFinishLoc, finishInt);
    gl.uniform1f(this.uIntensityLoc, intensity);

    // Draw full-screen quad
    gl.bindVertexArray(this.quadVao);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.bindVertexArray(null);

    return true;
  }

  public dispose(): void {
    if (!this.gl) return;
    if (this.imageTexture) this.gl.deleteTexture(this.imageTexture);
    if (this.maskTexture) this.gl.deleteTexture(this.maskTexture);
    if (this.program) this.gl.deleteProgram(this.program);
    this.gl = null;
  }
}
