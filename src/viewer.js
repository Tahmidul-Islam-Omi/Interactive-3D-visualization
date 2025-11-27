// 3D rendering / scene setup
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Viewer class for managing the Three.js 3D scene
 */
export class BuildingViewer {
  constructor(containerElement) {
    this.container = containerElement;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.animationId = null;
    
    this.init();
  }

  /**
   * Initialize the Three.js scene, camera, renderer, and controls
   */
  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createLights();
    this.createControls();
    this.setupWindowResize();
  }

  /**
   * Create the Three.js scene
   */
  createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb); // Sky blue background
  }

  /**
   * Create and position the perspective camera
   */
  createCamera() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    this.camera = new THREE.PerspectiveCamera(
      75,                    // Field of view
      width / height,        // Aspect ratio
      0.1,                   // Near clipping plane
      1000                   // Far clipping plane
    );
    
    // Initial camera position (will be adjusted after building loads)
    this.camera.position.set(0, 0, 50);
    this.camera.lookAt(0, 0, 0);
  }

  /**
   * Create the WebGL renderer and attach it to the DOM
   */
  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,       // Smooth edges
      alpha: true            // Transparent background support
    });
    
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    
    this.renderer.setPixelRatio(window.devicePixelRatio);
    
    // Attach renderer to the container
    this.container.appendChild(this.renderer.domElement);
  }

  /**
   * Add ambient and directional lighting to the scene
   */
  createLights() {
    // Ambient light - provides overall illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);
    
    // Directional light - simulates sunlight
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
    
    // Additional directional light from opposite side for better visibility
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-50, 50, -50);
    this.scene.add(directionalLight2);
  }

  /**
   * Create OrbitControls for camera navigation
   */
  createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    
    // Configure controls for maximum flexibility
    this.controls.enableDamping = true;       // Smooth camera movement
    this.controls.dampingFactor = 0.08;       // Slightly more responsive
    this.controls.screenSpacePanning = true;  // Pan in screen space (more intuitive)
    this.controls.minDistance = 5;            // Closer zoom
    this.controls.maxDistance = 1000;         // Farther zoom
    this.controls.maxPolarAngle = Math.PI;    // Full 180° vertical rotation
    this.controls.minPolarAngle = 0;          // Can look straight down
    
    // Enable all rotation axes
    this.controls.enableRotate = true;
    this.controls.rotateSpeed = 1.0;
    
    // Enable panning
    this.controls.enablePan = true;
    this.controls.panSpeed = 1.0;
    
    // Enable zooming
    this.controls.enableZoom = true;
    this.controls.zoomSpeed = 1.2;
    
    // Mouse button assignments
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN
    };
  }

  /**
   * Handle window resize events
   */
  setupWindowResize() {
    window.addEventListener('resize', () => {
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      
      // Update camera aspect ratio
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      
      // Update renderer size
      this.renderer.setSize(width, height);
    });
  }

  /**
   * Start the animation loop
   */
  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    // Update controls (required for damping)
    this.controls.update();
    
    // Render the scene
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Stop the animation loop
   */
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Clean up resources
   */
  dispose() {
    this.stop();
    this.controls.dispose();
    this.renderer.dispose();
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }

  /**
   * Get color based on surface type
   * @param {string} surfaceType - Type of surface
   * @returns {number} Hex color code
   */
  getSurfaceColor(surfaceType) {
    const colorMap = {
      'ExteriorWall': 0xd4a574,    // Tan/beige
      'InteriorWall': 0xe8e8e8,    // Light gray
      'Roof': 0x8b4513,            // Brown
      'SlabOnGrade': 0x808080,     // Gray
      'Ceiling': 0xffffff,         // White
      'Floor': 0xa9a9a9,           // Dark gray
      'Shade': 0x90ee90,           // Light green
      'UndergroundWall': 0x654321  // Dark brown
    };
    
    return colorMap[surfaceType] || 0xcccccc; // Default gray
  }

  /**
   * Triangulate a polygon using earcut algorithm
   * @param {Array<{x: number, y: number, z: number}>} vertices - Polygon vertices
   * @returns {Array<number>} Indices for triangulation
   */
  triangulateSurface(vertices) {
    if (vertices.length < 3) {
      throw new Error('Surface must have at least 3 vertices');
    }
    
    // For simple quads (4 vertices), use simple triangulation
    if (vertices.length === 4) {
      return [0, 1, 2, 0, 2, 3];
    }
    
    // For more complex polygons, fan triangulation is used
    // This works for convex polygons
    const indices = [];
    for (let i = 1; i < vertices.length - 1; i++) {
      indices.push(0, i, i + 1);
    }
    
    return indices;
  }

  /**
   * Create BufferGeometry from vertices
   * @param {Array<{x: number, y: number, z: number}>} vertices - Surface vertices
   * @returns {THREE.BufferGeometry} Created geometry
   */
  createGeometryFromVertices(vertices) {
    const geometry = new THREE.BufferGeometry();
    
    // Convert vertices to flat array [x1, y1, z1, x2, y2, z2, ...]
    const positions = [];
    vertices.forEach(vertex => {
      positions.push(vertex.x, vertex.y, vertex.z);
    });
    
    // Add position attribute
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    );
    
    // Triangulate the surface
    const indices = this.triangulateSurface(vertices);
    geometry.setIndex(indices);
    
    // Compute normals for proper lighting
    geometry.computeVertexNormals();
    
    return geometry;
  }

  /**
   * Create a mesh from surface data
   * @param {Object} surface - Surface data with vertices and metadata
   * @returns {THREE.Group} Group containing mesh and optional wireframe
   */
  createSurfaceMesh(surface) {
    const group = new THREE.Group();
    
    // Create geometry
    const geometry = this.createGeometryFromVertices(surface.vertices);
    
    // Create material with color based on surface type
    const color = this.getSurfaceColor(surface.surfaceType);
    const material = new THREE.MeshPhongMaterial({
      color: color,
      side: THREE.DoubleSide,  // Render both sides
      flatShading: false,       // Smooth shading
      shininess: 30
    });
    
    // Create mesh
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = {
      surfaceId: surface.id,
      surfaceType: surface.surfaceType,
      name: surface.name,
      adjacentSpaceId: surface.adjacentSpaceId
    };
    
    group.add(mesh);
    
    // Add wireframe edges for better visibility
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x000000,
      linewidth: 1
    });
    const wireframe = new THREE.LineSegments(edges, lineMaterial);
    
    group.add(wireframe);
    
    return group;
  }

  /**
   * Calculate bounding box of all surfaces
   * @param {Array<Object>} surfaces - Array of surface objects
   * @returns {{center: {x, y, z}, size: {x, y, z}}} Bounding box info
   */
  calculateBoundingBox(surfaces) {
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

    surfaces.forEach(surface => {
      surface.vertices.forEach(vertex => {
        minX = Math.min(minX, vertex.x);
        minY = Math.min(minY, vertex.y);
        minZ = Math.min(minZ, vertex.z);
        maxX = Math.max(maxX, vertex.x);
        maxY = Math.max(maxY, vertex.y);
        maxZ = Math.max(maxZ, vertex.z);
      });
    });

    const center = {
      x: (minX + maxX) / 2,
      y: (minY + maxY) / 2,
      z: (minZ + maxZ) / 2
    };

    const size = {
      x: maxX - minX,
      y: maxY - minY,
      z: maxZ - minZ
    };

    return { center, size };
  }

  /**
   * Position camera to view the building from front
   * @param {Array<Object>} surfaces - Array of surface objects
   */
  positionCameraForBuilding(surfaces) {
    const { center, size } = this.calculateBoundingBox(surfaces);
    
    // Calculate distance based on building size
    const maxDim = Math.max(size.x, size.y, size.z);
    const distance = maxDim * 2.5;

    // Position camera in front of building (along Z axis)
    this.camera.position.set(
      center.x,
      center.y,
      center.z + distance
    );
    
    this.camera.lookAt(center.x, center.y, center.z);
    
    // Update controls target
    this.controls.target.set(center.x, center.y, center.z);
    this.controls.update();

    console.log('Camera positioned at:', this.camera.position);
    console.log('Looking at building center:', center);
  }

  /**
   * Render all surfaces from building data
   * @param {Array<Object>} surfaces - Array of surface objects
   */
  renderSurfaces(surfaces) {
    surfaces.forEach(surface => {
      try {
        const surfaceMesh = this.createSurfaceMesh(surface);
        this.scene.add(surfaceMesh);
      } catch (error) {
        console.warn(`Failed to render surface ${surface.id}:`, error.message);
      }
    });

    // Auto-position camera after rendering
    this.positionCameraForBuilding(surfaces);
  }

  /**
   * Clear all surfaces from the scene
   */
  clearSurfaces() {
    const objectsToRemove = [];
    
    this.scene.traverse((object) => {
      if (object instanceof THREE.Group && object.children.length > 0) {
        const firstChild = object.children[0];
        if (firstChild instanceof THREE.Mesh && firstChild.userData.surfaceId) {
          objectsToRemove.push(object);
        }
      }
    });
    
    objectsToRemove.forEach(object => {
      this.scene.remove(object);
      // Dispose geometries and materials
      object.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
    });
  }
}
