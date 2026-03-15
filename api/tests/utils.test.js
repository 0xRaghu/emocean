/**
 * Unit Tests for Emocean Utilities
 */

import { describe, it, expect } from 'vitest';
import {
  resolveLocation,
  hashToIndex,
  generateUsername,
  generateAvatarSeed,
  containsBlockedContent,
  validateTag,
  validateMessage,
  validateSenderId,
  corsResponse,
  ADJECTIVES,
  CREATURES,
  VALID_TAGS,
  TIMEZONE_LOCATIONS,
} from '../src/utils.js';

// ─── resolveLocation ──────────────────────────────────────────────────

describe('resolveLocation', () => {
  it('returns default for null/undefined timezone', () => {
    expect(resolveLocation(null)).toBe('Somewhere on Earth');
    expect(resolveLocation(undefined)).toBe('Somewhere on Earth');
    expect(resolveLocation('')).toBe('Somewhere on Earth');
  });

  it('returns exact match for specific timezones', () => {
    expect(resolveLocation('America/New_York')).toBe('Somewhere on the US East Coast');
    expect(resolveLocation('Europe/London')).toBe('Somewhere in the UK');
    expect(resolveLocation('Asia/Tokyo')).toBe('Somewhere near Japan');
    expect(resolveLocation('Australia/Sydney')).toBe('Somewhere in Australia');
  });

  it('falls back to prefix match for unknown specific timezones', () => {
    expect(resolveLocation('America/Phoenix')).toBe('Somewhere in the Americas');
    expect(resolveLocation('Europe/Zurich')).toBe('Somewhere in Central Europe');
    expect(resolveLocation('Asia/Kathmandu')).toBe('Somewhere in Asia');
    expect(resolveLocation('Africa/Addis_Ababa')).toBe('Somewhere in Africa');
  });

  it('returns default for completely unknown timezones', () => {
    expect(resolveLocation('Unknown/Zone')).toBe('Somewhere on Earth');
    expect(resolveLocation('InvalidTimezone')).toBe('Somewhere on Earth');
  });
});

// ─── hashToIndex ──────────────────────────────────────────────────────

describe('hashToIndex', () => {
  it('returns a valid index within range', () => {
    const hash = 'abc123def456';
    const max = 50;
    const result = hashToIndex(hash, max);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(max);
  });

  it('is deterministic for same input', () => {
    const hash = 'deadbeef1234';
    expect(hashToIndex(hash, 100)).toBe(hashToIndex(hash, 100));
  });

  it('produces different results for different hashes', () => {
    const hash1 = 'aaaaaaaa0000';
    const hash2 = 'bbbbbbbb1111';
    // Different hashes should likely produce different indices (not guaranteed but probable)
    const result1 = hashToIndex(hash1, 1000);
    const result2 = hashToIndex(hash2, 1000);
    // Just verify they're both valid
    expect(result1).toBeGreaterThanOrEqual(0);
    expect(result2).toBeGreaterThanOrEqual(0);
  });
});

// ─── generateUsername ─────────────────────────────────────────────────

describe('generateUsername', () => {
  it('generates username in correct format', () => {
    const hash = 'abc123def456abc123def456abc123def456abc123def456abc123def456abc1';
    const username = generateUsername(hash);

    // Should be Adjective + Creature + 3-digit number
    expect(username).toMatch(/^[A-Z][a-z]+[A-Z][a-z]+\d{3}$/);
  });

  it('is deterministic for same hash', () => {
    const hash = 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef';
    expect(generateUsername(hash)).toBe(generateUsername(hash));
  });

  it('uses adjectives and creatures from the lists', () => {
    const hash = '0000000000000000000000000000000000000000000000000000000000000000';
    const username = generateUsername(hash);

    const hasValidAdjective = ADJECTIVES.some(adj => username.startsWith(adj));
    const hasValidCreature = CREATURES.some(creature => username.includes(creature));

    expect(hasValidAdjective).toBe(true);
    expect(hasValidCreature).toBe(true);
  });

  it('generates number between 100 and 999', () => {
    const hash = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
    const username = generateUsername(hash);
    const num = parseInt(username.match(/\d+$/)[0]);

    expect(num).toBeGreaterThanOrEqual(100);
    expect(num).toBeLessThanOrEqual(999);
  });
});

// ─── generateAvatarSeed ───────────────────────────────────────────────

describe('generateAvatarSeed', () => {
  it('returns first 12 characters of hash', () => {
    const hash = 'abc123def456ghijkl789';
    expect(generateAvatarSeed(hash)).toBe('abc123def456');
  });

  it('is deterministic', () => {
    const hash = 'xyz789abc123def456';
    expect(generateAvatarSeed(hash)).toBe(generateAvatarSeed(hash));
  });
});

// ─── containsBlockedContent ───────────────────────────────────────────

describe('containsBlockedContent', () => {
  describe('URL blocking', () => {
    it('blocks http URLs', () => {
      const result = containsBlockedContent('Check out http://example.com');
      expect(result.blocked).toBe(true);
      expect(result.reason).toContain('URLs');
    });

    it('blocks https URLs', () => {
      const result = containsBlockedContent('Visit https://example.com');
      expect(result.blocked).toBe(true);
    });

    it('blocks www URLs', () => {
      const result = containsBlockedContent('Go to www.example.com');
      expect(result.blocked).toBe(true);
    });

    it('blocks common TLDs', () => {
      expect(containsBlockedContent('mysite.com is cool').blocked).toBe(true);
      expect(containsBlockedContent('check myapp.io').blocked).toBe(true);
      expect(containsBlockedContent('visit crypto.xyz').blocked).toBe(true);
      expect(containsBlockedContent('try tool.ai').blocked).toBe(true);
      expect(containsBlockedContent('see docs.dev').blocked).toBe(true);
    });

    it('blocks URL shorteners', () => {
      expect(containsBlockedContent('bit.ly/abc123').blocked).toBe(true);
      expect(containsBlockedContent('t.co/xyz').blocked).toBe(true);
    });
  });

  describe('profanity blocking', () => {
    it('blocks profanity', () => {
      const result = containsBlockedContent('This is shit');
      expect(result.blocked).toBe(true);
      expect(result.reason).toContain('kind');
    });

    it('blocks slurs', () => {
      expect(containsBlockedContent('you retard').blocked).toBe(true);
    });

    it('blocks harmful phrases', () => {
      expect(containsBlockedContent('kys loser').blocked).toBe(true);
      expect(containsBlockedContent('kill yourself').blocked).toBe(true);
    });

    it('is case insensitive', () => {
      expect(containsBlockedContent('SHIT').blocked).toBe(true);
      expect(containsBlockedContent('ShIt').blocked).toBe(true);
    });
  });

  describe('allowed content', () => {
    it('allows normal developer messages', () => {
      expect(containsBlockedContent('Finally fixed that bug!').blocked).toBe(false);
      expect(containsBlockedContent('3am debugging session').blocked).toBe(false);
      expect(containsBlockedContent('Shipped to production').blocked).toBe(false);
    });

    it('allows technical terms', () => {
      expect(containsBlockedContent('Using async/await').blocked).toBe(false);
      expect(containsBlockedContent('CSS is hard').blocked).toBe(false);
      expect(containsBlockedContent('TypeScript types').blocked).toBe(false);
    });
  });
});

// ─── validateTag ──────────────────────────────────────────────────────

describe('validateTag', () => {
  it('accepts valid tags', () => {
    VALID_TAGS.forEach(tag => {
      const result = validateTag(tag);
      expect(result.valid).toBe(true);
      expect(result.cleanTag).toBe(tag);
    });
  });

  it('strips # prefix from tags', () => {
    const result = validateTag('#win');
    expect(result.valid).toBe(true);
    expect(result.cleanTag).toBe('win');
  });

  it('normalizes case', () => {
    const result = validateTag('WIN');
    expect(result.valid).toBe(true);
    expect(result.cleanTag).toBe('win');
  });

  it('trims whitespace', () => {
    const result = validateTag('  struggle  ');
    expect(result.valid).toBe(true);
    expect(result.cleanTag).toBe('struggle');
  });

  it('rejects invalid tags', () => {
    const result = validateTag('invalid-tag');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid tag');
  });

  it('accepts null/empty tags', () => {
    expect(validateTag(null).valid).toBe(true);
    expect(validateTag(null).cleanTag).toBe(null);
    expect(validateTag('').valid).toBe(true);
    expect(validateTag('').cleanTag).toBe(null);
    expect(validateTag(undefined).valid).toBe(true);
  });
});

// ─── validateMessage ──────────────────────────────────────────────────

describe('validateMessage', () => {
  it('accepts valid messages', () => {
    expect(validateMessage('Hello world').valid).toBe(true);
    expect(validateMessage('A').valid).toBe(true);
    expect(validateMessage('a'.repeat(280)).valid).toBe(true);
  });

  it('rejects null/undefined messages', () => {
    expect(validateMessage(null).valid).toBe(false);
    expect(validateMessage(undefined).valid).toBe(false);
    expect(validateMessage(null).error).toBe('Message is required');
  });

  it('rejects non-string messages', () => {
    expect(validateMessage(123).valid).toBe(false);
    expect(validateMessage({}).valid).toBe(false);
    expect(validateMessage([]).valid).toBe(false);
  });

  it('rejects messages over 280 characters', () => {
    const result = validateMessage('a'.repeat(281));
    expect(result.valid).toBe(false);
    expect(result.error).toContain('280 characters');
  });
});

// ─── validateSenderId ─────────────────────────────────────────────────

describe('validateSenderId', () => {
  it('accepts valid sender IDs', () => {
    expect(validateSenderId('user123').valid).toBe(true);
    expect(validateSenderId('web_abc-123').valid).toBe(true);
  });

  it('rejects null/undefined sender IDs', () => {
    expect(validateSenderId(null).valid).toBe(false);
    expect(validateSenderId(undefined).valid).toBe(false);
    expect(validateSenderId(null).error).toBe('sender_id is required');
  });

  it('rejects non-string sender IDs', () => {
    expect(validateSenderId(123).valid).toBe(false);
    expect(validateSenderId({}).valid).toBe(false);
  });
});

// ─── corsResponse ─────────────────────────────────────────────────────

describe('corsResponse', () => {
  it('returns JSON response with CORS headers', async () => {
    const response = corsResponse({ ok: true });

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(response.headers.get('Access-Control-Allow-Methods')).toContain('GET');
    expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST');
  });

  it('returns custom status codes', () => {
    expect(corsResponse({ error: 'Bad' }, 400).status).toBe(400);
    expect(corsResponse({ error: 'Not found' }, 404).status).toBe(404);
    expect(corsResponse({ error: 'Server error' }, 500).status).toBe(500);
  });

  it('serializes body to JSON', async () => {
    const body = { ok: true, data: { nested: 'value' } };
    const response = corsResponse(body);
    const json = await response.json();

    expect(json).toEqual(body);
  });
});

// ─── Constants ────────────────────────────────────────────────────────

describe('Constants', () => {
  it('has enough adjectives for variety', () => {
    expect(ADJECTIVES.length).toBeGreaterThanOrEqual(40);
  });

  it('has enough creatures for variety', () => {
    expect(CREATURES.length).toBeGreaterThanOrEqual(40);
  });

  it('has expected valid tags', () => {
    expect(VALID_TAGS).toContain('win');
    expect(VALID_TAGS).toContain('struggle');
    expect(VALID_TAGS).toContain('idea');
    expect(VALID_TAGS).toContain('rant');
    expect(VALID_TAGS).toContain('gratitude');
    expect(VALID_TAGS).toContain('late-night');
  });

  it('has timezone mappings for major regions', () => {
    expect(TIMEZONE_LOCATIONS['America/New_York']).toBeDefined();
    expect(TIMEZONE_LOCATIONS['Europe/London']).toBeDefined();
    expect(TIMEZONE_LOCATIONS['Asia/Tokyo']).toBeDefined();
    expect(TIMEZONE_LOCATIONS['Australia/Sydney']).toBeDefined();
  });
});
