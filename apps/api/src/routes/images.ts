import { Router } from 'express';
import { generateDishImage } from '../services/image';
import { generationLimiter } from '../middleware/rate-limiter';

const router = Router();

/**
 * POST /api/images/generate
 * Generate a food image for a dish
 * Body: { name: string, description: string, cuisine: string }
 */
router.post('/generate', generationLimiter, async (req, res) => {
  const { name, description, cuisine } = req.body || {};

  if (!name || !description) {
    res.status(400).json({
      success: false,
      error: 'name and description are required',
    });
    return;
  }

  try {
    const result = await generateDishImage(
      name,
      description,
      cuisine || 'global',
    );

    res.json({
      success: true,
      data: result,
      message: result.source === 'dalle'
        ? 'Image generated with DALL-E 3'
        : 'Fallback image used (DALL-E unavailable)',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err instanceof Error
        ? err.message
        : 'Image generation failed',
    });
  }
});

/**
 * POST /api/images/validate
 * Check if an image URL is still accessible
 * Body: { url: string }
 */
router.post('/validate', async (req, res) => {
  const { url } = req.body || {};

  if (!url) {
    res.status(400).json({
      success: false,
      error: 'url is required',
    });
    return;
  }

  try {
    const { validateImageUrl } = await import('../services/image');
    const isValid = await validateImageUrl(url);

    res.json({
      success: true,
      data: { url, isValid },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Validation failed',
    });
  }
});

export { router as imagesRouter };
