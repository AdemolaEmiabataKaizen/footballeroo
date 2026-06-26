'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Dish } from '@/lib/api';
import { useCartStore } from '@/lib/store/cart-store';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus, Sparkles } from 'lucide-react';

interface DishCardProps {
  dish: Dish;
  onViewDetail?: (dish: Dish) => void;
}

export function DishCard({ dish, onViewDetail }: DishCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [imageError, setImageError] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(dish);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const isBoldChoice = dish.tasteScore >= 40 && dish.tasteScore < 70;

  return (
    <div
      className="group overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
      onClick={() => onViewDetail?.(dish)}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {dish.imageUrl && !imageError ? (
          <Image
            src={dish.imageUrl}
            alt={dish.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <span className="text-5xl opacity-50">
              {getCuisineEmoji(dish.cuisine)}
            </span>
          </div>
        )}

        {/* Mood badge */}
        {dish.mood !== 'neutral' && (
          <div className="absolute left-2 top-2">
            <Badge
              variant={dish.mood === 'celebration' ? 'celebration' : 'comfort'}
              className="text-[10px]"
            >
              {dish.mood === 'celebration' ? 'Celebration' : dish.mood === 'comfort' ? 'Comfort' : 'Fusion'}
            </Badge>
          </div>
        )}

        {/* Bold choice badge */}
        {isBoldChoice && (
          <div className="absolute right-2 top-2">
            <Badge variant="bold" className="flex items-center gap-1 text-[10px]">
              <Sparkles className="h-3 w-3" />
              Bold Choice
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-sm">{dish.name}</h3>
            <p className="mt-0.5 text-xs capitalize text-muted-foreground">
              {dish.cuisine}
            </p>
          </div>
          <span className="shrink-0 text-sm font-bold text-primary">
            {formatPrice(dish.price)}
          </span>
        </div>

        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
          {dish.description}
        </p>

        {/* Tags + Prep time */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-1 overflow-hidden">
            {dish.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              {dish.prepTime}m
            </span>
          </div>

          {/* Add button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAdd();
            }}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {added ? (
              'Added!'
            ) : (
              <>
                <Plus className="h-3 w-3" />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function getCuisineEmoji(cuisine: string): string {
  const map: Record<string, string> = {
    italian: '\uD83C\uDDEE\uD83C\uDDF9',
    spanish: '\uD83C\uDDEA\uD83C\uDDF8',
    french: '\uD83C\uDDEB\uD83C\uDDF7',
    japanese: '\uD83C\uDDEF\uD83C\uDDF5',
    mexican: '\uD83C\uDDF2\uD83C\uDDFD',
    korean: '\uD83C\uDDF0\uD83C\uDDF7',
    indian: '\uD83C\uDDEE\uD83C\uDDF3',
    moroccan: '\uD83C\uDDF2\uD83C\uDDE6',
    brazilian: '\uD83C\uDDE7\uD83C\uDDF7',
    british: '\uD83C\uDDEC\uD83C\uDDE7',
    german: '\uD83C\uDDE9\uD83C\uDDEA',
    turkish: '\uD83C\uDDF9\uD83C\uDDF7',
    american: '\uD83C\uDDFA\uD83C\uDDF8',
    nigerian: '\uD83C\uDDF3\uD83C\uDDEC',
    argentinian: '\uD83C\uDDE6\uD83C\uDDF7',
  };
  return map[cuisine.toLowerCase()] || '\uD83C\uDF7D\uFE0F';
}
