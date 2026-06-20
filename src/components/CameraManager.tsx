import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { Leader, CameraMode } from '../types';

interface CameraManagerProps {
  mode: CameraMode;
  timelineX: number;
  activeLeader: Leader | null;
  onTransitionComplete: () => void;
  isExiting: boolean;
}

export const CameraManager: React.FC<CameraManagerProps> = ({
  mode,
  timelineX,
  activeLeader,
  onTransitionComplete,
  isExiting
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<React.ComponentRef<typeof OrbitControls> | null>(null);

  // Transition state tracking
  const transitionProgress = useRef(0);
  const transitionStartPos = useRef(new THREE.Vector3());
  const transitionStartLook = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3(0, 1, 0));

  // Initialize transitions when mode shifts
  useEffect(() => {
    if (mode === 'transition') {
      transitionProgress.current = 0;
      transitionStartPos.current.copy(camera.position);

      // Compute current direction camera is looking
      const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      // Project outward to establish a lookAt anchor
      transitionStartLook.current.copy(camera.position).addScaledVector(direction, 10);
    }
  }, [mode, camera]);

  useFrame((_state, delta) => {
    const targetPos = new THREE.Vector3();
    const targetLook = new THREE.Vector3();

    if (mode === 'timeline') {
      // Timeline camera position sits above and back
      targetPos.set(timelineX, 3.8, 14.5);
      targetLook.set(timelineX, 0.8, 0);

      // Smoothly interpolate timeline movements
      camera.position.lerp(targetPos, 0.08);
      currentLookAt.current.lerp(targetLook, 0.08);
      camera.lookAt(currentLookAt.current);
      
    } else if (mode === 'transition') {
      if (!activeLeader) return;

      if (!isExiting) {
        // Entering museum room: align with leader coordinates
        targetPos.set(activeLeader.x, 0.2, 5.8);
        targetLook.set(activeLeader.x, 0.2, 0);
      } else {
        // Returning to the timeline view
        targetPos.set(activeLeader.x, 3.8, 14.5);
        targetLook.set(activeLeader.x, 0.8, 0);
      }

      // Smooth transition progress over ~1.2 seconds
      transitionProgress.current += delta * 0.85;
      const t = Math.min(1, transitionProgress.current);

      // Cubic Ease-In-Out
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      camera.position.lerpVectors(transitionStartPos.current, targetPos, ease);
      currentLookAt.current.lerpVectors(transitionStartLook.current, targetLook, ease);
      camera.lookAt(currentLookAt.current);

      if (t >= 1) {
        onTransitionComplete();
      }
    }
  });

  // Enable OrbitControls when actively inside a museum room
  if (mode === 'museum' && activeLeader) {
    return (
      <OrbitControls
        ref={controlsRef}
        target={[activeLeader.x, 0.2, 0]}
        enableDamping
        dampingFactor={0.06}
        minDistance={3.0}
        maxDistance={8.0}
        // Restrict vertical orbit to prevent clipping through procedural roof or floor
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2 + 0.08}
        // Restrict horizontal orbit to keep focused on the gallery room backwall
        minAzimuthAngle={-Math.PI / 3.8}
        maxAzimuthAngle={Math.PI / 3.8}
        enablePan={false}
      />
    );
  }

  return null;
};
