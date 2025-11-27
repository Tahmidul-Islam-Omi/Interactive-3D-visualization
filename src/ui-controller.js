// UI Controller for managing control panel interactions

/**
 * UIController class manages the control panel and user interactions
 */
export class UIController {
  constructor() {
    this.surfaceSelect = null;
    this.spaceSelect = null;
    this.resetButton = null;
    this.eventHandlers = {
      onSurfaceSelect: null,
      onSpaceSelect: null,
      onReset: null
    };
  }

  /**
   * Initialize UI elements and event listeners
   */
  init() {
    this.surfaceSelect = document.getElementById('surface-select');
    this.spaceSelect = document.getElementById('space-select');
    this.resetButton = document.getElementById('reset-button');

    if (!this.surfaceSelect || !this.spaceSelect || !this.resetButton) {
      console.error('UI elements not found');
      return false;
    }

    this.setupEventListeners();
    return true;
  }

  /**
   * Set up event listeners for UI controls
   */
  setupEventListeners() {
    // Surface dropdown change event
    this.surfaceSelect.addEventListener('change', (event) => {
      const surfaceId = event.target.value;
      if (this.eventHandlers.onSurfaceSelect) {
        this.eventHandlers.onSurfaceSelect(surfaceId);
      }
    });

    // Space dropdown change event
    this.spaceSelect.addEventListener('change', (event) => {
      const spaceId = event.target.value;
      if (this.eventHandlers.onSpaceSelect) {
        this.eventHandlers.onSpaceSelect(spaceId);
      }
    });

    // Reset button click event
    this.resetButton.addEventListener('click', () => {
      if (this.eventHandlers.onReset) {
        this.eventHandlers.onReset();
      }
    });
  }

  /**
   * Populate surface dropdown with building surfaces
   * @param {Array<Object>} surfaces - Array of surface objects
   */
  populateSurfaceDropdown(surfaces) {
    // Clear existing options except the first one
    this.surfaceSelect.innerHTML = '<option value="">-- Select a surface --</option>';

    surfaces.forEach(surface => {
      const option = document.createElement('option');
      option.value = surface.id;
      
      // Create descriptive text: "Name (Type)" or "ID (Type)" if no name
      const displayName = surface.name || surface.id;
      option.textContent = `${displayName} (${surface.surfaceType})`;
      
      this.surfaceSelect.appendChild(option);
    });

    console.log(`Populated surface dropdown with ${surfaces.length} surfaces`);
  }

  /**
   * Populate space dropdown with unique spaces
   * @param {Array<string>} spaceIds - Array of unique space IDs
   */
  populateSpaceDropdown(spaceIds) {
    // Clear existing options except the first one
    this.spaceSelect.innerHTML = '<option value="">-- Select a space --</option>';

    spaceIds.forEach(spaceId => {
      const option = document.createElement('option');
      option.value = spaceId;
      option.textContent = `Space: ${spaceId}`;
      
      this.spaceSelect.appendChild(option);
    });

    console.log(`Populated space dropdown with ${spaceIds.length} spaces`);
  }

  /**
   * Extract unique space IDs from surfaces
   * @param {Array<Object>} surfaces - Array of surface objects
   * @returns {Array<string>} Array of unique space IDs
   */
  extractUniqueSpaces(surfaces) {
    const spaceIds = new Set();

    surfaces.forEach(surface => {
      if (surface.adjacentSpaceId) {
        spaceIds.add(surface.adjacentSpaceId);
      }
    });

    return Array.from(spaceIds).sort();
  }

  /**
   * Register callback for surface selection
   * @param {Function} callback - Function to call when surface is selected
   */
  onSurfaceSelect(callback) {
    this.eventHandlers.onSurfaceSelect = callback;
  }

  /**
   * Register callback for space selection
   * @param {Function} callback - Function to call when space is selected
   */
  onSpaceSelect(callback) {
    this.eventHandlers.onSpaceSelect = callback;
  }

  /**
   * Register callback for reset button
   * @param {Function} callback - Function to call when reset is clicked
   */
  onReset(callback) {
    this.eventHandlers.onReset = callback;
  }

  /**
   * Reset all dropdowns to default state
   */
  resetSelections() {
    this.surfaceSelect.value = '';
    this.spaceSelect.value = '';
  }

  /**
   * Get currently selected surface ID
   * @returns {string} Selected surface ID or empty string
   */
  getSelectedSurface() {
    return this.surfaceSelect.value;
  }

  /**
   * Get currently selected space ID
   * @returns {string} Selected space ID or empty string
   */
  getSelectedSpace() {
    return this.spaceSelect.value;
  }

  /**
   * Set selected surface programmatically
   * @param {string} surfaceId - Surface ID to select
   */
  setSelectedSurface(surfaceId) {
    this.surfaceSelect.value = surfaceId;
  }

  /**
   * Set selected space programmatically
   * @param {string} spaceId - Space ID to select
   */
  setSelectedSpace(spaceId) {
    this.spaceSelect.value = spaceId;
  }

  /**
   * Enable or disable UI controls
   * @param {boolean} enabled - Whether controls should be enabled
   */
  setEnabled(enabled) {
    this.surfaceSelect.disabled = !enabled;
    this.spaceSelect.disabled = !enabled;
    this.resetButton.disabled = !enabled;
  }
}
