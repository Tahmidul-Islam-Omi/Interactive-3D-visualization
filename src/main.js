// Main application logic
import { loadBuildingFromFile } from './utils.js';
import { BuildingViewer } from './viewer.js';

/**
 * Application class to manage the 3D building visualization
 */
class BuildingVisualizationApp {
  constructor() {
    this.viewer = null;
    this.buildingData = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      console.log('Initializing Building Visualization...');
      
      // Get the canvas container
      const container = document.getElementById('canvas-container');
      if (!container) {
        throw new Error('Canvas container not found');
      }
      
      // Create the 3D viewer
      this.viewer = new BuildingViewer(container);
      console.log('3D Viewer created successfully');
      
      // Load and parse the building XML file
      await this.loadBuilding('/sample_input.xml');
      
      // Start the animation loop
      this.viewer.animate();
      console.log('Animation started');
      
      this.isInitialized = true;
      console.log('Application initialized successfully');
      
    } catch (error) {
      console.error('Failed to initialize application:', error);
      this.showError(error.message);
    }
  }

  /**
   * Load building data from XML file
   * @param {string} filePath - Path to the XML file
   */
  async loadBuilding(filePath) {
    try {
      console.log(`Loading building from: ${filePath}`);
      
      // Parse the XML file
      this.buildingData = await loadBuildingFromFile(filePath);
      
      console.log(`Building loaded: ${this.buildingData.buildingName}`);
      console.log(`Total surfaces: ${this.buildingData.surfaces.length}`);
      
      // Render all surfaces
      this.viewer.renderSurfaces(this.buildingData.surfaces);
      
      console.log('All surfaces rendered successfully');
      
    } catch (error) {
      console.error('Failed to load building:', error);
      throw error;
    }
  }

  /**
   * Reload building with a different file
   * @param {string} filePath - Path to the new XML file
   */
  async reloadBuilding(filePath) {
    if (!this.viewer) {
      throw new Error('Viewer not initialized');
    }
    
    // Clear existing surfaces
    this.viewer.clearSurfaces();
    
    // Load new building
    await this.loadBuilding(filePath);
  }

  /**
   * Display error message to user
   * @param {string} message - Error message
   */
  showError(message) {
    const container = document.getElementById('canvas-container');
    if (container) {
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 0, 0, 0.9);
        color: white;
        padding: 20px;
        border-radius: 8px;
        font-family: Arial, sans-serif;
        max-width: 400px;
        text-align: center;
        z-index: 1000;
      `;
      errorDiv.innerHTML = `
        <h3>Error</h3>
        <p>${message}</p>
        <p style="font-size: 12px; margin-top: 10px;">
          Check the console for more details.
        </p>
      `;
      container.appendChild(errorDiv);
    }
  }

  /**
   * Clean up resources
   */
  dispose() {
    if (this.viewer) {
      this.viewer.dispose();
      this.viewer = null;
    }
    this.buildingData = null;
    this.isInitialized = false;
  }
}

/**
 * Initialize the application when DOM is ready
 */
function startApplication() {
  const app = new BuildingVisualizationApp();
  app.init();
  
  // Make app globally accessible for debugging
  window.buildingApp = app;
}

// Start the application when DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApplication);
} else {
  // DOM already loaded
  startApplication();
}
