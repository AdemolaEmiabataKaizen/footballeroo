'use client';

import { useState, useEffect } from 'react';
import { Mic, RefreshCw } from 'lucide-react';
import { fetchMenu, fetchTodayFixtures } from '@/lib/api';
import type { Dish, Fixture } from '@/lib/api';
import { DishCard } from '@/components/menu/dish-card';
import { DishDetailModal } from '@/components/menu/dish-detail-modal';
import { MatchBanner } from '@/components/menu/match-banner';
import { MenuSkeleton, BannerSkeleton } from '@/components/menu/menu-skeleton';
import { SurpriseMeButton } from '@/components/menu/surprise-me-button';

export default function MenuPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [cuisineTags, setCuisineTags] = useState<string[]>([]);
  const [mood, setMood] = useState('neutral');
  const [loading, setLoading] = useState(true);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [menuRes, fixturesRes] = await Promise.all([
        fetchMenu(),
        fetchTodayFixtures(),
      ]);

      if (menuRes.success && menuRes.data) {
        setDishes(menuRes.data.dishes);
      }
      if (fixturesRes.success && fixturesRes.data) {
        setFixtures(fixturesRes.data.fixtures);
        setCuisineTags(fixturesRes.data.cuisineTags);
        setMood(fixturesRes.data.mood);
      }
    } catch (err) {
      console.error('Failed to load menu data:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleSurpriseDish(dish: Dish) {
    setDishes((prev) => [dish, ...prev]);
    setSelectedDish(dish);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Match Context Banner */}
      {loading ? (
        <div className="mb-8">
          <BannerSkeleton />
        </div>
      ) : (
        <div className="mb-8">
          <MatchBanner
            fixtures={fixtures}
            mood={mood}
            cuisineTags={cuisineTags}
          />
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Match-Day Menu</h1>
          <p className="mt-1 text-muted-foreground">
            {dishes.length > 0
              ? `${dishes.length} dishes inspired by today's fixture`
              : 'Loading today\'s menu...'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20">
            <Mic className="h-4 w-4" />
            <span className="hidden sm:inline">Ask about a dish</span>
          </button>
        </div>
      </div>

      {/* Dish Grid */}
      {loading ? (
        <MenuSkeleton />
      ) : dishes.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              onViewDetail={(d) => setSelectedDish(d)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-muted p-12 text-center">
          <span className="text-4xl">&#127860;</span>
          <h3 className="mt-4 text-lg font-semibold">
            Menu is being prepared
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Our AI chef is creating today&apos;s dishes. Try refreshing
            in a moment.
          </p>
        </div>
      )}

      {/* Surprise Me */}
      <div className="mt-12 text-center">
        <SurpriseMeButton onDishGenerated={handleSurpriseDish} />
      </div>

      {/* Dish Detail Modal */}
      {selectedDish && (
        <DishDetailModal
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
        />
      )}
    </div>
  );
}
