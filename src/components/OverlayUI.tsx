'use client';
import React, { useState, useEffect, useRef } from 'react';
import type { Leader, Era, GraphicsQuality } from '../types';
import { LEADERS, ERAS } from '../data/leaders';
import {
  Search,
  Settings,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  X,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { NigeriaCoatOfArms } from './NigeriaCoatOfArms';
import { AbujaSkyline } from './AbujaSkyline';


interface OverlayUIProps {
  currentX: number;
  mode: 'timeline' | 'transition' | 'museum';
  activeLeader: Leader | null;
  graphicsQuality: GraphicsQuality;
  musicEnabled: boolean;
  isFullscreen: boolean;
  onSelectLeader: (leader: Leader) => void;
  onSetGraphicsQuality: (q: GraphicsQuality) => void;
  onToggleMusic: () => void;
  onSetTargetX: (x: number) => void;
  onToggleFullscreen: () => void;
  isMenuOpen: boolean;
  onSetMenuOpen: (open: boolean) => void;
  isStarted: boolean;
  onStart: () => void;
  viewMode: '3d' | '2d';
  onToggleViewMode: (mode: '3d' | '2d') => void;
}

export const OverlayUI: React.FC<OverlayUIProps> = ({
  currentX,
  mode,
  activeLeader,
  graphicsQuality,
  musicEnabled,
  isFullscreen,
  onSelectLeader,
  onSetGraphicsQuality,
  onToggleMusic,
  onSetTargetX,
  onToggleFullscreen,
  isMenuOpen,
  onSetMenuOpen,
  isStarted,
  onStart,
  viewMode,
  onToggleViewMode
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [mouseInactive, setMouseInactive] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Find current era based on camera position
  const currentEra: Era = React.useMemo(() => {
    // If in museum/transition mode, use active leader's era
    if (activeLeader) return ERAS[activeLeader.era];

    // Find era by mapping currentX coordinate to leader ranges
    // X ranges: Colonial (0-150), Independence (175-225), Military (250-425), Democratic (450-575)
    if (currentX < 162.5) return ERAS.colonial;
    if (currentX < 237.5) return ERAS.independence;
    if (currentX < 437.5) return ERAS.military;
    return ERAS.democratic;
  }, [currentX, activeLeader]);

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setShowSettingsDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hide cursor/UI after mouse inactivity
  useEffect(() => {
    const handleMouseMove = () => {
      setMouseInactive(false);
      document.body.classList.remove('hide-cursor');

      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);

      inactivityTimer.current = setTimeout(() => {
        // Only hide if exhibition has started and not in a static menu
        if (isStarted && !isMenuOpen && !showSearchDropdown && !showSettingsDropdown) {
          setMouseInactive(true);
          document.body.classList.add('hide-cursor');
        }
      }, 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseMove);
    window.addEventListener('keydown', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseMove);
      window.removeEventListener('keydown', handleMouseMove);
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [isStarted, isMenuOpen, showSearchDropdown, showSettingsDropdown]);

  // Autocomplete search filtering
  const filteredLeaders = LEADERS.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchSelect = (leader: Leader) => {
    onSelectLeader(leader);
    setSearchQuery('');
    setShowSearchDropdown(false);
    onSetMenuOpen(false); // Close menu if search occurred inside ESC menu
  };

  // Timeline Scrubber Click/Drag
  const handleScrubberAction = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== 'timeline') return; // Scrubber locked during museum room visits
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    // Timeline maps from X = 0 (Lugard) to X = 575 (Tinubu)
    const targetX = ratio * 575;
    onSetTargetX(targetX);
  };

  // Landing Gate Screen
  if (!isStarted) {
    return (
      <div className="landing-screen">
        <div className="flag-ribbon-left"></div>
        <div className="flag-ribbon-right"></div>
        <div className="landing-backdrop"></div>
        <AbujaSkyline opacity={0.35} />

        <div className="landing-card">
          <div className="coat-of-arms-container">
            <NigeriaCoatOfArms width={130} height={130} />
          </div>

          <header className="landing-header">
            <span className="subtitle-badge">NIGERIA HISTORICAL ARCHIVE</span>
            <h1>Nigeria Leadership</h1>
            <h2 className="title-highlight">Chronological Digital Museum</h2>
            <p className="landing-desc">
              Embark on an immersive chronological walkthrough of Nigeria's leadership history. 
              Explore detailed biographies and achievements from the colonial governance era up to present-day democracy, 
              rendered beautifully with rich national symbols.
            </p>
          </header>

          <section className="view-mode-selector-landing">
            <h3>SELECT EXHIBITION MODE</h3>
            <div className="view-choices-grid">
              <button
                className={`view-choice-btn ${viewMode === '3d' ? 'active gold-active' : ''}`}
                onClick={() => onToggleViewMode('3d')}
              >
                <span className="view-title">
                  <Sparkles size={14} className={viewMode === '3d' ? 'icon-pulse' : ''} style={{ color: '#d4af37' }} />
                  3D Immersive Room
                </span>
                <span className="view-sub">Explore a 3D gallery hall with dynamic lighting & frame meshes</span>
              </button>
              <button
                className={`view-choice-btn ${viewMode === '2d' ? 'active' : ''}`}
                onClick={() => onToggleViewMode('2d')}
              >
                <span className="view-title">
                  <Sparkles size={14} style={{ color: '#10b981' }} />
                  2D Digital Gallery
                </span>
                <span className="view-sub">Browse catalog lists & cards, optimized for speed & accessibility</span>
              </button>
            </div>
          </section>

          {viewMode === '3d' && (
            <section className="settings-panel-landing">
              <h3>EXHIBITION RENDERING QUALITY</h3>
              <div className="quality-presets">
                {(['low', 'medium', 'high'] as GraphicsQuality[]).map((q) => (
                  <button
                    key={q}
                    className={`preset-btn ${graphicsQuality === q ? 'active' : ''}`}
                    onClick={() => onSetGraphicsQuality(q)}
                  >
                    <span className="preset-name">{q.toUpperCase()}</span>
                    <span className="preset-sub">
                      {q === 'low' && 'Max FPS / No Postprocessing / No Shadows'}
                      {q === 'medium' && 'Balanced / Standard Bloom / Shadow Maps'}
                      {q === 'high' && 'Cinematic / Depth of Field / Bloom / Reflections'}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}

          <button className="start-btn" onClick={onStart}>
            <Sparkles className="icon-pulse" size={20} />
            <span>ENTER EXHIBITION</span>
          </button>
        </div>
        <div className="landing-footer">
          <p>
            {viewMode === '3d'
              ? 'Clicking enters fullscreen mode automatically. Use SCROLL wheel or drag SCRUBBER to traverse time. Press ESC to configure settings.'
              : 'Explore the full timeline database of Nigeria\'s leaders, with search filters and Wikipedia records.'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`hud-container ${mouseInactive ? 'hud-hidden' : ''}`}>
      {/* 1. TOP-LEFT: ERA TITLE HUD */}
      {viewMode === '3d' && (
        <header className="hud-era-panel">
          <div className="era-dot" style={{ backgroundColor: currentEra.color }}></div>
          <div className="era-text-group">
            <span className="era-label">CURRENT EXHBIT ERA</span>
            <h2 style={{ textShadow: `0 0 10px ${currentEra.color}30` }}>
              {currentEra.name.toUpperCase()}
            </h2>
            <span className="era-years">({currentEra.startYear} – {currentEra.endYear})</span>
          </div>
        </header>
      )}

      {/* 2. TOP-RIGHT: CONTROLS & SEARCH */}
      <div className="hud-controls">
        {/* Toggle Mode */}
        <div className="hud-view-toggle">
          <button
            className={`hud-toggle-btn ${viewMode === '3d' ? 'active' : ''}`}
            onClick={() => onToggleViewMode('3d')}
            title="Switch to 3D room"
          >
            3D Room
          </button>
          <button
            className={`hud-toggle-btn ${viewMode === '2d' ? 'active' : ''}`}
            onClick={() => onToggleViewMode('2d')}
            title="Switch to 2D timeline"
          >
            2D Gallery
          </button>
        </div>

        {/* Search Engine */}
        <div className="hud-search-wrapper" ref={searchRef}>
          <div className="search-bar">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search leader..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')}>
                <X size={14} />
              </button>
            )}
          </div>
          
          {showSearchDropdown && searchQuery && (
            <div className="search-dropdown scrollbar-custom">
              {filteredLeaders.length > 0 ? (
                filteredLeaders.map((leader) => (
                  <div
                    key={leader.id}
                    className="search-item"
                    onClick={() => handleSearchSelect(leader)}
                  >
                    <div className="search-item-info">
                      <h4>{leader.name}</h4>
                      <p>{leader.role} ({leader.startYear} - {leader.endYear})</p>
                    </div>
                    <ChevronRight size={14} className="arrow" style={{ color: ERAS[leader.era].color }} />
                  </div>
                ))
              ) : (
                <div className="search-empty">No leadership records found.</div>
              )}
            </div>
          )}
        </div>

        {/* Quick Settings Panel Button */}
        <div className="hud-settings-wrapper" ref={settingsRef}>
          <button
            className={`control-hud-btn ${showSettingsDropdown ? 'active' : ''}`}
            onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
            title="Configure settings"
          >
            <Settings size={18} />
          </button>

          {showSettingsDropdown && (
            <div className="hud-settings-dropdown">
              {viewMode === '3d' && (
                <>
                  <h4>GRAPHICS PRESET</h4>
                  <div className="settings-option-grid">
                    {(['low', 'medium', 'high'] as GraphicsQuality[]).map((q) => (
                      <button
                        key={q}
                        className={`quality-choice-btn ${graphicsQuality === q ? 'active' : ''}`}
                        onClick={() => onSetGraphicsQuality(q)}
                      >
                        {q.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <hr className="menu-divider" />
                </>
              )}
              
              <div className="sound-setting-row" onClick={onToggleMusic}>
                <span>Ambient Soundtrack</span>
                {musicEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </div>

              <div className="sound-setting-row" onClick={onToggleFullscreen}>
                <span>Exhibition Fullscreen</span>
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. BOTTOM: SCRUBBER BAR */}
      {viewMode === '3d' && (
        <footer className={`hud-bottom-scrubber ${mode !== 'timeline' ? 'scrubber-locked' : ''}`}>
          <div className="scrub-labels">
            <span>COLONIAL</span>
            <span>INDEPENDENCE</span>
            <span>MILITARY</span>
            <span>DEMOCRATIC</span>
          </div>
          
          <div className="scrubber-bar-track" onClick={handleScrubberAction}>
            {/* Era Segments Background Glow */}
            <div className="era-segment-bg" style={{ left: '0%', width: '27%', backgroundColor: '#b453091e' }}></div>
            <div className="era-segment-bg" style={{ left: '27%', width: '13%', backgroundColor: '#0478571e' }}></div>
            <div className="era-segment-bg" style={{ left: '40%', width: '33%', backgroundColor: '#4b55631e' }}></div>
            <div className="era-segment-bg" style={{ left: '73%', width: '27%', backgroundColor: '#0284c71e' }}></div>

            {/* Scrubber Knob */}
            <div
              className="scrubber-knob"
              style={{ left: `${(currentX / 575) * 100}%` }}
            >
              <div className="knob-pulse" style={{ backgroundColor: currentEra.color }}></div>
            </div>
          </div>

          <div className="scrub-indicator-text">
            <span>TRAVERSING SPATIAL HISTORICAL TIMELINE: {Math.round(1914 + (currentX / 575) * 112)} AD</span>
          </div>
        </footer>
      )}

      {/* 4. ESCAPE / PAUSE OVERLAY MENU */}
      {isMenuOpen && (
        <div className="pause-menu-overlay">
          <div className="pause-menu-card">
            <header className="menu-header">
              <h2>EXHIBITION MENU</h2>
              <p>Press ESC to resume traversal</p>
            </header>

            <div className="menu-actions">
              <button className="menu-btn primary" onClick={() => onSetMenuOpen(false)}>
                <span>RESUME TRAVERSAL</span>
              </button>

              <div className="menu-section">
                <h3>GRAPHICS SETTINGS</h3>
                <div className="menu-quality-select">
                  {(['low', 'medium', 'high'] as GraphicsQuality[]).map((q) => (
                    <button
                      key={q}
                      className={`menu-q-btn ${graphicsQuality === q ? 'active' : ''}`}
                      onClick={() => onSetGraphicsQuality(q)}
                    >
                      <span>{q.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="menu-section">
                <h3>AUDIO PREFERENCES</h3>
                <button className="menu-audio-btn" onClick={onToggleMusic}>
                  <span>Soundtrack: {musicEnabled ? 'ENABLED' : 'DISABLED'}</span>
                  {musicEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
              </div>

              <button className="menu-btn secondary" onClick={onToggleFullscreen}>
                <span>TOGGLE FULLSCREEN</span>
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>

              <button
                className="menu-btn exit"
                onClick={() => {
                  onSetMenuOpen(false);
                  window.location.reload(); // Hard exit reload
                }}
              >
                <span>EXIT EXHIBITION</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
