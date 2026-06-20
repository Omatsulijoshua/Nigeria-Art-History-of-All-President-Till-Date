# 🇳🇬 Nigeria Leadership: 3D Interactive Museum

Embark on an immersive, web-based chronological walkthrough of Nigeria's leadership history. Explore detailed biographies, key achievements, and historical milestones from the colonial governance era (1914) up to present-day democracy, rendered dynamically in real-time Caravaggio-style physical lighting environments.

## 🌟 Key Features

- **Interactive 3D Timeline**: Traversed via scroll wheel, keyboard navigation, or clicking/dragging the timeline scrubber at the bottom of the HUD.
- **Caravaggio-Style Chiaroscuro Lighting**: Atmospheric, dark museum rendering utilizing custom real-time directional and spotlighting.
- **Procedural Room Generation**: Each president's museum room is generated dynamically with custom stone walls, polished marble floors, and brass frames.
- **Wikipedia API Integration**: Real-time biographies, lifespans, and portraits fetched dynamically from Wikipedia with graceful procedural fallbacks if offline.
- **Cinematic Post-Processing**: Dynamic bloom, depth-of-field focus switching, noise grain, and chromatic aberration lens effects (configurable via graphics settings).
- **Procedural Ambient Sound**: Synthesizes a warm space drone with modulating filters using the Web Audio API.

## 🛠️ Technology Stack

- **Core**: React 19, TypeScript, Vite
- **3D Graphics**: Three.js, React Three Fiber (R3F), `@react-three/drei`
- **Effects**: `@react-three/postprocessing`
- **Icons**: Lucide React
- **Audio**: Web Audio API (procedural oscillator synthesizer)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Omatsulijoshua/Nigeria-Art-History-of-All-President-Till-Date.git
   cd Nigeria-Art-History-of-All-President-Till-Date
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

### Controls

- **Mouse Wheel / Scrubber**: Traverse the timeline back and forth.
- **Arrow Keys (Left/Right) / A & D**: Move left and right on the timeline.
- **Click on Medallion**: Enter the President's Museum Room.
- **OrbitControls (Click & Drag in Room)**: Look around the gallery room (view details, frame, lighting).
- **ESC Key**: Open the settings panel/pause menu.
