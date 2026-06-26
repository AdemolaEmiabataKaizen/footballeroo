import { Router } from 'express';
import type { ApiResponse, Fixture } from '@footballeroo/shared';

const router = Router();

/**
 * GET /api/fixtures/today
 * Returns today's FIFA World Cup fixtures
 */
router.get('/today', (_req, res) => {
  // Placeholder - will be replaced by Football Service in Phase 1
  const today = new Date().toISOString().split('T')[0];

  const mockFixtures: Fixture[] = [
    {
      id: 'fix-001',
      homeTeam: {
        id: 'team-ita',
        name: 'Italy',
        country: 'IT',
        cuisineTags: ['italian', 'mediterranean'],
      },
      awayTeam: {
        id: 'team-esp',
        name: 'Spain',
        country: 'ES',
        cuisineTags: ['spanish', 'mediterranean', 'tapas'],
      },
      status: 'scheduled',
      kickoff: `${today}T20:00:00Z`,
      competition: 'FIFA World Cup 2026 - Group F',
      venue: 'MetLife Stadium, New York',
    },
  ];

  const response: ApiResponse<Fixture[]> = {
    success: true,
    data: mockFixtures,
    message: `${mockFixtures.length} fixture(s) today`,
  };

  res.json(response);
});

/**
 * GET /api/fixtures/:id
 * Returns a single fixture by ID
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;

  // Placeholder
  res.json({
    success: true,
    data: null,
    message: `Fixture ${id} - endpoint ready (data from Phase 1)`,
  });
});

export { router as fixturesRouter };
