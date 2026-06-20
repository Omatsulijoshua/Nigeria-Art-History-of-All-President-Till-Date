import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Vignette,
  Noise,
  ChromaticAberration
} from '@react-three/postprocessing';
import * as THREE from 'three';
import type { GraphicsQuality, CameraMode } from '../types';

interface CinematicEffectsProps {
  graphicsQuality: GraphicsQuality;
  cameraMode: CameraMode;
  targetX: number;
}

export const CinematicEffects: React.FC<CinematicEffectsProps> = ({
  graphicsQuality,
  cameraMode,
  targetX
}) => {
  const dofRef = useRef<{ bokehScale: number; focusDistance: number } | null>(null);
  const chromaRef = useRef<{ offset: THREE.Vector2 } | null>(null);

  // Animate Depth of Field and Chromatic Aberration slightly if needed
  useFrame((state) => {
    if (graphicsQuality !== 'high') return;

    if (dofRef.current) {
      if (cameraMode === 'museum') {
        // High focus on the portrait in museum mode
        dofRef.current.bokehScale = 2.0;
        dofRef.current.focusDistance = 0.35; // Matches the close-up zoom
      } else {
        // Less blur in timeline view so dates and names remain highly readable
        dofRef.current.bokehScale = 0.5;
        dofRef.current.focusDistance = 0.7;
      }
    }

    if (chromaRef.current) {
      // Subtle pulse to aberration offset matching clock time (dynamic lens effect)
      const time = state.clock.getElapsedTime();
      const wave = Math.sin(time * 0.5) * 0.0003 + 0.0012;
      chromaRef.current.offset.set(wave, wave);
    }
  });

  // Low graphics preset bypasses postprocessing composer completely for max performance
  if (graphicsQuality === 'low') {
    return null;
  }

  const isHigh = graphicsQuality === 'high';

  return (
    <EffectComposer disableNormalPass multisampling={isHigh ? 4 : 0}>
      {/* @ts-expect-error - React 19 compatibility */}
      <Bloom
        luminanceThreshold={0.15}
        luminanceSmoothing={0.9}
        intensity={1.2}
        mipmapBlur
      />
      {isHigh && (
        /* @ts-expect-error - React 19 compatibility */
        <DepthOfField
          ref={dofRef}
          target={[targetX, 0.2, -2.9]}
          focalLength={0.02}
          bokehScale={2.0}
          height={480}
        />
      )}
      {isHigh && (
        /* @ts-expect-error - React 19 compatibility */
        <ChromaticAberration
          ref={chromaRef}
          offset={new THREE.Vector2(0.0012, 0.0012)}
          radialModulation={false}
        />
      )}
      {/* @ts-expect-error - React 19 compatibility */}
      <Noise opacity={0.02} premultiply />
      {/* @ts-expect-error - React 19 compatibility */}
      <Vignette eskil={false} offset={0.3} darkness={0.55} />
    </EffectComposer>
  );
};
