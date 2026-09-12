import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const DistortionMaterial = shaderMaterial(
  {
    uTime: 0,
    uHover: 0,
    uTexture: new THREE.Texture(),
    uMouse: new THREE.Vector2(0, 0),
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    uniform float uTime;
    uniform float uHover;
    uniform vec2 uMouse;

    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Float effect based on time and UV
      float wave = sin(pos.x * 2.0 + uTime) * 0.05 * uHover;
      float wave2 = cos(pos.y * 2.0 + uTime) * 0.05 * uHover;
      
      // Slight 3D curve (like a premium display or bent object)
      float curve = sin(uv.x * 3.14159) * 0.15;
      
      pos.z += wave + wave2 - curve;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  `
    varying vec2 vUv;
    uniform float uTime;
    uniform float uHover;
    uniform sampler2D uTexture;
    uniform vec2 uMouse;

    // Classic 2D noise
    float rand(vec2 n) { 
      return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }

    float noise(vec2 p){
      vec2 ip = floor(p);
      vec2 u = fract(p);
      u = u*u*(3.0-2.0*u);
      float res = mix(
        mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
        mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
      return res*res;
    }

    void main() {
      vec2 uv = vUv;
      
      // Calculate distance from mouse for interactive ripple
      float dist = distance(uv, uMouse);
      float ripple = sin(dist * 20.0 - uTime * 5.0) * 0.02 * uHover;
      
      // Noise displacement
      float n = noise(uv * 10.0 + uTime * 0.5) * 0.05 * uHover;
      
      // RGB Shift based on hover
      vec2 rUv = uv + vec2(n + ripple, n - ripple) * 1.5;
      vec2 gUv = uv + vec2(-n + ripple, -n - ripple) * 1.0;
      vec2 bUv = uv + vec2(n - ripple, -n + ripple) * 2.0;

      float r = texture2D(uTexture, rUv).r;
      float g = texture2D(uTexture, gUv).g;
      float b = texture2D(uTexture, bUv).b;

      // Base color when not hovered
      vec4 baseColor = texture2D(uTexture, uv);

      // Mix based on hover state (uHover goes from 0 to 1)
      vec3 finalColor = mix(baseColor.rgb, vec3(r, g, b), uHover * 0.8);

      // Add a cinematic red tint to the dark areas when hovered
      float luma = dot(finalColor, vec3(0.299, 0.587, 0.114));
      vec3 redTint = mix(finalColor, vec3(0.8, 0.0, 0.0), (1.0 - luma) * uHover * 0.5);

      gl_FragColor = vec4(redTint, baseColor.a);
      
      // Proper sRGB output
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `
);
