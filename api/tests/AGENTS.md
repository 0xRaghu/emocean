<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2025-03-15 -->

# api/tests

## Purpose

Vitest test suites for the Emocean API. Uses Cloudflare's vitest-pool-workers for realistic D1 testing.

## Key Files

| File | Description |
|------|-------------|
| `api.test.js` | Integration tests for all API endpoints |
| `utils.test.js` | Unit tests for utility functions |

## For AI Agents

### Running Tests

```bash
cd api
pnpm test           # Run all tests
pnpm test:watch     # Watch mode
pnpm test -- -t "toss"  # Run specific test
```

### Test Structure

**api.test.js** — Integration tests with in-memory D1:
- Health check endpoint
- Toss endpoint (success, validation, rate limiting)
- Catch endpoint (random selection, filtering)
- Stoke endpoint (increment counter)
- Campfire endpoint (pagination)
- Stats endpoint

**utils.test.js** — Unit tests:
- `generateUsername()` determinism
- `generateAvatarUrl()` format
- `resolveLocation()` timezone mapping
- `validateMessage()` edge cases
- `containsUrl()` detection patterns
- `containsProfanity()` filtering

### Writing New Tests

```javascript
import { describe, it, expect } from 'vitest';
import { env } from 'cloudflare:test';

describe('Feature', () => {
  it('should behave correctly', async () => {
    const response = await app.fetch(
      new Request('http://localhost/endpoint'),
      env
    );
    expect(response.status).toBe(200);
  });
});
```

### Test Coverage

Run with coverage:
```bash
pnpm test -- --coverage
```

Coverage reports are generated in `coverage/` directory.

<!-- MANUAL: -->
