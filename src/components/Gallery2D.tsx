'use client';
import React, { useEffect, useState } from 'react';
import type { Leader, EraId, LeaderWikiData } from '../types';
import { LEADERS, ERAS } from '../data/leaders';
import { fetchLeaderWikiData } from '../services/wikipedia';
import { Calendar, Landmark, BookOpen, ExternalLink, Award, ArrowLeft } from 'lucide-react';

interface Gallery2DProps {
  activeLeader: Leader | null;
  onSelectLeader: (leader: Leader) => void;
  onExitRoom: () => void;
}

export const Gallery2D: React.FC<Gallery2DProps> = ({
  activeLeader,
  onSelectLeader,
  onExitRoom
}) => {
  const [selectedEra, setSelectedEra] = useState<EraId | 'all'>('all');
  const [wikiData, setWikiData] = useState<LeaderWikiData | null>(null);
  const [loadingBio, setLoadingBio] = useState(false);

  // Filter leaders by selected era
  const filteredLeaders = LEADERS.filter(
    (leader) => selectedEra === 'all' || leader.era === selectedEra
  );

  // Fetch Wikipedia data when activeLeader changes
  useEffect(() => {
    if (!activeLeader) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWikiData(null);
      return;
    }

    setLoadingBio(true);
    let active = true;

    fetchLeaderWikiData(activeLeader).then((data) => {
      if (active) {
        setWikiData(data);
        setLoadingBio(false);
      }
    });

    return () => {
      active = false;
    };
  }, [activeLeader]);

  // Helper to render portrait or fallback medallion
  const renderPortraitElement = (url: string | undefined, name: string) => {
    if (!url || url.startsWith('fallback:')) {
      const initials = name
        .split(' ')
        .filter(n => !n.startsWith('Sir') && !n.startsWith('Lord') && !n.startsWith('Dr') && !n.startsWith('Chief') && !n.startsWith('General'))
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() || 'NL';
      return (
        <div className="gallery-portrait-fallback">
          <div className="fallback-circle">
            <span>{initials}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="gallery-portrait-img-wrapper">
        <img src={url} alt={name} className="gallery-portrait-img" loading="lazy" />
      </div>
    );
  };

  // 1. DETAIL VIEW: Render active leader information in full screen card
  if (activeLeader) {
    const era = ERAS[activeLeader.era];
    return (
      <div className="gallery-detail-view fade-in-up">
        {/* Header Navigation */}
        <header className="detail-header-nav">
          <button className="back-gallery-btn" onClick={onExitRoom}>
            <ArrowLeft size={16} />
            <span>Back to Exhibition Timeline</span>
          </button>
        </header>

        {/* Content Layout */}
        <div className="detail-content-grid">
          {/* Left Column: Portrait & Biography */}
          <div className="detail-left-col glass-card">
            <div className="detail-portrait-container">
              {renderPortraitElement(wikiData?.portraitUrl, activeLeader.name)}
              <div className="portrait-plate" style={{ borderLeftColor: era.color }}>
                <span className="plate-era-badge" style={{ backgroundColor: era.color + '20', color: era.color }}>
                  {era.name}
                </span>
                <h3>{activeLeader.name}</h3>
                <p className="plate-lifespan">{wikiData?.lifespan || `${activeLeader.birthYear || '?'} - ${activeLeader.deathYear || 'Present'}`}</p>
                <div className="plate-role">
                  <Landmark size={14} className="icon-gold" />
                  <span>{activeLeader.role}</span>
                </div>
              </div>
            </div>

            <hr className="detail-divider" />

            <div className="detail-biography">
              <div className="bio-section-title">
                <BookOpen size={16} className="icon-gold" />
                <h4>BIOGRAPHICAL RECORD</h4>
              </div>
              {loadingBio ? (
                <div className="gallery-bio-loader">
                  <div className="small-spinner"></div>
                  <span>Retrieving Wikipedia biography...</span>
                </div>
              ) : (
                <p className="bio-text">{wikiData?.summary}</p>
              )}
              {wikiData?.wikiUrl && (
                <a
                  href={wikiData.wikiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="external-wiki-link"
                  style={{ color: era.color }}
                >
                  <span>Read full Wikipedia profile</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Key Achievements */}
          <div className="detail-right-col glass-card">
            <div className="achievements-section-title">
              <Award size={18} className="icon-gold" />
              <h4>GOVERNANCE MILESTONES & ACHIEVEMENTS</h4>
              <span className="governance-span">TERM: {activeLeader.startYear} – {activeLeader.endYear}</span>
            </div>

            <div className="milestones-vertical-timeline">
              {activeLeader.achievements.length > 0 ? (
                activeLeader.achievements.map((ach, index) => (
                  <div key={index} className="milestone-timeline-item">
                    <div className="milestone-year-bubble" style={{ backgroundColor: era.color }}>
                      {ach.year}
                    </div>
                    <div className="milestone-info-card">
                      <h5>{ach.title}</h5>
                      <p>{ach.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-milestones">No milestones recorded for this period.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. GRID/TIMELINE VIEW: Render list of leaders
  return (
    <div className="gallery-2d-root fade-in-up">
      {/* Era Filtering Hub */}
      <section className="era-filter-section">
        <span className="section-label">FILTER HISTORY BY ERA</span>
        <div className="era-filter-buttons">
          <button
            className={`filter-btn ${selectedEra === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedEra('all')}
          >
            ALL PERIODS
          </button>
          {Object.values(ERAS).map((era) => (
            <button
              key={era.id}
              className={`filter-btn ${selectedEra === era.id ? 'active' : ''}`}
              onClick={() => setSelectedEra(era.id)}
              style={{
                borderColor: selectedEra === era.id ? era.color : 'rgba(255, 255, 255, 0.1)',
                color: selectedEra === era.id ? '#ffffff' : '#9ca3af'
              }}
            >
              <span className="era-dot-indicator" style={{ backgroundColor: era.color }}></span>
              {era.name.toUpperCase()}
            </button>
          ))}
        </div>
      </section>

      {/* Grid of Leaders */}
      <section className="leaders-grid-container scrollbar-custom">
        <div className="leaders-grid">
          {filteredLeaders.map((leader) => {
            const era = ERAS[leader.era];
            const initials = leader.name
              .split(' ')
              .filter(n => !n.startsWith('Sir') && !n.startsWith('Lord') && !n.startsWith('Dr') && !n.startsWith('Chief') && !n.startsWith('General'))
              .map(n => n[0])
              .join('')
              .substring(0, 2)
              .toUpperCase() || 'NL';

            return (
              <div
                key={leader.id}
                className="leader-gallery-card glass-card-hover"
                onClick={() => onSelectLeader(leader)}
                style={{
                  borderTop: `3px solid ${era.color}`
                }}
              >
                <div className="card-era-badge" style={{ color: era.color, backgroundColor: era.color + '15' }}>
                  {era.name.toUpperCase()}
                </div>
                <div className="card-medallion">
                  <div className="medallion-inner">
                    <span>{initials}</span>
                  </div>
                </div>
                <h4 className="card-leader-name">{leader.name}</h4>
                <p className="card-leader-role">{leader.role}</p>
                <div className="card-leader-years" style={{ color: era.color }}>
                  <Calendar size={12} />
                  <span>{leader.startYear} – {leader.endYear}</span>
                </div>
                <button className="card-explore-btn" style={{ borderColor: era.color }}>
                  VIEW BIO & ACHIEVEMENTS
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
