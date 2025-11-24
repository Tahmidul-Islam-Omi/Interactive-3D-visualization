# Building Structure Projection — Interactive 3D Viewer

## Overview
Interactive 3D visualization system for building structures. Loads building data from XML files and displays them as navigable 3D scenes using Three.js.

## Project Structure
```
project/
├── src/
│   ├── main.js          # Main application logic
│   ├── viewer.js        # 3D rendering / scene setup
│   └── utils.js         # XML parsing / helper functions
├── public/
│   └── sample_input.xml # Building data (XML)
├── tests/
│   └── parser.test.js   # Unit tests
├── index.html           # Entry HTML (root folder)
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

## Features (Task 1 Complete)
- ✅ XML parsing from `sample_input.xml`
- ✅ 3D polygon visualization with correct vertex sequences
- ✅ Interactive camera controls (rotate, zoom, pan)
- ✅ Realistic lighting (ambient + directional)
- ✅ Color-coded surface types
- ✅ Wireframe edges for better visibility

## Controls
- **Left-click + drag**: Rotate camera
- **Right-click + drag**: Pan camera
- **Scroll wheel**: Zoom in/out

## Input File Format
The XML file contains building surfaces with:
- `<Surface>` elements with `surfaceType` attributes
- `<PlanarGeometry>` containing vertex coordinates
- `<CartesianPoint>` elements defining 3D positions

## Browser Console
Open browser DevTools (F12) to see:
- Loading progress
- Building name and surface count
- Any parsing or rendering errors

## Technologies Used
- **Three.js** - 3D graphics library
- **Vite** - Development server and build tool
- **Vanilla JavaScript** - ES6 modules
- **JSDoc** - Code documentation


## Assumptions
- All surfaces in the XML are convex polygons (no concave shapes)
- Coordinates are in meters
- Y-axis is up (Three.js default)
- Building is centered around origin (0, 0, 0)
