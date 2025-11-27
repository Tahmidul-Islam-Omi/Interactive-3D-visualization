# Building Structure Projection — Interactive 3D Viewer

## Overview
Interactive 3D visualization system for building structures. Loads building data from XML files and displays them as navigable 3D scenes using Three.js.

## Project Structure
```
project/
├── src/
│   ├── main.js          # Main application logic & orchestration
│   ├── viewer.js        # 3D rendering, raycasting, highlighting
│   ├── utils.js         # XML parsing / helper functions
│   └── ui-controller.js # UI controls management
├── public/
│   └── sample_input.xml # Building data (XML)
├── tests/
│   └── parser.test.js   # Unit tests (to be implemented)
├── index.html           # Entry HTML with control panel
├── package.json
├── .gitignore
└── README.md
```

## How to Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npx vite
```

### 3. Open in Browser
Navigate to the URL shown in the terminal (typically `http://localhost:5173` for Vite)

## Features

- XML parsing from `sample_input.xml`
- 3D polygon visualization with correct vertex sequences
- Interactive camera controls (rotate, zoom, pan)
- Realistic lighting (ambient + directional)
- Color-coded surface types
- Wireframe edges for better visibility
- Surface selection dropdown (lists all surfaces)
- Click-to-select surfaces in 3D view (raycasting)
- Surface highlighting (orange with glow effect)
- Space filtering dropdown (filter by room/space)
- Automatic surface filtering by space
- Reset view button (restore initial state)

## Controls

### Camera Controls
- **Left-click + drag**: Rotate camera around building
- **Right-click + drag**: Pan camera (move view)
- **Scroll wheel**: Zoom in/out

### Interactive Controls
- **Click on surface**: Highlight/unhighlight surface
- **Surface dropdown**: Select surface to highlight
- **Space dropdown**: Filter surfaces by space
- **Reset View button**: Show all surfaces, clear highlights, reset camera

## Input File Format
The XML file contains building surfaces with:
- `<Surface>` elements with `surfaceType` attributes
- `<PlanarGeometry>` containing vertex coordinates
- `<CartesianPoint>` elements defining 3D positions


## Technologies Used
- **Three.js** - 3D graphics library
- **OrbitControls** - Camera navigation
- **Raycaster** - Click detection in 3D space
- **Vite** - Development server and build tool
- **Vanilla JavaScript** - ES6 modules
- **JSDoc** - Code documentation
