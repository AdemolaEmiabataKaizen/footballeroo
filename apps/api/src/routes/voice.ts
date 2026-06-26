import { Router } from 'express';
import type { ApiResponse, VoiceCommand } from '@footballeroo/shared';

const router = Router();

/**
 * POST /api/voice/intent
 * Process a voice transcript and return parsed intent
 */
router.post('/intent', (req, res) => {
  const { transcript } = req.body || {};

  // Placeholder - Phase 7
  const response: ApiResponse<VoiceCommand> = {
    success: true,
    data: {
      transcript: transcript || '',
      intent: 'unknown',
      entities: {},
      confidence: 0,
    },
    message: 'Voice intent parsing - endpoint ready (Phase 7)',
  };

  res.json(response);
});

export { router as voiceRouter };
