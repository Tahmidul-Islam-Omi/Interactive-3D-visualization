// Parsing / helper functions

/**
 * Parses XML string and returns a DOM Document
 * @param {string} xmlString - The XML content as a string
 * @returns {Document} Parsed XML document
 */
function parseXMLString(xmlString) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  
  // Check for parsing errors
  const parserError = xmlDoc.querySelector("parsererror");
  if (parserError) {
    throw new Error("XML parsing error: " + parserError.textContent);
  }
  
  return xmlDoc;
}

/**
 * Extracts coordinates from a CartesianPoint element
 * @param {Element} cartesianPoint - The CartesianPoint XML element
 * @returns {{x: number, y: number, z: number}} Object with x, y, z coordinates
 */
function extractCoordinates(cartesianPoint) {
  const coordinates = cartesianPoint.querySelectorAll("Coordinate");
  
  if (coordinates.length !== 3) {
    throw new Error("Invalid CartesianPoint: expected 3 coordinates");
  }
  
  return {
    x: parseFloat(coordinates[0].textContent),
    y: parseFloat(coordinates[1].textContent),
    z: parseFloat(coordinates[2].textContent)
  };
}

/**
 * Extracts vertices from a PlanarGeometry element
 * @param {Element} planarGeometry - The PlanarGeometry XML element
 * @returns {Array<{x: number, y: number, z: number}>} Array of vertex coordinates
 */
function extractPlanarGeometry(planarGeometry) {
  const polyLoop = planarGeometry.querySelector("PolyLoop");
  
  if (!polyLoop) {
    throw new Error("PlanarGeometry missing PolyLoop element");
  }
  
  const cartesianPoints = polyLoop.querySelectorAll("CartesianPoint");
  
  if (cartesianPoints.length < 3) {
    throw new Error("PolyLoop must contain at least 3 CartesianPoints");
  }
  
  const vertices = [];
  cartesianPoints.forEach(point => {
    vertices.push(extractCoordinates(point));
  });
  
  return vertices;
}

/**
 * Parses a Surface element and extracts relevant data
 * @param {Element} surface - The Surface XML element
 * @returns {Object} Surface data object
 */
function parseSurface(surface) {
  const id = surface.getAttribute("id");
  const surfaceType = surface.getAttribute("surfaceType");
  const exposedToSun = surface.getAttribute("exposedToSun") === "true";
  
  // Extract name
  const nameElement = surface.querySelector("Name");
  const name = nameElement ? nameElement.textContent : null;
  
  // Extract adjacent space ID
  const adjacentSpaceElement = surface.querySelector("AdjacentSpaceId");
  const adjacentSpaceId = adjacentSpaceElement 
    ? adjacentSpaceElement.getAttribute("spaceIdRef") 
    : null;
  
  // Extract PlanarGeometry
  const planarGeometry = surface.querySelector("PlanarGeometry");
  if (!planarGeometry) {
    throw new Error(`Surface ${id} missing PlanarGeometry`);
  }
  
  const vertices = extractPlanarGeometry(planarGeometry);
  
  return {
    id,
    surfaceType,
    exposedToSun,
    name,
    adjacentSpaceId,
    vertices
  };
}

/**
 * Main function to parse the building XML file
 * @param {string} xmlString - The XML content as a string
 * @returns {Object} Parsed building data with surfaces array
 */
export function parseBuildingXML(xmlString) {
  const xmlDoc = parseXMLString(xmlString);
  
  // Extract building name
  const building = xmlDoc.querySelector("Building");
  if (!building) {
    throw new Error("No Building element found in XML");
  }
  
  const buildingName = building.getAttribute("name");
  
  // Extract all surfaces
  const surfaceElements = xmlDoc.querySelectorAll("Surface");
  const surfaces = [];
  
  surfaceElements.forEach(surfaceElement => {
    try {
      const surface = parseSurface(surfaceElement);
      surfaces.push(surface);
    } catch (error) {
      console.warn(`Failed to parse surface: ${error.message}`);
    }
  });
  
  return {
    buildingName,
    surfaces
  };
}

/**
 * Loads and parses XML file from a given path
 * @param {string} filePath - Path to the XML file
 * @returns {Promise<Object>} Promise resolving to parsed building data
 */
export async function loadBuildingFromFile(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load file: ${response.statusText}`);
    }
    
    const xmlString = await response.text();
    return parseBuildingXML(xmlString);
  } catch (error) {
    console.error("Error loading building file:", error);
    throw error;
  }
}
