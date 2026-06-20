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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dofRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chromaRef = useRef<any>(null);

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

  if (graphicsQuality === 'high') {
    return (
      <EffectComposer enableNormalPass={false} multisampling={4}>
        <Bloom
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
          intensity={1.2}
          mipmapBlur
        />
        <DepthOfField
          ref={dofRef}
          target={[targetX, 0.2, -2.9]}
          focalLength={0.02}
          bokehScale={2.0}
          height={480}
        />
        <ChromaticAberration
          ref={chromaRef}
          offset={new THREE.Vector2(0.0012, 0.0012)}
          radialModulation={false}
        />
        <Noise opacity={0.02} premultiply />
        <Vignette eskil={false} offset={0.3} darkness={0.55} />
      </EffectComposer>
    );
  }

  // Medium graphics preset (no DOF / Chromatic Aberration)
  return (
    <EffectComposer enableNormalPass={false} multisampling={0}>
      <Bloom
        luminanceThreshold={0.15}
        luminanceSmoothing={0.9}
        intensity={1.2}
        mipmapBlur
      />
      <Noise opacity={0.02} premultiply />
      <Vignette eskil={false} offset={0.3} darkness={0.55} />
    </EffectComposer>
  );
};

