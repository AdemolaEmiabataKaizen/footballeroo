import { env } from '../../config/env';

// ============================================================
// AI Image Service — Generates photorealistic food images
// Uses DALL-E 3 for unique, appetising dish photos
// ============================================================

export interface ImageGenerationResult {
  imageUrl: string;
  revisedPrompt?: string;
  source: 'dalle' | 'fallback';
  generatedAt: string;
}

/**
 * Style suffix appended to all image prompts for visual consistency.
 * Ensures all generated images look like they belong to the same menu.
 */
const STYLE_SUFFIX = [
  'Professional food photography.',
  'Overhead angle, slightly off-center.',
  'Natural warm lighting from the left.',
  'Clean white ceramic plate on dark slate surface.',
  'Shallow depth of field, soft bokeh background.',
  'Garnished elegantly. Steam rising if hot.',
  'Vibrant, saturated colours.',
  'No text, no watermarks, no hands, no people.',
  'Ultra-realistic, 4K quality.',
].join(' ');

/**
 * Generate a food image for a dish using DALL-E 3.
 *
 * @param dishName - The name of the dish
 * @param dishDescription - A brief description of the dish
 * @param cuisine - The cuisine style (e.g. "italian", "japanese")
 * @returns ImageGenerationResult with URL or fallback
 */
export async function generateDishImage(
  dishName: string,
  dishDescription: string,
  cuisine: string,
): Promise<ImageGenerationResult> {
  if (!env.OPENAI_API_KEY) {
    return getFallbackImage(cuisine);
  }

  try {
    const prompt = buildImagePrompt(dishName, dishDescription, cuisine);

    const response = await fetch(
      'https://api.openai.com/v1/images/generations',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
          style: 'natural',
        }),
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `[ImageService] DALL-E error ${response.status}:`,
        errorBody,
      );
      return getFallbackImage(cuisine);
    }

    const data = (await response.json()) as {
      data: { url: string; revised_prompt?: string }[];
    };

    if (!data.data || data.data.length === 0) {
      console.error('[ImageService] No image returned from DALL-E');
      return getFallbackImage(cuisine);
    }

    return {
      imageUrl: data.data[0].url,
      revisedPrompt: data.data[0].revised_prompt,
      source: 'dalle',
      generatedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error('[ImageService] Image generation failed:', err);
    return getFallbackImage(cuisine);
  }
}

/**
 * Generate images for multiple dishes in parallel.
 * Limits concurrency to avoid rate limits.
 */
export async function generateDishImages(
  dishes: { name: string; description: string; cuisine: string }[],
  concurrency: number = 3,
): Promise<Map<string, ImageGenerationResult>> {
  const results = new Map<string, ImageGenerationResult>();

  // Process in batches to respect rate limits
  for (let i = 0; i < dishes.length; i += concurrency) {
    const batch = dishes.slice(i, i + concurrency);

    const batchResults = await Promise.allSettled(
      batch.map((dish) =>
        generateDishImage(dish.name, dish.description, dish.cuisine),
      ),
    );

    for (let j = 0; j < batch.length; j++) {
      const result = batchResults[j];
      const key = batch[j].name;

      if (result.status === 'fulfilled') {
        results.set(key, result.value);
      } else {
        results.set(key, getFallbackImage(batch[j].cuisine));
      }
    }

    // Small delay between batches to avoid rate limiting
    if (i + concurrency < dishes.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return results;
}

/**
 * Build the image generation prompt.
 * Combines dish info with the style suffix for consistency.
 */
function buildImagePrompt(
  dishName: string,
  dishDescription: string,
  cuisine: string,
): string {
  return [
    `A beautifully plated dish: "${dishName}".`,
    `${dishDescription}.`,
    `${cuisine} cuisine style.`,
    STYLE_SUFFIX,
  ].join(' ');
}

/**
 * Validate that a generated image URL is accessible.
 * DALL-E URLs expire after ~1 hour, so this checks freshness.
 */
export async function validateImageUrl(
  url: string,
): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

// ============================================================
// Fallback Images — Used when DALL-E is unavailable
// Curated placeholder images by cuisine type
// ============================================================

const FALLBACK_IMAGES: Record<string, string> = {
  italian: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=800',
  spanish: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800',
  french: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
  japanese: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800',
  mexican: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800',
  korean: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800',
  indian: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
  moroccan: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800',
  brazilian: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
  british: 'https://images.unsplash.com/photo-1432139509613-5c4255815697?w=800',
  german: 'https://images.unsplash.com/photo-1599921841143-819065a55cc6?w=800',
  turkish: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800',
  american: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800',
  nigerian: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800',
  argentinian: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800',
  default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
};

/**
 * Get a fallback image URL by cuisine type.
 * Used when DALL-E is unavailable or rate-limited.
 */
function getFallbackImage(cuisine: string): ImageGenerationResult {
  const normalizedCuisine = cuisine.toLowerCase().trim();

  const imageUrl =
    FALLBACK_IMAGES[normalizedCuisine] ||
    FALLBACK_IMAGES.default;

  return {
    imageUrl,
    source: 'fallback',
    generatedAt: new Date().toISOString(),
  };
}
