'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const MuseumApp = dynamic(() => import('../src/App'), {
  ssr: false,
  loading: () => (
    <div className="landing-screen" style={{ background: '#030303', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw' }}>
      <div className="landing-card" style={{ padding: '40px', textAlign: 'center', background: 'rgba(10, 10, 12, 0.7)', border: '1px solid rgba(212, 175, 55, 0.15)', borderRadius: '8px' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', color: '#d4af37', marginBottom: '10px' }}>Loading Museum Engine</h2>
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>Initializing real-time 3D historical environment...</p>
      </div>
    </div>
  )
});

export default function AppWrapper() {
  return <MuseumApp />;
}
