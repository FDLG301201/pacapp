/**
 * Google Maps constants for the Dominican Republic
 * All coordinates use WGS84 (standard lat/lng format)
 */

// Center of the Dominican Republic
export const DR_CENTER = {
  lat: 18.7357,
  lng: -70.1627,
}

// Default zoom level showing the entire country
export const DR_DEFAULT_ZOOM = 8

// Bounding box of the Dominican Republic
// Used to bias Places Autocomplete and location searches to DR
export const DR_BOUNDS = {
  north: 19.93,
  south: 17.46,
  east: -68.32,
  west: -72.01,
}

// Zoom levels for different contexts
export const MAP_ZOOM_LEVELS = {
  // Entire country view
  COUNTRY: 8,
  // City level
  CITY: 12,
  // Street level (for detail pages, location picker)
  STREET: 14,
  // Close-up (for focused mini maps)
  CLOSE: 16,
} as const
