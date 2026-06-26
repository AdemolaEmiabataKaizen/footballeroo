import { Router } from 'express';
import type { ApiResponse, Dish } from '@footballeroo/shared';

const router = Router();

/**
 * GET /api/menu
 * Returns the current live menu (from cache)
 */
router.get('/', (_req, res) => {
  // Placeholder - will be populated by Generation Engine in Phase 2
  const response: ApiResponse<Dish[]> = {
    success: true,
    data: [],
    message: 'Menu endpoint ready (dishes generated in Phase 2)',
  };

  res.json(response);
});

/**
 * GET /api/menu/dish/:id
 * Returns a single dish with full details
 */
router.get('/dish/:id', (req, res) => {
  const { id } = req.params;

  res.json({
    success: true,
    data: null,
    message: `Dish ${id} - endpoint ready (Phase 2)`,
  });
});

/**
 * POST /api/menu/generate
 * User-requested custom dish generation
 */
router.post('/generate', (req, res) => {
  const { description } = req.body || {};

  res.json({
    success: true,
    data: null,
    message: `Custom dish generation for: "${description || 'no description'}" - endpoint ready (Phase 2)`,
  });
});

/**
 * POST /api/menu/customise
 * Modify an existing dish
 */
router.post('/customise', (req, res) => {
  const { dishId, modifications } = req.body || {};

  res.json({
    success: true,
    data: null,
    message: `Customise dish ${dishId} with ${JSON.stringify(modifications)} - endpoint ready (Phase 9)`,
  });
});

export { router as menuRouter };
