/**
 * Calculate shipping cost based on distance from San Pablo City using simple tiers.
 * Input is a normalized location label (e.g., 'San Pablo City', 'Quezon', 'Laguna').
 */
export const calculateShipping = (location: string): number => {
  if (!location) return 0;

  // San Pablo City approx coords
  const SAN_PABLO_LAT = 14.0663;
  const SAN_PABLO_LNG = 121.3259;

  // Representative coordinates for nearby cities/provinces (approx only)
  const coordinates: { [key: string]: { lat: number; lng: number } } = {
    'San Pablo City': { lat: 14.0663, lng: 121.3259 },
    'Laguna': { lat: 14.3110, lng: 121.1110 }, // Santa Rosa
    'Quezon': { lat: 13.9410, lng: 121.6230 }, // Lucena
    'Cavite': { lat: 14.4290, lng: 120.9360 }, // Imus
    'Batangas': { lat: 13.7560, lng: 121.0580 }, // Batangas City
    'Camarines Sur': { lat: 13.6230, lng: 123.1940 }, // Naga
    'Sorsogon': { lat: 12.9730, lng: 124.0020 }, // Sorsogon City
    'La Union': { lat: 16.6190, lng: 120.3190 }, // San Fernando
  };

  const toRad = (deg: number) => deg * (Math.PI / 180);
  const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const target = coordinates[location];
  if (!target) {
    // Unknown location: regular default
    return 200;
  }

  const distanceKm = haversineKm(SAN_PABLO_LAT, SAN_PABLO_LNG, target.lat, target.lng);

  // Tiered pricing by distance
  if (distanceKm <= 10) return 150; // within city
  if (distanceKm <= 30) return 180; // nearby
  if (distanceKm <= 60) return 220; // neighboring provinces
  if (distanceKm <= 120) return 300; // mid-distance
  return 400; // far
};

/**
 * Calculate tax (12% VAT)
 */
export const calculateTax = (subtotal: number): number => {
  return subtotal * 0.12;
};

/**
 * Calculate total including shipping and tax
 */
export const calculateTotal = (items: any[], city: string): number => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = calculateShipping(city);
  const tax = calculateTax(subtotal);
  return subtotal + shipping + tax;
};
