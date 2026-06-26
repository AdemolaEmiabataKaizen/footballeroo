'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Dish } from '@/lib/api';
import { useCartStore } from '@/lib/store/cart-store';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { X, Clock, Plus, Minus, Sparkles } from 'lucide-react';

interface DishDetailModalProps {
  dish: Dish;
  onClose: () => void;
}

export function DishDetailModal({ dish, onClose }: DishDetailModalProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  const isBoldChoice = dish.tasteScore >= 40 && dish.tasteScore < 70;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(dish);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-background shadow-xl sm:rounded-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur shadow-sm hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-2xl bg-muted sm:rounded-t-2xl">
          {dish.imageUrl && !imageError ? (
            <Image
              src={dish.imageUrl}
              alt={dish.name}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/5 to-muted">
              <span className="text-6xl opacity-50">
                {dish.cuisine === 'italian' ? '\uD83C\uDDEE\uD83C\uDDF9' : '\uD83C\uDF7D\uFE0F'}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title + Price */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold">{dish.name}</h2>
              <p className="mt-0.5 text-sm capitalize text-muted-foreground">
                {dish.cuisine} cuisine
              </p>
            </div>
            <span className="text-xl font-bold text-primary">
              {formatPrice(dish.price)}
            </span>
          </div>

          {/* Badges */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {dish.mood !== 'neutral' && (
              <Badge variant={dish.mood === 'celebration' ? 'celebration' : 'comfort'}>
                {dish.mood}
              </Badge>
            )}
            {isBoldChoice && (
              <Badge variant="bold" className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Bold Choice
              </Badge>
            )}
            {dish.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="capitalize">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Description */}
          <p className="mt-4 text-sm text-muted-foreground">
            {dish.description}
          </p>

          {/* Ingredients */}
          <div className="mt-4">
            <h3 className="text-sm font-semibold">Ingredients</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {dish.ingredients.map((ing) => (
                <span
                  key={ing.name}
                  className="rounded-full border px-2.5 py-1 text-xs"
                >
                  {ing.name}
                </span>
              ))}
            </div>
          </div>

          {/* Prep time + Taste score */}
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {dish.prepTime} mins
            </span>
            <span>
              Taste score: <strong>{dish.tasteScore}</strong>/100
            </span>
          </div>

          {/* Bold choice note */}
          {isBoldChoice && (
            <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-3 text-xs text-orange-700 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-300">
              <strong>Bold Choice:</strong> This is an adventurous combination. The flavours
              are creative and unusual — perfect if you&apos;re feeling experimental!
            </div>
          )}

          {/* Quantity + Add to cart */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg border px-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-8 w-8 items-center justify-center rounded hover:bg-muted"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-8 w-8 items-center justify-center rounded hover:bg-muted"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Add to Cart &mdash; {formatPrice(dish.price * quantity)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
