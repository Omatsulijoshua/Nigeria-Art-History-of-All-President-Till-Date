import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Leader, Era, LeaderWikiData, GraphicsQuality } from '../types';
import { ERAS } from '../data/leaders';
import { TextureGenerator } from '../utils/TextureGenerator';
import { fetchLeaderWikiData } from '../services/wikipedia';
import { X, Calendar, Landmark, BookOpen, ExternalLink } from 'lucide-react';

interface MuseumRoomProps {
  leader: Leader;
  graphicsQuality: GraphicsQuality;
  onExit: () => void;
}

// Separate global caches for procedural textures to ensure strict TypeScript return typing
const stoneWallCache: Record<string, { map: THREE.Texture; normalMap: THREE.Texture }> = {};
const marbleFloorCache: Record<string, { map: THREE.Texture; roughnessMap: THREE.Texture }> = {};
const brassFrameCache: Record<string, { map: THREE.Texture; roughnessMap: THREE.Texture }> = {};

function getStoneWallTextures() {
  const key = 'stone_wall_default';
  if (!stoneWallCache[key]) {
    stoneWallCache[key] = TextureGenerator.createStoneWall('#1c1a17', 512);
  }
  return stoneWallCache[key];
}

function getMarbleFloorTextures(color: string) {
  const key = `marble_floor_${color}`;
  if (!marbleFloorCache[key]) {
    marbleFloorCache[key] = TextureGenerator.createMarbleFloor(color, 512);
  }
  return marbleFloorCache[key];
}

function getBrassFrameTextures() {
  const key = 'brass_frame_default';
  if (!brassFrameCache[key]) {
    brassFrameCache[key] = TextureGenerator.createBrassFrame(256);
  }
  return brassFrameCache[key];
}

// --- PORTRAIT LOADER ---
const Portrait: React.FC<{ url: string; name: string }> = ({ url, name }) => {
  const [prevUrl, setPrevUrl] = useState(url);
  const [texture, setTexture] = useState<THREE.Texture | null>(() => {
    if (url.startsWith('fallback:')) {
      const parts = url.split(':');
      const initials = parts[1] || 'NL';
      const displayName = parts[2] || name;
      return TextureGenerator.createFallbackPortrait(initials, displayName);
    }
    return null;
  });

  if (url !== prevUrl) {
    setPrevUrl(url);
    if (url.startsWith('fallback:')) {
      const parts = url.split(':');
      const initials = parts[1] || 'NL';
      const displayName = parts[2] || name;
      setTexture(TextureGenerator.createFallbackPortrait(initials, displayName));
    } else {
      setTexture(null);
    }
  }

  useEffect(() => {
    if (url.startsWith('fallback:')) {
      return;
    }

    // Try loading Wikipedia image
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    loader.load(
      url,
      (tex) => {
        setTexture(tex);
      },
      undefined,
      (err) => {
        console.warn(`Failed loading image for ${name}, loading procedural medallion.`, err);
        const initials = name
          .split(' ')
          .filter(n => !n.startsWith('Sir') && !n.startsWith('Lord') && !n.startsWith('Dr') && !n.startsWith('Chief'))
          .map(n => n[0])
          .join('')
          .substring(0, 2) || 'NL';
        const tex = TextureGenerator.createFallbackPortrait(initials.toUpperCase(), name);
        setTexture(tex);
      }
    );
  }, [url, name]);

  if (!texture) return null;

  return (
    <mesh position={[0, 0, 0.08]} castShadow receiveShadow>
      <planeGeometry args={[1.5, 2.0]} />
      <meshStandardMaterial map={texture} roughness={0.3} metalness={0.1} />
    </mesh>
  );
};

// --- DUST PARTICLES ---
const DustParticles: React.FC<{ roomX: number }> = ({ roomX }) => {
  const count = 150;
  const meshRef = useRef<THREE.Points>(null);

  const points = useMemo(() => {
    // Deterministic seed based on roomX
    let seed = Math.abs(roomX * 1000) + 1;
    // Simple LCG PRNG
    const rand = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };

    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = roomX + (rand() * 10 - 5);      // X
      positions[i * 3 + 1] = -1.5 + rand() * 5.5;        // Y
      positions[i * 3 + 2] = rand() * 9 - 1.5;          // Z

      velocities[i * 3] = (rand() * 0.16 - 0.08);       // dx
      velocities[i * 3 + 1] = (0.04 + rand() * 0.12);    // dy (upward drift)
      velocities[i * 3 + 2] = (rand() * 0.16 - 0.08);   // dz
    }

    return { positions, velocities };
  }, [roomX]);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    const geo = meshRef.current.geometry;
    const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;

    for (let i = 0; i < count; i++) {
      let x = posAttr.getX(i) + points.velocities[i * 3] * delta;
      let y = posAttr.getY(i) + points.velocities[i * 3 + 1] * delta;
      let z = posAttr.getZ(i) + points.velocities[i * 3 + 2] * delta;

      // Recycle particles drifting above ceiling
      if (y > 4.0) {
        y = -1.5;
        x = roomX + (Math.random() * 10 - 5);
        z = Math.random() * 9 - 1.5;
      }

      posAttr.setXYZ(i, x, y, z);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[points.positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#e4b358"
        size={0.04}
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </points>
  );
};

// --- VOLUMETRIC LIGHT CONE ---
const VolumetricLight: React.FC<{ roomX: number; color: string }> = ({ roomX, color }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle pulse to simulate dust thickness variation
      const time = state.clock.getElapsedTime();
      meshRef.current.scale.set(
        1.0 + Math.sin(time * 0.8) * 0.02,
        1.0,
        1.0 + Math.sin(time * 0.8) * 0.02
      );
      // Faint transparency flickering
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.09 + Math.sin(time * 1.5) * 0.015;
    }
  });

  // Positioned from spotlight pointing down
  return (
    <mesh
      ref={meshRef}
      position={[roomX, 1.4, 1.8]}
      rotation={[Math.PI / 4, 0, 0]}
    >
      <coneGeometry args={[1.4, 5.0, 32, 1, true]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.1}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// --- MAIN MUSEUM ROOM ENGINE ---
export const MuseumRoom: React.FC<MuseumRoomProps> = ({
  leader,
  graphicsQuality,
  onExit
}) => {
  const era: Era = ERAS[leader.era];
  
  const [prevLeader, setPrevLeader] = useState(leader);
  const [wikiData, setWikiData] = useState<LeaderWikiData | null>(null);
  const [loading, setLoading] = useState(true);

  if (leader.id !== prevLeader.id) {
    setPrevLeader(leader);
    setLoading(true);
    setWikiData(null);
  }

  // Load Wikipedia Data dynamically
  useEffect(() => {
    let active = true;

    fetchLeaderWikiData(leader).then((data) => {
      if (active) {
        setWikiData(data);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [leader]);

  // Procedural Textures Memoization
  const wallTextures = useMemo(() => getStoneWallTextures(), []);
  const floorTextures = useMemo(() => getMarbleFloorTextures(era.ambientColor), [era.ambientColor]);
  const frameTextures = useMemo(() => getBrassFrameTextures(), []);

  const enableShadows = graphicsQuality !== 'low';

  return (
    <group>
      {/* 1. ROOM ENVIRONMENT ENVELOPE */}
      {/* Floor */}
      <mesh
        position={[leader.x, -1.5, 3]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow={enableShadows}
      >
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial
          map={floorTextures.map}
          roughnessMap={floorTextures.roughnessMap}
          roughness={era.materials.floorRoughness}
          metalness={era.materials.floorMetalness}
        />
      </mesh>

      {/* Ceiling */}
      <mesh position={[leader.x, 4.0, 3]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#0f0e0d" roughness={0.9} />
      </mesh>

      {/* Back Wall (Holds Portrait) */}
      <mesh position={[leader.x, 1.25, -3.0]} receiveShadow={enableShadows}>
        <planeGeometry args={[12, 5.5]} />
        <meshStandardMaterial
          map={wallTextures.map}
          normalMap={wallTextures.normalMap}
          normalScale={new THREE.Vector2(0.5, 0.5)}
          roughness={era.materials.wallRoughness}
        />
      </mesh>

      {/* Left Wall */}
      <mesh
        position={[leader.x - 6.0, 1.25, 3]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow={enableShadows}
      >
        <planeGeometry args={[12, 5.5]} />
        <meshStandardMaterial
          map={wallTextures.map}
          normalMap={wallTextures.normalMap}
          normalScale={new THREE.Vector2(0.5, 0.5)}
          roughness={era.materials.wallRoughness}
        />
      </mesh>

      {/* Right Wall */}
      <mesh
        position={[leader.x + 6.0, 1.25, 3]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow={enableShadows}
      >
        <planeGeometry args={[12, 5.5]} />
        <meshStandardMaterial
          map={wallTextures.map}
          normalMap={wallTextures.normalMap}
          normalScale={new THREE.Vector2(0.5, 0.5)}
          roughness={era.materials.wallRoughness}
        />
      </mesh>

      {/* 2. DUST PARTICLES & LIGHT BEAMS */}
      {graphicsQuality !== 'low' && <DustParticles roomX={leader.x} />}
      {graphicsQuality !== 'low' && (
        <VolumetricLight roomX={leader.x} color={era.spotlightColor} />
      )}

      {/* 3. LIGHTING (Caravaggio Chiaroscuro System) */}
      {/* Dark Ambient base */}
      <ambientLight intensity={0.03} />

      {/* The Single Dominant SpotLight */}
      <spotLight
        position={[leader.x, 3.8, 3.0]}
        target-position={[leader.x, 0.2, -3.0]}
        angle={Math.PI / 6.5}
        penumbra={0.85}
        intensity={graphicsQuality === 'low' ? 6.0 : 12.0}
        distance={15}
        color={era.spotlightColor}
        castShadow={enableShadows}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.001}
      />

      {/* Subtle wall light glow behind the frame to separate it from the deep shadows */}
      <pointLight
        position={[leader.x, 0.2, -2.8]}
        color={era.color}
        intensity={1.5}
        distance={4}
      />

      {/* 4. THE PORTRAIT & FRAME */}
      <group position={[leader.x, 0.25, -2.9]}>
        {/* Brass Portrait Frame */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.7, 2.2, 0.12]} />
          <meshStandardMaterial
            map={frameTextures.map}
            roughnessMap={frameTextures.roughnessMap}
            metalness={0.8}
            roughness={0.25}
            color="#cca43b"
          />
        </mesh>
        
        {/* Inner shadow mount */}
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[1.54, 2.04]} />
          <meshStandardMaterial color="#080706" roughness={0.9} />
        </mesh>

        {/* Dynamic Portrait Image */}
        {!loading && wikiData && (
          <Portrait url={wikiData.portraitUrl} name={leader.name} />
        )}
      </group>

      {/* 5. FLOATING GLASS UI PANELS (Rendered via R3F Html) */}
      {/* A. BIOGRAPHY PANEL (Left side of Room) */}
      <Html
        position={[leader.x - 3.2, 0.25, 0.2]}
        rotation={[0, Math.PI / 8, 0]}
        transform
        distanceFactor={4.5}
      >
        <div className="glass-panel bio-panel">
          {loading ? (
            <div className="wiki-loader">
              <div className="spinner"></div>
              <p>Loading historical record...</p>
            </div>
          ) : (
            wikiData && (
              <div className="wiki-content">
                <header className="wiki-header">
                  <span className="badge" style={{ backgroundColor: era.color }}>
                    {era.name}
                  </span>
                  <h2>{leader.name}</h2>
                  <div className="meta-row">
                    <Calendar size={14} className="icon" />
                    <span>{wikiData.lifespan}</span>
                  </div>
                  <div className="meta-row">
                    <Landmark size={14} className="icon" />
                    <span className="role-text">{wikiData.role}</span>
                  </div>
                </header>
                <hr className="divider" />
                <div className="wiki-bio">
                  <BookOpen size={16} className="bio-icon" />
                  <p>{wikiData.summary}</p>
                </div>
                <footer className="wiki-footer">
                  <a
                    href={wikiData.wikiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wiki-link"
                    style={{ color: era.color }}
                  >
                    <span>Read Full Wikipedia Article</span>
                    <ExternalLink size={12} />
                  </a>
                </footer>
              </div>
            )
          )}
        </div>
      </Html>

      {/* B. ACHIEVEMENTS & MILESTONES PANEL (Right side of Room) */}
      <Html
        position={[leader.x + 3.2, 0.25, 0.2]}
        rotation={[0, -Math.PI / 8, 0]}
        transform
        distanceFactor={4.5}
      >
        <div className="glass-panel achievements-panel">
          <header className="achievements-header">
            <h3>KEY HISTORICAL MILESTONES</h3>
            <p className="governance-dates">
              GOVERNANCE: {leader.startYear} – {leader.endYear}
            </p>
          </header>
          <hr className="divider" />
          <div className="achievements-list">
            {leader.achievements.map((ach, idx) => (
              <div key={idx} className="achievement-item">
                <div className="achievement-year-badge" style={{ borderColor: era.color, color: era.color }}>
                  {ach.year}
                </div>
                <div className="achievement-details">
                  <h4>{ach.title}</h4>
                  <p>{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Html>

      {/* C. CLOSE ROOM HUD BUTTON (Positioned in 3D Space above Portrait) */}
      <Html
        position={[leader.x, 1.8, -2.0]}
        center
        transform
        distanceFactor={4.0}
      >
        <button className="exit-room-btn" onClick={onExit}>
          <X size={16} />
          <span>Exit Museum Room</span>
        </button>
      </Html>
    </group>
  );
};
