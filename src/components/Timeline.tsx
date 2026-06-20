import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import type { Leader } from '../types';
import { LEADERS, ERAS } from '../data/leaders';
import { TextureGenerator } from '../utils/TextureGenerator';

interface TimelineProps {
  onSelectLeader: (leader: Leader) => void;
  hoveredLeader: Leader | null;
  setHoveredLeader: (leader: Leader | null) => void;
}

// Inner component for each leader node to manage individual animations
interface LeaderNodeProps {
  leader: Leader;
  onSelect: () => void;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
}

const LeaderNode: React.FC<LeaderNodeProps> = ({
  leader,
  onSelect,
  isHovered,
  onHover
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Generate a procedural brass/gold medallion look for the node
  const textures = React.useMemo(() => {
    return TextureGenerator.createBrassFrame(128);
  }, []);

  // Float and rotate animation
  useFrame((state) => {
    if (meshRef.current) {
      // Bobbing up and down
      const elapsed = state.clock.getElapsedTime();
      meshRef.current.position.y = 1.0 + Math.sin(elapsed * 1.5 + leader.x) * 0.15;
      
      // Rotate coin
      meshRef.current.rotation.y = elapsed * 0.4 + leader.x;
    }

    if (ringRef.current && isHovered) {
      // Rotate the hover glow ring in the opposite direction
      ringRef.current.rotation.z = -state.clock.getElapsedTime() * 0.8;
    }
  });

  const eraColor = ERAS[leader.era]?.color || '#ffffff';

  return (
    <group
      position={[leader.x, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <group ref={meshRef}>
        {/* Floating Coin Medallion */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.8, 0.8, 0.15, 32]} />
          <meshStandardMaterial
            map={textures.map}
            roughnessMap={textures.roughnessMap}
            metalness={0.9}
            roughness={0.2}
            color="#ffd700"
          />
        </mesh>

        {/* Embossed Ring Details on Medallion */}
        <mesh position={[0, 0.09, 0]}>
          <torusGeometry args={[0.65, 0.05, 8, 32]} />
          <meshStandardMaterial color="#b8860b" metalness={1.0} roughness={0.1} />
        </mesh>
        
        <mesh position={[0, -0.09, 0]}>
          <torusGeometry args={[0.65, 0.05, 8, 32]} />
          <meshStandardMaterial color="#b8860b" metalness={1.0} roughness={0.1} />
        </mesh>

        {/* Hover Highlight Ring */}
        {isHovered && (
          <mesh ref={ringRef} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.1, 0.06, 8, 48]} />
            <meshBasicMaterial color={eraColor} />
          </mesh>
        )}
      </group>

      {/* Halo Glow effect (always active but intensifies on hover) */}
      <mesh position={[0, 1.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 1.4]} />
        <meshBasicMaterial
          color={eraColor}
          transparent
          opacity={isHovered ? 0.25 : 0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Floating 3D Text Label below Node */}
      <group position={[0, -0.4, 0]}>
        {/* Leader Name */}
        <Text
          fontSize={0.28}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/georgia/v13/georgiap.ttf"
        >
          {leader.name}
        </Text>

        {/* Timeline Dates */}
        <Text
          position={[0, -0.32, 0]}
          fontSize={0.18}
          color={isHovered ? eraColor : '#a0aec0'}
          anchorX="center"
          anchorY="middle"
        >
          {`${leader.startYear} – ${leader.endYear}`}
        </Text>

        {/* Role Subtext */}
        <Text
          position={[0, -0.56, 0]}
          fontSize={0.13}
          color="#718096"
          maxWidth={2.5}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
        >
          {leader.role.toUpperCase()}
        </Text>
      </group>
    </group>
  );
};

export const Timeline: React.FC<TimelineProps> = ({
  onSelectLeader,
  hoveredLeader,
  setHoveredLeader
}) => {
  // Draw Background Scenic Pillars to create depth in the void
  const backgroundPillars = React.useMemo(() => {
    const pillars = [];
    const count = 40;
    const spacing = 20;
    const startX = -100;

    for (let i = 0; i < count; i++) {
      const px = startX + i * spacing;
      // Stagger depths
      pillars.push(
        <group key={`pillar-${i}`} position={[px, -2, -15]}>
          {/* Main Pillar */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.5, 0.7, 12, 8]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
          </mesh>
          {/* Light shining up behind the pillar */}
          <pointLight
            position={[0, -2, -1]}
            color={i % 2 === 0 ? '#3b2f1e' : '#1e293b'}
            intensity={4}
            distance={10}
          />
        </group>
      );
    }
    return pillars;
  }, []);

  return (
    <group>
      {/* Dynamic Background Scenic Pillars */}
      {backgroundPillars}

      {/* Central Guide Track Line */}
      <mesh position={[287.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 800, 8]} />
        <meshStandardMaterial
          color="#334155"
          emissive="#0f172a"
          roughness={0.7}
        />
      </mesh>

      {/* Faint Grid Lines across Timeline path */}
      {LEADERS.map((leader) => {
        const era = ERAS[leader.era];
        return (
          <group key={`grid-${leader.id}`} position={[leader.x, 0, 0]}>
            {/* Vertical Tick Pin */}
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.5, 8]} />
              <meshBasicMaterial color={era.color} opacity={0.6} transparent />
            </mesh>
            
            {/* Connecting ground shadow disk */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.08, 0.12, 16]} />
              <meshBasicMaterial color={era.color} opacity={0.4} transparent />
            </mesh>
          </group>
        );
      })}

      {/* Render Era Dividers / Portals */}
      {Object.values(ERAS).map((era) => {
        const leadersInEra = LEADERS.filter((l) => l.era === era.id);
        if (leadersInEra.length === 0) return null;

        // Find boundary X positions for the era
        const startX = leadersInEra[0].x - 12.5;
        const endX = leadersInEra[leadersInEra.length - 1].x + 12.5;
        const centerX = (startX + endX) / 2;

        return (
          <group key={`era-${era.id}`}>
            {/* Era Title Floating High in the Background */}
            <Text
              position={[centerX, 4.2, -6]}
              fontSize={1.8}
              color="#ffffff"
              fillOpacity={0.06}
              strokeWidth={0.02}
              strokeColor={era.color}
              strokeOpacity={0.12}
              anchorX="center"
              anchorY="middle"
              font="https://fonts.gstatic.com/s/georgia/v13/georgiap.ttf"
            >
              {era.name.toUpperCase()}
            </Text>

            {/* Subtitle / Description Floating slightly lower */}
            <Text
              position={[centerX, 2.7, -5]}
              fontSize={0.24}
              color="#a0aec0"
              fillOpacity={0.35}
              maxWidth={15}
              textAlign="center"
              anchorX="center"
              anchorY="middle"
            >
              {era.description}
            </Text>

            {/* Boundary Pillars */}
            <group position={[startX, 0, 0]}>
              {/* Left boundary pillar */}
              <mesh position={[0, 1.5, -2]}>
                <boxGeometry args={[0.15, 3.5, 0.15]} />
                <meshStandardMaterial color={era.color} roughness={0.8} />
              </mesh>
              <pointLight position={[0, 3, -1.8]} color={era.color} intensity={3} distance={5} />
            </group>
            
            <group position={[endX, 0, 0]}>
              {/* Right boundary pillar */}
              <mesh position={[0, 1.5, -2]}>
                <boxGeometry args={[0.15, 3.5, 0.15]} />
                <meshStandardMaterial color={era.color} roughness={0.8} />
              </mesh>
              <pointLight position={[0, 3, -1.8]} color={era.color} intensity={3} distance={5} />
            </group>
          </group>
        );
      })}

      {/* Render Leader Nodes */}
      {LEADERS.map((leader) => (
        <LeaderNode
          key={leader.id}
          leader={leader}
          onSelect={() => onSelectLeader(leader)}
          isHovered={hoveredLeader?.id === leader.id}
          onHover={(hovered) => setHoveredLeader(hovered ? leader : null)}
        />
      ))}
    </group>
  );
};
