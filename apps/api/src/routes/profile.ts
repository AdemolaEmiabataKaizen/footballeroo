import { Router } from 'express';
import type { ApiResponse, UserProfile } from '@footballeroo/shared';

const router = Router();

/**
 * GET /api/profile
 * Get the current user's profile
 */
router.get('/', (_req, res) => {
  // Placeholder - Phase 5
  const response: ApiResponse<UserProfile | null> = {
    success: true,
    data: null,
    message: 'Profile endpoint ready (Phase 5)',
  };

  res.json(response);
});

/**
 * PUT /api/profile
 * Update the current user's profile
 */
router.put('/', (req, res) => {
  const updates = req.body;

  res.json({
    success: true,
    data: null,
    message: `Profile update with keys: ${Object.keys(updates || {}).join(', ')} - endpoint ready (Phase 5)`,
  });
});

export { router as profileRouter };
