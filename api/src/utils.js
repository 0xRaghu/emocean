/**
 * Emocean Utilities
 * Pure functions for username generation, location resolution, content moderation, etc.
 */

// ─── Username Generator ───────────────────────────────────────────────
export const ADJECTIVES = [
  'Sleepy', 'Caffeinated', 'Grumpy', 'Zen', 'Pixelated', 'Cosmic',
  'Fuzzy', 'Glitchy', 'Rusty', 'Neon', 'Midnight', 'Wandering',
  'Silent', 'Electric', 'Foggy', 'Restless', 'Drifting', 'Bouncy',
  'Wobbly', 'Cryptic', 'Mellow', 'Fizzy', 'Stormy', 'Lunar',
  'Solar', 'Velvet', 'Turbo', 'Dusty', 'Frosty', 'Blazing',
  'Chill', 'Hasty', 'Lazy', 'Jolly', 'Witty', 'Quirky',
  'Sneaky', 'Brave', 'Dizzy', 'Lucky', 'Spicy', 'Tangled',
  'Bubbly', 'Cloudy', 'Toasty', 'Wired', 'Analog', 'Binary',
  'Stealth', 'Chaotic'
];

export const CREATURES = [
  'Octopus', 'Starfish', 'Narwhal', 'Jellyfish', 'Seahorse', 'Dolphin',
  'Turtle', 'Penguin', 'Whale', 'Pufferfish', 'Crab', 'Lobster',
  'Otter', 'Seal', 'Squid', 'Shrimp', 'Clownfish', 'Swordfish',
  'Manatee', 'Walrus', 'Pelican', 'Stingray', 'Urchin', 'Coral',
  'Anglerfish', 'Barracuda', 'Manta', 'Marlin', 'Oyster', 'Nautilus',
  'Axolotl', 'Blowfish', 'Capybara', 'Dugong', 'Flounder', 'Grouper',
  'Herring', 'Isopod', 'Krill', 'Lamprey', 'Moray', 'Nudibranch',
  'Plankton', 'Remora', 'Sailfish', 'Tuna', 'Viperfish', 'Anchovy',
  'Beluga', 'Cuttlefish'
];

// ─── Timezone → Location Mapping ──────────────────────────────────────
export const TIMEZONE_LOCATIONS = {
  // Americas
  'America/': 'Somewhere in the Americas',
  'US/': 'Somewhere in the Americas',
  'Canada/': 'Somewhere in the Americas',
  'Pacific/Honolulu': 'Somewhere near Hawaii',
  'America/New_York': 'Somewhere on the US East Coast',
  'America/Chicago': 'Somewhere in the US Midwest',
  'America/Denver': 'Somewhere in the US Mountain region',
  'America/Los_Angeles': 'Somewhere on the US West Coast',
  'America/Toronto': 'Somewhere in Eastern Canada',
  'America/Vancouver': 'Somewhere in Western Canada',
  'America/Mexico_City': 'Somewhere in Mexico',
  'America/Sao_Paulo': 'Somewhere in Brazil',
  'America/Argentina/Buenos_Aires': 'Somewhere in South America',
  'America/Bogota': 'Somewhere in South America',
  'America/Santiago': 'Somewhere in South America',
  // Europe
  'Europe/London': 'Somewhere in the UK',
  'Europe/Paris': 'Somewhere in Western Europe',
  'Europe/Berlin': 'Somewhere in Central Europe',
  'Europe/Madrid': 'Somewhere in Southern Europe',
  'Europe/Rome': 'Somewhere in Southern Europe',
  'Europe/Amsterdam': 'Somewhere in Western Europe',
  'Europe/Stockholm': 'Somewhere in Scandinavia',
  'Europe/Oslo': 'Somewhere in Scandinavia',
  'Europe/Helsinki': 'Somewhere in Northern Europe',
  'Europe/Moscow': 'Somewhere in Russia',
  'Europe/Istanbul': 'Somewhere near Turkey',
  'Europe/Warsaw': 'Somewhere in Eastern Europe',
  'Europe/Bucharest': 'Somewhere in Eastern Europe',
  'Europe/Athens': 'Somewhere in Southern Europe',
  'Europe/Lisbon': 'Somewhere in Western Europe',
  'Europe/Dublin': 'Somewhere in Ireland',
  'Europe/Zurich': 'Somewhere in Central Europe',
  'Europe/Vienna': 'Somewhere in Central Europe',
  'Europe/Prague': 'Somewhere in Central Europe',
  'Europe/': 'Somewhere in Europe',
  // Asia
  'Asia/Tokyo': 'Somewhere near Japan',
  'Asia/Seoul': 'Somewhere near Korea',
  'Asia/Shanghai': 'Somewhere in East Asia',
  'Asia/Hong_Kong': 'Somewhere in East Asia',
  'Asia/Taipei': 'Somewhere in East Asia',
  'Asia/Singapore': 'Somewhere in Southeast Asia',
  'Asia/Bangkok': 'Somewhere in Southeast Asia',
  'Asia/Jakarta': 'Somewhere in Southeast Asia',
  'Asia/Manila': 'Somewhere in Southeast Asia',
  'Asia/Ho_Chi_Minh': 'Somewhere in Southeast Asia',
  'Asia/Kolkata': 'Somewhere in South Asia',
  'Asia/Colombo': 'Somewhere in South Asia',
  'Asia/Dhaka': 'Somewhere in South Asia',
  'Asia/Karachi': 'Somewhere in South Asia',
  'Asia/Dubai': 'Somewhere in the Middle East',
  'Asia/Riyadh': 'Somewhere in the Middle East',
  'Asia/Tehran': 'Somewhere in the Middle East',
  'Asia/Jerusalem': 'Somewhere in the Middle East',
  'Asia/Tbilisi': 'Somewhere in the Caucasus',
  'Asia/Almaty': 'Somewhere in Central Asia',
  'Asia/Tashkent': 'Somewhere in Central Asia',
  'Asia/': 'Somewhere in Asia',
  // Oceania
  'Australia/Sydney': 'Somewhere in Australia',
  'Australia/Melbourne': 'Somewhere in Australia',
  'Australia/Perth': 'Somewhere in Western Australia',
  'Australia/Brisbane': 'Somewhere in Australia',
  'Australia/': 'Somewhere in Australia',
  'Pacific/Auckland': 'Somewhere in New Zealand',
  'Pacific/Fiji': 'Somewhere in the Pacific Islands',
  'Pacific/': 'Somewhere in the Pacific',
  // Africa
  'Africa/Cairo': 'Somewhere in North Africa',
  'Africa/Lagos': 'Somewhere in West Africa',
  'Africa/Nairobi': 'Somewhere in East Africa',
  'Africa/Johannesburg': 'Somewhere in Southern Africa',
  'Africa/Casablanca': 'Somewhere in North Africa',
  'Africa/': 'Somewhere in Africa',
  // Other
  'Indian/': 'Somewhere near the Indian Ocean',
  'Atlantic/': 'Somewhere near the Atlantic',
};

export const VALID_TAGS = ['win', 'struggle', 'idea', 'rant', 'gratitude', 'late-night'];

// Block URLs to prevent spam/ads
export const URL_PATTERN = /(https?:\/\/|www\.|\.com\b|\.io\b|\.xyz\b|\.ai\b|\.dev\b|\.net\b|\.org\b|bit\.ly|t\.co)/i;

// Basic profanity blocklist
export const BLOCKLIST = [
  'fuck', 'shit', 'asshole', 'bitch', 'cunt', 'dick', 'pussy',
  'nigger', 'faggot', 'retard', 'kys', 'kill yourself'
];

// ─── Functions ────────────────────────────────────────────────────────

export function resolveLocation(timezone) {
  if (!timezone) return 'Somewhere on Earth';
  if (TIMEZONE_LOCATIONS[timezone]) return TIMEZONE_LOCATIONS[timezone];
  const prefixes = Object.keys(TIMEZONE_LOCATIONS).filter(k => k.endsWith('/'));
  prefixes.sort((a, b) => b.length - a.length);
  for (const prefix of prefixes) {
    if (timezone.startsWith(prefix)) return TIMEZONE_LOCATIONS[prefix];
  }
  return 'Somewhere on Earth';
}

export async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function hashToIndex(hash, max) {
  return parseInt(hash.substring(0, 8), 16) % max;
}

export function generateUsername(hash) {
  const adj = ADJECTIVES[hashToIndex(hash, ADJECTIVES.length)];
  const creature = CREATURES[hashToIndex(hash.substring(8), CREATURES.length)];
  const num = (parseInt(hash.substring(16, 20), 16) % 900) + 100;
  return `${adj}${creature}${num}`;
}

export function generateAvatarSeed(hash) {
  return hash.substring(0, 12);
}

export function generateId() {
  return crypto.randomUUID();
}

export function containsBlockedContent(message) {
  // Check for URLs
  if (URL_PATTERN.test(message)) {
    return { blocked: true, reason: 'URLs are not allowed. Keep it personal.' };
  }

  // Check for profanity
  const lowerMsg = message.toLowerCase();
  for (const word of BLOCKLIST) {
    if (lowerMsg.includes(word)) {
      return { blocked: true, reason: 'Keep it kind. This is a campfire, not a battlefield.' };
    }
  }

  return { blocked: false };
}

export function validateTag(tag) {
  if (!tag || tag === '') return { valid: true, cleanTag: null };
  const cleanTag = typeof tag === 'string' ? tag.replace('#', '').toLowerCase().trim() : null;
  if (cleanTag && !VALID_TAGS.includes(cleanTag)) {
    return { valid: false, error: `Invalid tag. Use one of: ${VALID_TAGS.join(', ')}` };
  }
  return { valid: true, cleanTag };
}

export function validateMessage(message) {
  if (!message || typeof message !== 'string') {
    return { valid: false, error: 'Message is required' };
  }
  if (message.length > 280) {
    return { valid: false, error: 'Message must be 280 characters or less' };
  }
  return { valid: true };
}

export function validateSenderId(sender_id) {
  if (!sender_id || typeof sender_id !== 'string') {
    return { valid: false, error: 'sender_id is required' };
  }
  return { valid: true };
}

// ─── CORS ─────────────────────────────────────────────────────────────
export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export function corsResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}
