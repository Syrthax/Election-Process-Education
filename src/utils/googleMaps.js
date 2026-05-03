// Google Maps Platform — Geocoding API + Places API (New).
// Both endpoints are CORS-friendly for browser use. Falls through to
// `null` when no key is configured so callers can fall back to OSM.

const KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const GEOCODE_ENDPOINT = 'https://maps.googleapis.com/maps/api/geocode/json';
const PLACES_NEARBY_ENDPOINT = 'https://places.googleapis.com/v1/places:searchNearby';

export function isGoogleMapsConfigured() {
  return Boolean(KEY);
}

// ---------------------------------------------------------------- Geocoding

export async function geocodeAddress(address) {
  if (!KEY) return null;
  const url = `${GEOCODE_ENDPOINT}?key=${KEY}&region=in&components=country:IN&address=${encodeURIComponent(address)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding ${res.status}`);
  const data = await res.json();
  if (data.status !== 'OK' || !data.results?.length) return null;
  const top = data.results[0];
  return {
    lat: top.geometry.location.lat,
    lng: top.geometry.location.lng,
    label: top.formatted_address,
    placeId: top.place_id,
  };
}

// ---------------------------------------------------------------- Places (New)
//
// Polling booths in India are overwhelmingly hosted in schools and
// government buildings. Searching for those types within a small radius
// gives a useful "your booth is probably one of these" list to back up
// the official ECI lookup.

const POLLING_TYPES = ['primary_school', 'secondary_school', 'school', 'university', 'city_hall', 'local_government_office'];

export async function findNearbyPollingPlaces({ lat, lng, radiusMeters = 1500, max = 10 }) {
  if (!KEY) return [];
  const body = {
    includedTypes: POLLING_TYPES,
    maxResultCount: max,
    locationRestriction: {
      circle: {
        center: { latitude: lat, longitude: lng },
        radius: radiusMeters,
      },
    },
    rankPreference: 'DISTANCE',
  };

  const res = await fetch(PLACES_NEARBY_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': KEY,
      'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.types,places.location,places.googleMapsUri',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Places ${res.status}`);
  const data = await res.json();
  return (data.places || []).map(p => ({
    name: p.displayName?.text || 'Unknown location',
    address: p.formattedAddress || '',
    types: p.types || [],
    lat: p.location?.latitude,
    lng: p.location?.longitude,
    mapsUrl: p.googleMapsUri,
  }));
}
