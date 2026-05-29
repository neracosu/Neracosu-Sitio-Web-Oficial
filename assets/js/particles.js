/**
 * ParticleScene - Advanced Three.js Interactive Particle System
 * Features: Bloom post-processing, Simplex noise organic motion,
 * scroll morphing (sphere → galaxy → reconverge), dual-radius mouse
 * attraction/repulsion, depth-aware parallax rendering with 3 layers.
 */
import * as THREE from 'three';

// Bloom post-processing imports (graceful degradation if they fail)
let EffectComposer, RenderPass, UnrealBloomPass;
try {
  const composerMod = await import('three/addons/postprocessing/EffectComposer.js');
  const renderMod = await import('three/addons/postprocessing/RenderPass.js');
  const bloomMod = await import('three/addons/postprocessing/UnrealBloomPass.js');
  EffectComposer = composerMod.EffectComposer;
  RenderPass = renderMod.RenderPass;
  UnrealBloomPass = bloomMod.UnrealBloomPass;
} catch (e) {
  // Bloom addons unavailable — will render without post-processing
}

class ParticleScene {
  constructor() {
    this.canvas = document.getElementById('particle-canvas');
    if (!this.canvas) return;

    if (!this._checkWebGL()) {
      document.documentElement.classList.add('no-webgl');
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('no-webgl');
      return;
    }

    this.mouse = { x: 0, y: 0, ndcX: 0, ndcY: 0, velX: 0, velY: 0, prevX: 0, prevY: 0 };
    this.clock = new THREE.Clock();
    this.isVisible = true;
    this.scrollProgress = 0;
    this.morphProgress = 0;
    this.targetOpacity = 1;
    this.currentOpacity = 1;
    this.lowFpsFrames = 0;
    this.particleReduced = false;
    this.bloomDisabled = false;
    this.isMobile = window.innerWidth < 768;

    this._setParticleCount();
    this._init();
    this._createParticles();
    if (this.particleCount >= 2000) this._createConnections();
    this._setupBloom();
    this._bindEvents();
    this._animate();
  }

  _checkWebGL() {
    try {
      const c = document.createElement('canvas');
      return !!(c.getContext('webgl') || c.getContext('experimental-webgl'));
    } catch (e) {
      return false;
    }
  }

  _setParticleCount() {
    const w = window.innerWidth;
    if (w < 768) {
      this.particleCount = 800;
    } else if (w < 1024) {
      this.particleCount = 1500;
    } else {
      this.particleCount = 3000;
    }
  }

  _init() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.renderer.toneMappingExposure = 1.2;
  }

  /**
   * Generate position arrays for morphing targets
   * @param {string} type - 'sphere' | 'galaxy'
   * @param {number} count
   * @returns {Float32Array}
   */
  _generatePositions(type, count) {
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      if (type === 'sphere') {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 3 + Math.random() * 3;
        positions[i3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = r * Math.cos(phi) - 2;
      } else if (type === 'galaxy') {
        // Logarithmic spiral galaxy
        const arm = Math.floor(Math.random() * 3); // 3 arms
        const armAngle = (arm / 3) * Math.PI * 2;
        const dist = Math.pow(Math.random(), 0.5) * 5;
        const spiralAngle = dist * 1.2 + armAngle;
        const spread = 0.3 + dist * 0.15;
        positions[i3] = Math.cos(spiralAngle) * dist + (Math.random() - 0.5) * spread;
        positions[i3 + 1] = (Math.random() - 0.5) * spread * 0.4;
        positions[i3 + 2] = Math.sin(spiralAngle) * dist + (Math.random() - 0.5) * spread - 2;
      }
    }

    return positions;
  }

  _createParticles() {
    const count = this.particleCount;

    // Generate morph target positions
    const positionsSphere = this._generatePositions('sphere', count);
    const positionsGalaxy = this._generatePositions('galaxy', count);

    // Per-particle attributes
    const sizes = new Float32Array(count);
    const randoms = new Float32Array(count);
    const layers = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const rnd = Math.random();
      randoms[i] = rnd;

      // Depth layers: 0=far(30%), 1=mid(50%), 2=near(20%)
      if (rnd < 0.3) {
        layers[i] = 0.0; // far
        sizes[i] = Math.random() * 1.5 + 0.5;
      } else if (rnd < 0.8) {
        layers[i] = 0.5; // mid
        sizes[i] = Math.random() * 3 + 1;
      } else {
        layers[i] = 1.0; // near
        sizes[i] = Math.random() * 4 + 2;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positionsSphere), 3));
    geometry.setAttribute('aPositionSphere', new THREE.BufferAttribute(positionsSphere, 3));
    geometry.setAttribute('aPositionGalaxy', new THREE.BufferAttribute(positionsGalaxy, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    geometry.setAttribute('aLayer', new THREE.BufferAttribute(layers, 1));

    // --- VERTEX SHADER ---
    const vertexShader = /* glsl */ `
      attribute float aSize;
      attribute float aRandom;
      attribute float aLayer;
      attribute vec3 aPositionSphere;
      attribute vec3 aPositionGalaxy;

      uniform float uTime;
      uniform float uPixelRatio;
      uniform vec2 uMouse;
      uniform float uMorphProgress;
      uniform float uNoiseScale;
      uniform vec2 uMouseParallax;
      uniform float uMouseStrength;

      varying float vAlpha;
      varying float vRandom;
      varying float vMouseProximity;
      varying float vLayer;

      //
      // Simplex 3D Noise (GLSL) - compact implementation
      // Based on Ashima Arts / Stefan Gustavson
      //
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 mod289v3(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
        const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

        vec3 i = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);

        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);

        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;

        i = mod289v3(i);
        vec4 p = permute(permute(permute(
          i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));

        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);

        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);

        vec4 s0 = floor(b0) * 2.0 + 1.0;
        vec4 s1 = floor(b1) * 2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);

        vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
        m = m * m;
        return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
      }

      // Smooth cubic easing for morphing
      float easeInOutCubic(float t) {
        return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
      }

      void main() {
        // 1. Morphing: interpolate between sphere and galaxy positions
        float morph = easeInOutCubic(clamp(uMorphProgress, 0.0, 1.0));
        vec3 pos = mix(aPositionSphere, aPositionGalaxy, morph);

        // 2. Noise-based organic motion
        float timeOffset = uTime * 0.15;
        float noiseX = snoise(pos * uNoiseScale + vec3(timeOffset, 0.0, 0.0));
        float noiseY = snoise(pos * uNoiseScale + vec3(0.0, timeOffset, 0.0));
        float noiseZ = snoise(pos * uNoiseScale + vec3(0.0, 0.0, timeOffset));
        float noiseAmp = 0.3 * (0.7 + aLayer * 0.3);
        pos.x += noiseX * noiseAmp;
        pos.y += noiseY * noiseAmp;
        pos.z += noiseZ * noiseAmp * 0.5;

        // 3. Depth layer parallax
        float layerSpeed = mix(0.3, 1.0, aLayer);
        pos.xy += uMouseParallax * layerSpeed * 0.5;

        // Layer depth offset: far particles pushed back, near pulled forward
        pos.z += (aLayer - 0.5) * 1.5;

        // 4. Mouse attraction/repulsion (dual radius)
        vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
        vec2 screenPos = mvPos.xy / -mvPos.z;
        float distToMouse = length(screenPos - uMouse);
        float mouseStrength = uMouseStrength;

        // Inner radius: repulsion (< 0.8)
        float repulsion = smoothstep(0.8, 0.0, distToMouse) * 1.0 * mouseStrength;
        // Outer radius: attraction (0.8 - 2.5)
        float attraction = smoothstep(2.5, 0.8, distToMouse) * smoothstep(0.8, 1.2, distToMouse) * 0.4 * mouseStrength;

        vec2 mouseDir = normalize(screenPos - uMouse + vec2(0.001));
        float totalForce = repulsion - attraction;
        pos.x += mouseDir.x * totalForce;
        pos.y += mouseDir.y * totalForce;

        // Mouse proximity for color shift (passed to fragment)
        vMouseProximity = smoothstep(2.0, 0.0, distToMouse);

        // 5. Final position with depth-aware size and alpha
        vec4 finalMvPos = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * finalMvPos;

        // Size: depth-aware with layer enhancement
        float depthFactor = 1.0 / -finalMvPos.z;
        float layerSizeBoost = mix(0.6, 1.4, aLayer);
        gl_PointSize = aSize * uPixelRatio * depthFactor * 45.0 * layerSizeBoost;
        gl_PointSize = max(gl_PointSize, 1.0);
        gl_PointSize = min(gl_PointSize, 64.0);

        // Alpha: fog (far particles fade), layer brightness, morph-aware
        float fogAlpha = smoothstep(10.0, 2.0, -finalMvPos.z);
        float layerBrightness = mix(0.35, 1.0, aLayer);
        float morphFade = 1.0 - morph * 0.15;
        vAlpha = fogAlpha * layerBrightness * morphFade * smoothstep(0.0, 0.5, aSize / 4.0);

        vRandom = aRandom;
        vLayer = aLayer;
      }
    `;

    // --- FRAGMENT SHADER ---
    const fragmentShader = /* glsl */ `
      varying float vAlpha;
      varying float vRandom;
      varying float vMouseProximity;
      varying float vLayer;
      uniform float uTime;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;

        // Soft circle core + glow halo
        float core = smoothstep(0.5, 0.12, dist);
        float glow = smoothstep(0.5, 0.0, dist) * 0.3;
        float shape = core + glow;

        // Color gradient: cyan to blue with depth tint
        vec3 cyan = vec3(0.0, 0.831, 1.0);
        vec3 blue = vec3(0.0, 0.533, 1.0);
        vec3 deepBlue = vec3(0.1, 0.2, 0.6);
        vec3 color = mix(cyan, blue, vRandom);
        // Far layer particles get deeper blue tint
        color = mix(deepBlue, color, 0.5 + vLayer * 0.5);

        // Mouse proximity: shift toward white
        color = mix(color, vec3(1.0), vMouseProximity * 0.5);

        // Subtle twinkle
        float twinkle = 0.75 + 0.25 * sin(uTime * 2.0 + vRandom * 20.0);

        // Near particles glow brighter
        float layerGlow = mix(0.8, 1.2, vLayer);

        float alpha = shape * vAlpha * twinkle * layerGlow;

        gl_FragColor = vec4(color, alpha);
      }
    `;

    this.particleMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uMouse: { value: new THREE.Vector2(10, 10) },
        uMorphProgress: { value: 0 },
        uNoiseScale: { value: 0.4 },
        uMouseParallax: { value: new THREE.Vector2(0, 0) },
        uMouseStrength: { value: 1.0 }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, this.particleMaterial);
    this.scene.add(this.particles);
  }

  _createConnections() {
    const lineCount = 150;
    const linePositions = new Float32Array(lineCount * 2 * 3);
    const lineAlphas = new Float32Array(lineCount * 2);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('aLineAlpha', new THREE.BufferAttribute(lineAlphas, 1));

    this.lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00D4FF,
      transparent: true,
      opacity: 0.06,
      blending: THREE.AdditiveBlending
    });

    this.connections = new THREE.LineSegments(lineGeometry, this.lineMaterial);
    this.scene.add(this.connections);
    this.linePositions = linePositions;
    this.lineAlphas = lineAlphas;
    this.lineCount = lineCount;
    this.hasConnections = true;
  }

  _updateConnections() {
    if (!this.hasConnections) return;

    const positions = this.particles.geometry.attributes.position.array;
    const count = this.particleCount;
    const maxDist = 1.2;
    const maxDistSq = maxDist * maxDist;
    let lineIdx = 0;

    const step = Math.max(1, Math.floor(count / 200));

    for (let i = 0; i < count && lineIdx < this.lineCount; i += step) {
      for (let j = i + step; j < count && lineIdx < this.lineCount; j += step * 2) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < maxDistSq) {
          const idx = lineIdx * 6;
          this.linePositions[idx] = positions[i * 3];
          this.linePositions[idx + 1] = positions[i * 3 + 1];
          this.linePositions[idx + 2] = positions[i * 3 + 2];
          this.linePositions[idx + 3] = positions[j * 3];
          this.linePositions[idx + 4] = positions[j * 3 + 1];
          this.linePositions[idx + 5] = positions[j * 3 + 2];

          // Fade by distance
          const fade = 1.0 - Math.sqrt(distSq) / maxDist;
          this.lineAlphas[lineIdx * 2] = fade;
          this.lineAlphas[lineIdx * 2 + 1] = fade;

          lineIdx++;
        }
      }
    }

    // Zero out unused lines
    for (let i = lineIdx; i < this.lineCount; i++) {
      const idx = i * 6;
      this.linePositions[idx] = 0;
      this.linePositions[idx + 1] = 0;
      this.linePositions[idx + 2] = 0;
      this.linePositions[idx + 3] = 0;
      this.linePositions[idx + 4] = 0;
      this.linePositions[idx + 5] = 0;
    }

    this.connections.geometry.attributes.position.needsUpdate = true;

    // Fade connection opacity based on morph
    this.lineMaterial.opacity = 0.06 * (1.0 - this.morphProgress * 0.7);
  }

  _setupBloom() {
    // Bloom disabled on mobile by default or if addons didn't load
    if (this.isMobile || !EffectComposer || !RenderPass || !UnrealBloomPass) {
      this.useBloom = false;
      return;
    }

    try {
      // Create render target with alpha for transparent canvas background
      const renderTarget = new THREE.WebGLRenderTarget(
        window.innerWidth, window.innerHeight,
        { type: THREE.HalfFloatType, format: THREE.RGBAFormat }
      );
      this.composer = new EffectComposer(this.renderer, renderTarget);

      const renderPass = new RenderPass(this.scene, this.camera);
      renderPass.clearAlpha = 0; // Transparent clear
      this.composer.addPass(renderPass);

      this.bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.8,  // strength
        0.5,  // radius
        0.2   // threshold
      );
      this.composer.addPass(this.bloomPass);

      this.useBloom = true;
    } catch (e) {
      this.useBloom = false;
    }
  }

  _bindEvents() {
    // Mouse move (desktop only) with velocity tracking
    if (!this.isMobile) {
      window.addEventListener('mousemove', (e) => {
        const newX = (e.clientX / window.innerWidth) * 2 - 1;
        const newY = -(e.clientY / window.innerHeight) * 2 + 1;

        this.mouse.velX = newX - this.mouse.ndcX;
        this.mouse.velY = newY - this.mouse.ndcY;
        this.mouse.ndcX = newX;
        this.mouse.ndcY = newY;
      }, { passive: true });
    }

    // Resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => this._onResize(), 200);
    }, { passive: true });

    // Visibility change
    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
      if (this.isVisible) this.clock.getDelta();
    });

    // Scroll progress with morphing calculation
    window.addEventListener('scroll', () => {
      const heroEl = document.getElementById('hero');
      const contactEl = document.getElementById('contacto');
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollY = window.scrollY;

      // Global scroll progress (0 to 1 over entire page)
      const globalProgress = docHeight > 0 ? scrollY / docHeight : 0;

      if (heroEl) {
        const heroRect = heroEl.getBoundingClientRect();
        const heroProgress = Math.max(0, Math.min(1, -heroRect.top / heroRect.height));
        this.scrollProgress = heroProgress;
      }

      // Morphing: sphere → galaxy in mid-page, reconverge at contact
      // morphProgress: 0 = sphere, 1 = galaxy
      if (globalProgress < 0.3) {
        // Hero area: sphere
        this.morphProgress = 0;
      } else if (globalProgress < 0.6) {
        // Mid-page: transition to galaxy
        this.morphProgress = (globalProgress - 0.3) / 0.3;
      } else if (globalProgress < 0.85) {
        // Galaxy holds
        this.morphProgress = 1.0;
      } else {
        // Contact area: reconverge to sphere
        this.morphProgress = 1.0 - (globalProgress - 0.85) / 0.15;
      }
      this.morphProgress = Math.max(0, Math.min(1, this.morphProgress));

      // Bring particles back at contact section
      if (contactEl) {
        const contactRect = contactEl.getBoundingClientRect();
        if (contactRect.top < window.innerHeight * 0.5) {
          const contactProgress = 1 - Math.max(0, Math.min(1, contactRect.top / (window.innerHeight * 0.5)));
          this.scrollProgress = Math.max(0, this.scrollProgress - contactProgress * this.scrollProgress);
        }
      }
    }, { passive: true });
  }

  _onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.particleMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);

    if (this.composer) {
      this.composer.setSize(width, height);
    }

    this.isMobile = width < 768;
  }

  _monitorPerformance(delta) {
    const fps = 1 / delta;

    if (fps < 30) {
      this.lowFpsFrames++;

      // First tier: disable bloom after 60 low-fps frames
      if (this.lowFpsFrames > 60 && this.useBloom && !this.bloomDisabled) {
        this.useBloom = false;
        this.bloomDisabled = true;
        this.lowFpsFrames = 0;
        return;
      }

      // Second tier: reduce particles after bloom already disabled
      if (this.lowFpsFrames > 60 && !this.particleReduced) {
        this._reduceParticles();
        this.particleReduced = true;
      }
    } else {
      this.lowFpsFrames = Math.max(0, this.lowFpsFrames - 1);
    }
  }

  _reduceParticles() {
    const count = Math.floor(this.particleCount / 2);
    const oldGeo = this.particles.geometry;

    const oldPos = oldGeo.attributes.position.array;
    const oldSphere = oldGeo.attributes.aPositionSphere.array;
    const oldGalaxy = oldGeo.attributes.aPositionGalaxy.array;
    const oldSizes = oldGeo.attributes.aSize.array;
    const oldRandoms = oldGeo.attributes.aRandom.array;
    const oldLayers = oldGeo.attributes.aLayer.array;

    const newPos = new Float32Array(count * 3);
    const newSphere = new Float32Array(count * 3);
    const newGalaxy = new Float32Array(count * 3);
    const newSizes = new Float32Array(count);
    const newRandoms = new Float32Array(count);
    const newLayers = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const src = i * 2;
      newPos[i * 3] = oldPos[src * 3];
      newPos[i * 3 + 1] = oldPos[src * 3 + 1];
      newPos[i * 3 + 2] = oldPos[src * 3 + 2];
      newSphere[i * 3] = oldSphere[src * 3];
      newSphere[i * 3 + 1] = oldSphere[src * 3 + 1];
      newSphere[i * 3 + 2] = oldSphere[src * 3 + 2];
      newGalaxy[i * 3] = oldGalaxy[src * 3];
      newGalaxy[i * 3 + 1] = oldGalaxy[src * 3 + 1];
      newGalaxy[i * 3 + 2] = oldGalaxy[src * 3 + 2];
      newSizes[i] = oldSizes[src];
      newRandoms[i] = oldRandoms[src];
      newLayers[i] = oldLayers[src];
    }

    oldGeo.setAttribute('position', new THREE.BufferAttribute(newPos, 3));
    oldGeo.setAttribute('aPositionSphere', new THREE.BufferAttribute(newSphere, 3));
    oldGeo.setAttribute('aPositionGalaxy', new THREE.BufferAttribute(newGalaxy, 3));
    oldGeo.setAttribute('aSize', new THREE.BufferAttribute(newSizes, 1));
    oldGeo.setAttribute('aRandom', new THREE.BufferAttribute(newRandoms, 1));
    oldGeo.setAttribute('aLayer', new THREE.BufferAttribute(newLayers, 1));
    this.particleCount = count;
  }

  _animate() {
    if (!this.isVisible) {
      requestAnimationFrame(() => this._animate());
      return;
    }

    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();

    this._monitorPerformance(delta);

    // Update uniforms
    const uniforms = this.particleMaterial.uniforms;
    uniforms.uTime.value = elapsed;
    uniforms.uMouse.value.set(this.mouse.ndcX * 2, this.mouse.ndcY * 2);
    uniforms.uMorphProgress.value = this.morphProgress;

    // Mouse strength scales with velocity
    const mouseSpeed = Math.sqrt(this.mouse.velX * this.mouse.velX + this.mouse.velY * this.mouse.velY);
    const targetStrength = Math.min(1.0 + mouseSpeed * 15, 3.0);
    uniforms.uMouseStrength.value += (targetStrength - uniforms.uMouseStrength.value) * 0.1;

    // Mouse parallax (smoothed)
    const parallaxX = this.mouse.ndcX * 0.3;
    const parallaxY = this.mouse.ndcY * 0.2;
    uniforms.uMouseParallax.value.x += (parallaxX - uniforms.uMouseParallax.value.x) * 0.03;
    uniforms.uMouseParallax.value.y += (parallaxY - uniforms.uMouseParallax.value.y) * 0.03;

    // Decay mouse velocity
    this.mouse.velX *= 0.9;
    this.mouse.velY *= 0.9;

    // Subtle camera parallax
    this.camera.position.x += (this.mouse.ndcX * 0.3 - this.camera.position.x) * 0.02;
    this.camera.position.y += (this.mouse.ndcY * 0.2 - this.camera.position.y) * 0.02;
    this.camera.lookAt(0, 0, 0);

    // Canvas opacity based on scroll
    this.targetOpacity = 1 - this.scrollProgress * 0.85;
    this.currentOpacity += (this.targetOpacity - this.currentOpacity) * 0.05;
    this.canvas.style.opacity = Math.max(0.15, this.currentOpacity).toFixed(3);

    // Update connections (every 3 frames)
    if (this.hasConnections && Math.floor(elapsed * 60) % 3 === 0) {
      this._updateConnections();
    }

    // Subtle particle rotation (slows during galaxy morph)
    const rotationSpeed = 0.02 * (1.0 - this.morphProgress * 0.5);
    this.particles.rotation.y = elapsed * rotationSpeed;

    // Render with bloom or fallback
    if (this.useBloom && this.composer) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }

    requestAnimationFrame(() => this._animate());
  }

  destroy() {
    this.isVisible = false;
    if (this.particles) {
      this.particles.geometry.dispose();
      this.particleMaterial.dispose();
    }
    if (this.connections) {
      this.connections.geometry.dispose();
      this.lineMaterial.dispose();
    }
    if (this.composer) {
      // Dispose bloom passes
      this.composer.passes.forEach(pass => {
        if (pass.dispose) pass.dispose();
      });
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}

// Expose globals for backward compatibility with main.js
window.THREE = THREE;
window.ParticleScene = ParticleScene;

// Self-initialize (module scripts run after DOM is parsed)
if (!window._particleSceneActive) {
  window._particleSceneActive = true;
  new ParticleScene();
}
