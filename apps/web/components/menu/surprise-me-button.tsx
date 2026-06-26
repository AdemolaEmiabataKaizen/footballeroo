'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { generateCustomDish } from '@/lib/api';
import type { Dish } from '@/lib/api';

interface SurpriseMeButtonProps {
  onDishGenerated: (dish: Dish) => void;
}

export function SurpriseMeButton({ onDishGenerated }: SurpriseMeButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleSurpriseMe = async () => {
    setLoading(true);
    try {
      const result = await generateCustomDish(
        'Surprise me with something creative and delicious based on today\'s match',
      );
      if (result.success && result.data) {
        onDishGenerated(result.data);
      }
    } catch (err) {
      console.error('Surprise me failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSurpriseMe}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-full border-2 border-dashed border-primary/30 px-6 py-3 text-sm font-medium text-primary transition-all hover:border-primary hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          Surprise Me — generate a unique dish
        </>
      )}
    </button>
  );
}
