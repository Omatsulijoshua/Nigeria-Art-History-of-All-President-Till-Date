'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import type { Leader, CameraMode, GraphicsQuality } from './types';
import { CameraManager } from './components/CameraManager';
import { Timeline } from './components/Timeline';
import { MuseumRoom } from './components/MuseumRoom';
import { OverlayUI } from './components/OverlayUI';
import { CinematicEffects } from './components/CinematicEffects';
import { Gallery2D } from './components/Gallery2D';

// Procedural Web Audio API Ambient Synthesizer
// Synthesizes a warm space drone with modulating filters.
class AmbientSynth {
  private ctx: AudioContext | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private lfo: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private gain: GainNode | null = null;

  start() {
    try {
      this.ctx = new (window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();

      // Osc 1: Sub-bass fundamental (40Hz or 55Hz)
      this.osc1 = this.ctx.createOscillator();
      this.osc1.type = 'sawtooth';
      this.osc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note

      // Osc 2: Warm triangle slightly detuned (55.4Hz)
      this.osc2 = this.ctx.createOscillator();
      this.osc2.type = 'triangle';
      this.osc2.frequency.setValueAtTime(55.4, this.ctx.currentTime);

      // Filter: Lowpass to sculpt oscillators into a deep soft hum
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(105, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(4.0, this.ctx.currentTime);

      // LFO: Slow swell modulator to slowly sweep filter cutoff
      this.lfo = this.ctx.createOscillator();
      this.lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime); // 12.5s sweep cycle
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(35, this.ctx.currentTime);

      this.lfo.connect(lfoGain);
      lfoGain.connect(this.filter.frequency);

      // Gain control
      this.gain = this.ctx.createGain();
      this.gain.gain.setValueAtTime(0.0, this.ctx.currentTime);

      // Connections
      this.osc1.connect(this.filter);
      this.osc2.connect(this.filter);
      this.filter.connect(this.gain);
      this.gain.connect(this.ctx.destination);

      // Start sound oscillators
      this.osc1.start();
      this.osc2.start();
      this.lfo.start();

      // Smooth fade-in
      this.gain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 3.5);
    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
    }
  }

  setVolume(volume: number) {
    if (this.gain && this.ctx) {
      this.gain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 0.6);
    }
  }

  stop() {
    try {
      if (this.osc1) this.osc1.stop();
      if (this.osc2) this.osc2.stop();
      if (this.lfo) this.lfo.stop();
      if (this.ctx) this.ctx.close();
    } catch (e) {
      console.warn('Failed stopping synth nodes:', e);
    }
  }
}

function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [graphicsQuality, setGraphicsQuality] = useState<GraphicsQuality>('high');
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');

  // Camera and Timeline scroll states
  const [cameraMode, setCameraMode] = useState<CameraMode>('timeline');
  const [activeLeader, setActiveLeader] = useState<Leader | null>(null);
  const [hoveredLeader, setHoveredLeader] = useState<Leader | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  // timelineX represents the current visual scroll location
  const [timelineX, setTimelineX] = useState(0);
  // targetTimelineX represents the scrolling target destination
  const targetTimelineX = useRef(0);
  
  const synthRef = useRef<AmbientSynth | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Interpolate/lerp scrolling position smoothly
  useEffect(() => {
    let active = true;
    const updatePosition = () => {
      if (!active) return;
      if (cameraMode === 'timeline') {
        setTimelineX((prev) => {
          const diff = targetTimelineX.current - prev;
          if (Math.abs(diff) < 0.001) return targetTimelineX.current;
          return prev + diff * 0.08; // smooth easing factor
        });
      }
      requestAnimationFrame(updatePosition);
    };
    updatePosition();
    return () => {
      active = false;
    };
  }, [cameraMode]);

  // Audio Synthesizer Toggle Effects
  useEffect(() => {
    if (isStarted && musicEnabled) {
      if (!synthRef.current) {
        synthRef.current = new AmbientSynth();
        synthRef.current.start();
      } else {
        synthRef.current.setVolume(0.18);
      }
    } else {
      if (synthRef.current) {
        synthRef.current.setVolume(0);
      }
    }
  }, [isStarted, musicEnabled]);

  // Handle exiting cleanup
  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
      }
    };
  }, []);

  // Fullscreen Syncer
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard navigation & Menu toggles
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isStarted) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        setIsMenuOpen((prev) => !prev);
        return;
      }

      if (isMenuOpen) return; // ignore other inputs when menu is active

      if (cameraMode === 'timeline') {
        const step = 25; // jumps to next leader
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          targetTimelineX.current = Math.min(575, targetTimelineX.current + step);
        } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          targetTimelineX.current = Math.max(0, targetTimelineX.current - step);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStarted, cameraMode, isMenuOpen]);

  // Mouse wheel scroll to timeline navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isStarted || cameraMode !== 'timeline' || isMenuOpen) return;

      // Vertical wheel delta updates timeline target position
      // Multiplier regulates scroll speed sensitivity
      targetTimelineX.current = Math.max(
        0,
        Math.min(575, targetTimelineX.current + e.deltaY * 0.05)
      );
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isStarted, cameraMode, isMenuOpen]);

  // Fullscreen trigger interface
  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.warn('Failed to enter fullscreen:', err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.warn('Failed to exit fullscreen:', err);
      });
    }
  }, []);

  // Click start game
  const handleStartExhibition = () => {
    setIsStarted(true);
    // Request browser fullscreen on primary user gesture
    containerRef.current?.requestFullscreen().catch((err) => {
      console.warn('Fullscreen request bypassed or failed:', err);
    });
  };

  const handleSelectLeader = useCallback((leader: Leader) => {
    setActiveLeader(leader);
    setIsExiting(false);
    setCameraMode('transition');
    // Lock scroll target at selected leader X
    targetTimelineX.current = leader.x;
    setTimelineX(leader.x);
  }, []);

  const handleExitRoom = useCallback(() => {
    setIsExiting(true);
    setCameraMode('transition');
  }, []);

  const handleTransitionComplete = useCallback(() => {
    if (isExiting) {
      setCameraMode('timeline');
      setActiveLeader(null);
    } else {
      setCameraMode('museum');
    }
  }, [isExiting]);

  const handleSetTargetX = useCallback((x: number) => {
    targetTimelineX.current = x;
  }, []);

  return (
    <div ref={containerRef} className="app-root-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
      
      {/* 1. HUD OVERLAY SYSTEM */}
      <OverlayUI
        currentX={timelineX}
        mode={cameraMode}
        activeLeader={activeLeader}
        graphicsQuality={graphicsQuality}
        musicEnabled={musicEnabled}
        isFullscreen={isFullscreen}
        onSelectLeader={handleSelectLeader}
        onSetGraphicsQuality={setGraphicsQuality}
        onToggleMusic={() => setMusicEnabled(!musicEnabled)}
        onSetTargetX={handleSetTargetX}
        onToggleFullscreen={handleToggleFullscreen}
        isMenuOpen={isMenuOpen}
        onSetMenuOpen={setIsMenuOpen}
        isStarted={isStarted}
        onStart={handleStartExhibition}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
      />

      {/* 2. 2D GALLERY SYSTEM */}
      {isStarted && viewMode === '2d' && (
        <Gallery2D
          activeLeader={activeLeader}
          onSelectLeader={handleSelectLeader}
          onExitRoom={handleExitRoom}
        />
      )}

      {/* 3. 3D WEBGL ENGINE CANVAS */}
      {isStarted && viewMode === '3d' && (
        <Canvas
          shadows={graphicsQuality !== 'low'}
          gl={{
            antialias: false, // Turned off since postprocessing composer takes care of antialiasing
            powerPreference: 'high-performance',
            alpha: false,
            stencil: false,
            depth: true
          }}
          camera={{ fov: 45, near: 0.1, far: 120 }}
          onPointerDown={() => {
            // Close setting panel dropdowns on canvas click
            document.dispatchEvent(new MouseEvent('mousedown'));
          }}
        >
          {/* Black Void Background */}
          <color attach="background" args={['#010101']} />

          {/* Faint ambient stars/sparkles in background */}
          <fogExp2 attach="fog" args={['#030303', 0.015]} />

          {/* Timeline scene */}
          {(cameraMode === 'timeline' || cameraMode === 'transition') && (
            <Timeline
              onSelectLeader={handleSelectLeader}
              hoveredLeader={hoveredLeader}
              setHoveredLeader={setHoveredLeader}
            />
          )}

          {/* Procedural Museum Room */}
          {activeLeader && (
            <MuseumRoom
              leader={activeLeader}
              graphicsQuality={graphicsQuality}
              onExit={handleExitRoom}
            />
          )}

          {/* Camera Controller State Machine */}
          <CameraManager
            mode={cameraMode}
            timelineX={timelineX}
            activeLeader={activeLeader}
            onTransitionComplete={handleTransitionComplete}
            isExiting={isExiting}
          />

          {/* Cinematic Post Processing filters */}
          <CinematicEffects
            graphicsQuality={graphicsQuality}
            cameraMode={cameraMode}
            targetX={activeLeader ? activeLeader.x : timelineX}
          />
        </Canvas>
      )}
    </div>
  );
}

export default App;
