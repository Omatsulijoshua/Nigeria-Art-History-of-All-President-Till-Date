import * as THREE from 'three';

/**
 * Procedural Texture Generator for the Nigeria Leadership Museum
 * Generates custom materials inside HTML5 Canvas to avoid external assets dependency.
 */

// Generate random noise helper
const noise = (x: number, y: number): number => {
  const h = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return h - Math.floor(h);
};

// Smooth noise helper
const smoothNoise = (x: number, y: number): number => {
  const corners = (noise(x - 1, y - 1) + noise(x + 1, y - 1) + noise(x - 1, y + 1) + noise(x + 1, y + 1)) / 16;
  const sides = (noise(x - 1, y) + noise(x + 1, y) + noise(x, y - 1) + noise(x, y + 1)) / 8;
  const center = noise(x, y) / 4;
  return corners + sides + center;
};

// Cosine interpolation
const cosInterpolate = (a: number, b: number, x: number): number => {
  const ft = x * Math.PI;
  const f = (1 - Math.cos(ft)) * 0.5;
  return a * (1 - f) + b * f;
};

// 2D Perlin-like noise
const perlinNoise = (x: number, y: number): number => {
  const intX = Math.floor(x);
  const fracX = x - intX;
  const intY = Math.floor(y);
  const fracY = y - intY;

  const v1 = smoothNoise(intX, intY);
  const v2 = smoothNoise(intX + 1, intY);
  const v3 = smoothNoise(intX, intY + 1);
  const v4 = smoothNoise(intX + 1, intY + 1);

  const i1 = cosInterpolate(v1, v2, fracX);
  const i2 = cosInterpolate(v3, v4, fracX);

  return cosInterpolate(i1, i2, fracY);
};

export const TextureGenerator = {
  /**
   * Generates a rough stone wall with custom diffuse and normal maps.
   */
  createStoneWall: (baseColorHex: string = '#1f1e1c', size: number = 512): { map: THREE.CanvasTexture; normalMap: THREE.CanvasTexture } => {
    // 1. Create Diffuse Canvas
    const diffuseCanvas = document.createElement('canvas');
    diffuseCanvas.width = size;
    diffuseCanvas.height = size;
    const ctx = diffuseCanvas.getContext('2d')!;

    // 2. Create Height Canvas (for Normal Map generation)
    const heightCanvas = document.createElement('canvas');
    heightCanvas.width = size;
    heightCanvas.height = size;
    const hCtx = heightCanvas.getContext('2d')!;

    // Fill backgrounds
    ctx.fillStyle = baseColorHex;
    ctx.fillRect(0, 0, size, size);

    hCtx.fillStyle = '#808080';
    hCtx.fillRect(0, 0, size, size);

    // Draw stone blocks/bricks
    const rows = 8;
    const rowHeight = size / rows;

    for (let r = 0; r < rows; r++) {
      const y = r * rowHeight;
      // Stagger rows
      const offset = r % 2 === 0 ? 0 : rowHeight * 1.5;
      const blockWidth = rowHeight * 3;
      const numBlocks = Math.ceil(size / blockWidth) + 1;

      for (let b = -1; b < numBlocks; b++) {
        const x = b * blockWidth + offset;

        // Add slight randomness to block dimensions
        const blockW = blockWidth - 4 + (noise(b, r) * 6 - 3);
        const blockH = rowHeight - 4;

        // Draw block base
        ctx.fillStyle = r % 2 === 0 ? '#1b1a18' : '#232220';
        ctx.fillRect(x, y, blockW, blockH);

        // Draw height details (rounded edges, cracks)
        hCtx.fillStyle = '#b0b0b0';
        hCtx.fillRect(x + 2, y + 2, blockW - 4, blockH - 4);
      }
    }

    // Add fine noise to diffuse and height
    const diffImg = ctx.getImageData(0, 0, size, size);
    const heightImg = hCtx.getImageData(0, 0, size, size);
    const diffData = diffImg.data;
    const heightData = heightImg.data;

    for (let i = 0; i < diffData.length; i += 4) {
      const px = (i / 4) % size;
      const py = Math.floor((i / 4) / size);

      // Fine stone grain noise
      const nVal = perlinNoise(px * 0.1, py * 0.1) * 0.4 + perlinNoise(px * 0.5, py * 0.5) * 0.1;
      const factor = 0.85 + nVal * 0.3;

      // Darken edges slightly
      const edge = Math.sin((px / size) * Math.PI) * Math.sin((py / size) * Math.PI);
      const edgeFactor = 0.75 + edge * 0.25;

      diffData[i] = Math.min(255, Math.max(0, diffData[i] * factor * edgeFactor));
      diffData[i + 1] = Math.min(255, Math.max(0, diffData[i + 1] * factor * edgeFactor));
      diffData[i + 2] = Math.min(255, Math.max(0, diffData[i + 2] * factor * edgeFactor));

      // Update height map with noise
      const hVal = Math.min(255, Math.max(0, heightData[i] + (nVal - 0.2) * 90));
      heightData[i] = hVal;
      heightData[i + 1] = hVal;
      heightData[i + 2] = hVal;
    }

    ctx.putImageData(diffImg, 0, 0);
    hCtx.putImageData(heightImg, 0, 0);

    // 3. Generate Normal Map from Height Map
    const normalCanvas = document.createElement('canvas');
    normalCanvas.width = size;
    normalCanvas.height = size;
    const nCtx = normalCanvas.getContext('2d')!;
    const normalImg = nCtx.createImageData(size, size);
    const nData = normalImg.data;

    const strength = 2.0;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        // Sample height surrounding pixels (wrapped borders)
        const getH = (xp: number, yp: number) => {
          const xw = (xp + size) % size;
          const yw = (yp + size) % size;
          return heightData[(yw * size + xw) * 4] / 255;
        };

        const hL = getH(x - 1, y);
        const hR = getH(x + 1, y);
        const hT = getH(x, y - 1);
        const hB = getH(x, y + 1);

        // Central difference vectors
        const dx = (hR - hL) * strength;
        const dy = (hB - hT) * strength;

        // Normal vector components: N = normalize(-dx, -dy, 1.0)
        const len = Math.sqrt(dx * dx + dy * dy + 1.0);
        const nx = -dx / len;
        const ny = -dy / len;
        const nz = 1.0 / len;

        // Map components to 0..255 (RGB)
        const idx = (y * size + x) * 4;
        nData[idx] = Math.floor((nx * 0.5 + 0.5) * 255);
        nData[idx + 1] = Math.floor((ny * 0.5 + 0.5) * 255);
        nData[idx + 2] = Math.floor((nz * 0.5 + 0.5) * 255);
        nData[idx + 3] = 255;
      }
    }
    nCtx.putImageData(normalImg, 0, 0);

    // Create ThreeJS textures
    const map = new THREE.CanvasTexture(diffuseCanvas);
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;

    const normalMap = new THREE.CanvasTexture(normalCanvas);
    normalMap.wrapS = THREE.RepeatWrapping;
    normalMap.wrapT = THREE.RepeatWrapping;

    return { map, normalMap };
  },

  /**
   * Generates a polished, dark marble floor texture with reflective veins.
   */
  createMarbleFloor: (baseColorHex: string = '#0a0a0a', size: number = 512): { map: THREE.CanvasTexture; roughnessMap: THREE.CanvasTexture } => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Base background
    ctx.fillStyle = baseColorHex;
    ctx.fillRect(0, 0, size, size);

    // Draw veins
    const numVeins = 12;
    for (let v = 0; v < numVeins; v++) {
      ctx.strokeStyle = v % 2 === 0 ? 'rgba(212, 175, 55, 0.45)' : 'rgba(255, 255, 255, 0.35)'; // gold or white veins
      ctx.lineWidth = 0.5 + noise(v, 2) * 2;

      let cx = noise(v, 0) * size;
      let cy = 0;
      ctx.beginPath();
      ctx.moveTo(cx, cy);

      // Random walk down the canvas
      const steps = 30;
      const stepY = size / steps;
      for (let s = 1; s <= steps; s++) {
        cy = s * stepY;
        cx += (noise(v * s, 1) * 40 - 20) + Math.sin(s * 0.2) * 5;
        // Wrap around bounds
        const wrapX = (cx + size) % size;
        ctx.lineTo(wrapX, cy);
      }
      ctx.stroke();
    }

    // Add faint cloudiness
    const imgData = ctx.getImageData(0, 0, size, size);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const px = (i / 4) % size;
      const py = Math.floor((i / 4) / size);
      const cloud = perlinNoise(px * 0.02, py * 0.02) * 30 - 15;
      data[i] = Math.min(255, Math.max(0, data[i] + cloud));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + cloud));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + cloud));
    }
    ctx.putImageData(imgData, 0, 0);

    // Create Roughness map (highly reflective marble, rougher on veins)
    const roughCanvas = document.createElement('canvas');
    roughCanvas.width = size;
    roughCanvas.height = size;
    const rCtx = roughCanvas.getContext('2d')!;

    // Very shiny base (low roughness)
    rCtx.fillStyle = '#101010';
    rCtx.fillRect(0, 0, size, size);

    // Blend the marble veins into the roughness (makes veins slightly rougher)
    rCtx.globalAlpha = 0.35;
    rCtx.drawImage(canvas, 0, 0);

    // Create ThreeJS textures
    const map = new THREE.CanvasTexture(canvas);
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;

    const roughnessMap = new THREE.CanvasTexture(roughCanvas);
    roughnessMap.wrapS = THREE.RepeatWrapping;
    roughnessMap.wrapT = THREE.RepeatWrapping;

    return { map, roughnessMap };
  },

  /**
   * Generates a realistic brass/gold texture.
   */
  createBrassFrame: (size: number = 256): { map: THREE.CanvasTexture; roughnessMap: THREE.CanvasTexture } => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Deep gold color
    ctx.fillStyle = '#b89240';
    ctx.fillRect(0, 0, size, size);

    // Draw brushed metallic lines
    ctx.strokeStyle = '#dfc382';
    ctx.lineWidth = 1.0;
    for (let i = 0; i < 40; i++) {
      ctx.globalAlpha = 0.05 + noise(i, 0) * 0.15;
      const y = noise(i, 2) * size;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size, y + (noise(i, 3) * 20 - 10));
      ctx.stroke();
    }

    // Add fine metallic grain
    const imgData = ctx.getImageData(0, 0, size, size);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const px = (i / 4) % size;
      const py = Math.floor((i / 4) / size);
      const grain = noise(px, py) * 15 - 7.5;
      data[i] = Math.min(255, Math.max(0, data[i] + grain));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + grain));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + grain));
    }
    ctx.putImageData(imgData, 0, 0);

    // Create Roughness map (low-medium roughness, with high frequency noise)
    const roughCanvas = document.createElement('canvas');
    roughCanvas.width = size;
    roughCanvas.height = size;
    const rCtx = roughCanvas.getContext('2d')!;
    rCtx.fillStyle = '#404040'; // average roughness 0.25
    rCtx.fillRect(0, 0, size, size);

    const rImgData = rCtx.getImageData(0, 0, size, size);
    const rData = rImgData.data;
    for (let i = 0; i < rData.length; i += 4) {
      const px = (i / 4) % size;
      const py = Math.floor((i / 4) / size);
      const roughNoise = noise(px + 10, py + 10) * 35; // add scratching
      rData[i] = Math.min(255, Math.max(0, rData[i] + roughNoise));
      rData[i + 1] = Math.min(255, Math.max(0, rData[i + 1] + roughNoise));
      rData[i + 2] = Math.min(255, Math.max(0, rData[i + 2] + roughNoise));
    }
    rCtx.putImageData(rImgData, 0, 0);

    const map = new THREE.CanvasTexture(canvas);
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;

    const roughnessMap = new THREE.CanvasTexture(roughCanvas);
    roughnessMap.wrapS = THREE.RepeatWrapping;
    roughnessMap.wrapT = THREE.RepeatWrapping;

    return { map, roughnessMap };
  },

  /**
   * Creates a gorgeous coin-like medallion portrait fallback.
   */
  createFallbackPortrait: (initials: string, name: string, size: number = 512): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // 1. Dark Caravaggio gradient background
    const bgGrad = ctx.createRadialGradient(size / 2, size / 2, 50, size / 2, size / 2, size * 0.7);
    bgGrad.addColorStop(0, '#2d2417'); // Dark bronze center
    bgGrad.addColorStop(1, '#0e0b07'); // Pitch black edges
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, size, size);

    // 2. Outermost gold ring frame
    ctx.strokeStyle = '#d4af37'; // Gold
    ctx.lineWidth = 14;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size * 0.36, 0, Math.PI * 2);
    ctx.stroke();

    // 3. Inner decorative dashed ring
    ctx.shadowBlur = 0; // Disable shadows
    ctx.strokeStyle = '#856404'; // Antique bronze
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 12]);
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size * 0.33, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    // 4. Central circular relief base
    const reliefGrad = ctx.createRadialGradient(size / 2, size / 2 - 10, 10, size / 2, size / 2, size * 0.28);
    reliefGrad.addColorStop(0, '#8c7030');
    reliefGrad.addColorStop(0.8, '#4a3b19');
    reliefGrad.addColorStop(1, '#251d0c');
    ctx.fillStyle = reliefGrad;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size * 0.28, 0, Math.PI * 2);
    ctx.fill();

    // 5. Draw Initials with embossed text effect
    ctx.font = 'bold 96px "Georgia", "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Drop shadow/emboss down
    ctx.fillStyle = '#100c05';
    ctx.fillText(initials, size / 2 + 3, size / 2 + 5);

    // Highlights up
    ctx.fillStyle = '#ffdf7a';
    ctx.fillText(initials, size / 2 - 2, size / 2 - 2);

    // Front fill
    const textGrad = ctx.createLinearGradient(0, size * 0.4, 0, size * 0.6);
    textGrad.addColorStop(0, '#f0d37e');
    textGrad.addColorStop(0.5, '#b08f37');
    textGrad.addColorStop(1, '#70561a');
    ctx.fillStyle = textGrad;
    ctx.fillText(initials, size / 2, size / 2);

    // 6. Draw name curved or aligned at the bottom
    ctx.font = '16px "Georgia", serif';
    ctx.fillStyle = '#a89050';
    ctx.letterSpacing = '2px';
    const displayName = name.length > 25 ? name.substring(0, 23) + '...' : name;
    ctx.fillText(displayName.toUpperCase(), size / 2, size * 0.8);

    // 7. Add subtle cracks/patina overlay
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.lineWidth = 1;
    for (let c = 0; c < 5; c++) {
      ctx.beginPath();
      let x = size / 2 + (noise(c, 0) * 160 - 80);
      let y = size / 2 + (noise(c, 1) * 160 - 80);
      ctx.moveTo(x, y);
      for (let s = 0; s < 4; s++) {
        x += noise(c * s, 2) * 20 - 10;
        y += noise(c * s, 3) * 20 - 10;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    return new THREE.CanvasTexture(canvas);
  }
};
