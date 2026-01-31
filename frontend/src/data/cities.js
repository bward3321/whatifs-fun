// 100 Most Popular World Cities with coordinates
export const worldCities = [
  // North America
  { name: "New York", country: "USA", lat: 40.7128, lng: -74.006, population: 8336817 },
  { name: "Los Angeles", country: "USA", lat: 34.0522, lng: -118.2437, population: 3979576 },
  { name: "Chicago", country: "USA", lat: 41.8781, lng: -87.6298, population: 2693976 },
  { name: "Houston", country: "USA", lat: 29.7604, lng: -95.3698, population: 2320268 },
  { name: "Phoenix", country: "USA", lat: 33.4484, lng: -112.074, population: 1680992 },
  { name: "San Francisco", country: "USA", lat: 37.7749, lng: -122.4194, population: 881549 },
  { name: "Washington D.C.", country: "USA", lat: 38.9072, lng: -77.0369, population: 689545 },
  { name: "Miami", country: "USA", lat: 25.7617, lng: -80.1918, population: 467963 },
  { name: "Seattle", country: "USA", lat: 47.6062, lng: -122.3321, population: 737015 },
  { name: "Denver", country: "USA", lat: 39.7392, lng: -104.9903, population: 727211 },
  { name: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832, population: 2731571 },
  { name: "Vancouver", country: "Canada", lat: 49.2827, lng: -123.1207, population: 631486 },
  { name: "Mexico City", country: "Mexico", lat: 19.4326, lng: -99.1332, population: 8918653 },
  
  // Europe
  { name: "London", country: "UK", lat: 51.5074, lng: -0.1278, population: 8982000 },
  { name: "Paris", country: "France", lat: 48.8566, lng: 2.3522, population: 2161000 },
  { name: "Berlin", country: "Germany", lat: 52.52, lng: 13.405, population: 3644826 },
  { name: "Madrid", country: "Spain", lat: 40.4168, lng: -3.7038, population: 3223334 },
  { name: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964, population: 2872800 },
  { name: "Amsterdam", country: "Netherlands", lat: 52.3676, lng: 4.9041, population: 872680 },
  { name: "Vienna", country: "Austria", lat: 48.2082, lng: 16.3738, population: 1897491 },
  { name: "Prague", country: "Czech Republic", lat: 50.0755, lng: 14.4378, population: 1309000 },
  { name: "Warsaw", country: "Poland", lat: 52.2297, lng: 21.0122, population: 1790658 },
  { name: "Stockholm", country: "Sweden", lat: 59.3293, lng: 18.0686, population: 975904 },
  { name: "Copenhagen", country: "Denmark", lat: 55.6761, lng: 12.5683, population: 794128 },
  { name: "Oslo", country: "Norway", lat: 59.9139, lng: 10.7522, population: 693494 },
  { name: "Helsinki", country: "Finland", lat: 60.1699, lng: 24.9384, population: 656229 },
  { name: "Brussels", country: "Belgium", lat: 50.8503, lng: 4.3517, population: 1209000 },
  { name: "Zurich", country: "Switzerland", lat: 47.3769, lng: 8.5417, population: 434335 },
  { name: "Munich", country: "Germany", lat: 48.1351, lng: 11.582, population: 1471508 },
  { name: "Barcelona", country: "Spain", lat: 41.3851, lng: 2.1734, population: 1620343 },
  { name: "Lisbon", country: "Portugal", lat: 38.7223, lng: -9.1393, population: 505526 },
  { name: "Athens", country: "Greece", lat: 37.9838, lng: 23.7275, population: 664046 },
  { name: "Dublin", country: "Ireland", lat: 53.3498, lng: -6.2603, population: 544107 },
  
  // Asia
  { name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, population: 13960000 },
  { name: "Beijing", country: "China", lat: 39.9042, lng: 116.4074, population: 21540000 },
  { name: "Shanghai", country: "China", lat: 31.2304, lng: 121.4737, population: 24870000 },
  { name: "Hong Kong", country: "China", lat: 22.3193, lng: 114.1694, population: 7496981 },
  { name: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198, population: 5850342 },
  { name: "Seoul", country: "South Korea", lat: 37.5665, lng: 126.978, population: 9776000 },
  { name: "Mumbai", country: "India", lat: 19.076, lng: 72.8777, population: 12442373 },
  { name: "Delhi", country: "India", lat: 28.7041, lng: 77.1025, population: 16787941 },
  { name: "Bangalore", country: "India", lat: 12.9716, lng: 77.5946, population: 8443675 },
  { name: "Bangkok", country: "Thailand", lat: 13.7563, lng: 100.5018, population: 8305218 },
  { name: "Jakarta", country: "Indonesia", lat: -6.2088, lng: 106.8456, population: 10562088 },
  { name: "Manila", country: "Philippines", lat: 14.5995, lng: 120.9842, population: 1780148 },
  { name: "Kuala Lumpur", country: "Malaysia", lat: 3.139, lng: 101.6869, population: 1768000 },
  { name: "Ho Chi Minh City", country: "Vietnam", lat: 10.8231, lng: 106.6297, population: 8993082 },
  { name: "Taipei", country: "Taiwan", lat: 25.033, lng: 121.5654, population: 2646204 },
  { name: "Osaka", country: "Japan", lat: 34.6937, lng: 135.5023, population: 2750000 },
  { name: "Hanoi", country: "Vietnam", lat: 21.0285, lng: 105.8542, population: 8053663 },
  { name: "Shenzhen", country: "China", lat: 22.5431, lng: 114.0579, population: 12528300 },
  { name: "Guangzhou", country: "China", lat: 23.1291, lng: 113.2644, population: 14904400 },
  
  // Middle East
  { name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708, population: 3331420 },
  { name: "Tel Aviv", country: "Israel", lat: 32.0853, lng: 34.7818, population: 460613 },
  { name: "Istanbul", country: "Turkey", lat: 41.0082, lng: 28.9784, population: 15462452 },
  { name: "Riyadh", country: "Saudi Arabia", lat: 24.7136, lng: 46.6753, population: 7676654 },
  { name: "Tehran", country: "Iran", lat: 35.6892, lng: 51.389, population: 8693706 },
  { name: "Doha", country: "Qatar", lat: 25.2854, lng: 51.531, population: 1186023 },
  { name: "Abu Dhabi", country: "UAE", lat: 24.4539, lng: 54.3773, population: 1483000 },
  { name: "Kuwait City", country: "Kuwait", lat: 29.3759, lng: 47.9774, population: 2989000 },
  { name: "Beirut", country: "Lebanon", lat: 33.8938, lng: 35.5018, population: 2424000 },
  { name: "Jerusalem", country: "Israel", lat: 31.7683, lng: 35.2137, population: 936425 },
  
  // Africa
  { name: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357, population: 20901000 },
  { name: "Lagos", country: "Nigeria", lat: 6.5244, lng: 3.3792, population: 14862000 },
  { name: "Johannesburg", country: "South Africa", lat: -26.2041, lng: 28.0473, population: 5635127 },
  { name: "Cape Town", country: "South Africa", lat: -33.9249, lng: 18.4241, population: 4617560 },
  { name: "Nairobi", country: "Kenya", lat: -1.2921, lng: 36.8219, population: 4397073 },
  { name: "Casablanca", country: "Morocco", lat: 33.5731, lng: -7.5898, population: 3359818 },
  { name: "Addis Ababa", country: "Ethiopia", lat: 9.0054, lng: 38.7636, population: 4794000 },
  { name: "Accra", country: "Ghana", lat: 5.6037, lng: -0.187, population: 2291352 },
  { name: "Algiers", country: "Algeria", lat: 36.7538, lng: 3.0588, population: 3415811 },
  { name: "Tunis", country: "Tunisia", lat: 36.8065, lng: 10.1815, population: 2365000 },
  
  // South America
  { name: "São Paulo", country: "Brazil", lat: -23.5505, lng: -46.6333, population: 12325232 },
  { name: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lng: -43.1729, population: 6747815 },
  { name: "Buenos Aires", country: "Argentina", lat: -34.6037, lng: -58.3816, population: 3075646 },
  { name: "Lima", country: "Peru", lat: -12.0464, lng: -77.0428, population: 9751717 },
  { name: "Bogotá", country: "Colombia", lat: 4.711, lng: -74.0721, population: 7412566 },
  { name: "Santiago", country: "Chile", lat: -33.4489, lng: -70.6693, population: 6158080 },
  { name: "Caracas", country: "Venezuela", lat: 10.4806, lng: -66.9036, population: 2082000 },
  { name: "Medellín", country: "Colombia", lat: 6.2476, lng: -75.5658, population: 2569007 },
  { name: "Quito", country: "Ecuador", lat: -0.1807, lng: -78.4678, population: 1978376 },
  { name: "Montevideo", country: "Uruguay", lat: -34.9011, lng: -56.1645, population: 1319108 },
  
  // Oceania
  { name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, population: 5312163 },
  { name: "Melbourne", country: "Australia", lat: -37.8136, lng: 144.9631, population: 5078193 },
  { name: "Brisbane", country: "Australia", lat: -27.4698, lng: 153.0251, population: 2514184 },
  { name: "Perth", country: "Australia", lat: -31.9505, lng: 115.8605, population: 2085973 },
  { name: "Auckland", country: "New Zealand", lat: -36.8485, lng: 174.7633, population: 1657200 },
  { name: "Wellington", country: "New Zealand", lat: -41.2865, lng: 174.7762, population: 215400 },
  
  // Russia & Eastern Europe
  { name: "Moscow", country: "Russia", lat: 55.7558, lng: 37.6173, population: 12615882 },
  { name: "St. Petersburg", country: "Russia", lat: 59.9311, lng: 30.3609, population: 5383890 },
  { name: "Kyiv", country: "Ukraine", lat: 50.4501, lng: 30.5234, population: 2962180 },
  { name: "Bucharest", country: "Romania", lat: 44.4268, lng: 26.1025, population: 1883425 },
  { name: "Budapest", country: "Hungary", lat: 47.4979, lng: 19.0402, population: 1756000 },
  { name: "Sofia", country: "Bulgaria", lat: 42.6977, lng: 23.3219, population: 1286383 },
  { name: "Belgrade", country: "Serbia", lat: 44.7866, lng: 20.4489, population: 1166763 },
  
  // Strategic/Military Significant
  { name: "Pyongyang", country: "North Korea", lat: 39.0392, lng: 125.7625, population: 3255388 },
  { name: "Vladivostok", country: "Russia", lat: 43.1332, lng: 131.9113, population: 605049 },
  { name: "Sevastopol", country: "Crimea", lat: 44.6166, lng: 33.5254, population: 509992 },
];

// Nuclear warhead options with historical and modern yields
export const nuclearWarheads = [
  {
    id: "little-boy",
    name: "Little Boy",
    yield: 15,
    unit: "kt",
    description: "Hiroshima bomb (1945)",
    type: "historical",
    blastRadius: { fireball: 0.2, severe: 1.2, moderate: 2.4, light: 4.8 }
  },
  {
    id: "fat-man",
    name: "Fat Man",
    yield: 21,
    unit: "kt",
    description: "Nagasaki bomb (1945)",
    type: "historical",
    blastRadius: { fireball: 0.25, severe: 1.4, moderate: 2.8, light: 5.6 }
  },
  {
    id: "w76",
    name: "W76-1",
    yield: 100,
    unit: "kt",
    description: "US Trident II SLBM warhead",
    type: "modern",
    blastRadius: { fireball: 0.4, severe: 2.8, moderate: 5.2, light: 10.4 }
  },
  {
    id: "w87",
    name: "W87-1",
    yield: 475,
    unit: "kt",
    description: "US Minuteman III ICBM warhead",
    type: "modern",
    blastRadius: { fireball: 0.7, severe: 5.2, moderate: 9.8, light: 19.6 }
  },
  {
    id: "b83",
    name: "B83",
    yield: 1200,
    unit: "kt",
    description: "US largest active warhead",
    type: "modern",
    blastRadius: { fireball: 1.0, severe: 7.4, moderate: 14.0, light: 28.0 }
  },
  {
    id: "tsar-bomba",
    name: "Tsar Bomba",
    yield: 50000,
    unit: "kt",
    description: "Largest ever detonated (1961)",
    type: "historical",
    blastRadius: { fireball: 4.6, severe: 35, moderate: 65, light: 130 }
  },
  {
    id: "rs28-sarmat",
    name: "RS-28 Sarmat",
    yield: 800,
    unit: "kt",
    description: "Russian ICBM (per warhead)",
    type: "modern",
    blastRadius: { fireball: 0.85, severe: 6.2, moderate: 11.8, light: 23.6 }
  },
  {
    id: "df-41",
    name: "DF-41",
    yield: 350,
    unit: "kt",
    description: "Chinese ICBM (per warhead)",
    type: "modern",
    blastRadius: { fireball: 0.6, severe: 4.5, moderate: 8.5, light: 17.0 }
  }
];

// Calculate flight time based on distance (simplified model)
export const calculateFlightTime = (distanceKm, missileType = "icbm") => {
  // ICBM average speed ~7 km/s (25,200 km/h)
  // Cruise missile ~0.25 km/s (900 km/h)
  const speed = missileType === "icbm" ? 7 : 0.25;
  return distanceKm / speed; // Returns time in seconds
};

// Calculate distance between two points using Haversine formula
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Estimate casualties based on yield and population density
export const estimateCasualties = (warhead, targetCity) => {
  const { blastRadius } = warhead;
  const population = targetCity.population;
  
  // Simplified casualty model based on blast zones
  const fireballDeaths = Math.round(population * 0.001 * (blastRadius.fireball / 5));
  const severeDeaths = Math.round(population * 0.15 * (blastRadius.severe / 10));
  const moderateInjuries = Math.round(population * 0.25 * (blastRadius.moderate / 15));
  const lightInjuries = Math.round(population * 0.10 * (blastRadius.light / 30));
  
  return {
    immediate: fireballDeaths + severeDeaths,
    injured: moderateInjuries + lightInjuries,
    total: fireballDeaths + severeDeaths + moderateInjuries + lightInjuries,
    areaAffected: Math.PI * Math.pow(blastRadius.light, 2)
  };
};
