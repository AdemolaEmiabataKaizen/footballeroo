'use client';

import type { Fixture } from '@/lib/api';
import { formatTime } from '@/lib/utils';

interface MatchBannerProps {
  fixtures: Fixture[];
  mood: string;
  cuisineTags: string[];
}

export function MatchBanner({ fixtures, mood, cuisineTags }: MatchBannerProps) {
  if (fixtures.length === 0) {
    return (
      <div className="rounded-xl border bg-muted/30 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          No matches today &mdash; enjoy our <strong>World Kitchen</strong> menu
        </p>
      </div>
    );
  }

  const moodClass =
    mood === 'celebration'
      ? 'mood-celebration'
      : mood === 'comfort'
        ? 'mood-comfort'
        : mood === 'fusion'
          ? 'mood-fusion'
          : '';

  return (
    <div className={`rounded-xl border p-6 ${moodClass}`}>
      {fixtures.map((fixture) => (
        <div key={fixture.id} className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {fixture.competition}
            </p>
            <div className="mt-2 flex items-center gap-3">
              {/* Home team */}
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">
                  {fixture.homeTeam.name}
                </span>
              </div>

              {/* Score or VS */}
              <div className="flex items-center gap-2">
                {fixture.status === 'live' || fixture.status === 'finished' ? (
                  <span className="rounded-lg bg-background px-3 py-1 text-lg font-bold shadow-sm">
                    {fixture.score?.home ?? 0} - {fixture.score?.away ?? 0}
                  </span>
                ) : (
                  <span className="rounded-lg bg-background px-3 py-1 text-sm font-medium text-muted-foreground shadow-sm">
                    VS
                  </span>
                )}
              </div>

              {/* Away team */}
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">
                  {fixture.awayTeam.name}
                </span>
              </div>
            </div>

            {/* Venue + Kickoff */}
            <p className="mt-2 text-xs text-muted-foreground">
              {fixture.venue} &middot; {formatTime(fixture.kickoff)}
            </p>
          </div>

          {/* Status indicator */}
          <div className="flex flex-col items-end gap-1">
            {fixture.status === 'live' && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-600">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                LIVE
              </span>
            )}
            {fixture.status === 'finished' && (
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                Full Time
              </span>
            )}
            {fixture.status === 'scheduled' && (
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {formatTime(fixture.kickoff)}
              </span>
            )}
          </div>
        </div>
      ))}

      {/* Cuisine tags */}
      <div className="mt-4 flex flex-wrap gap-1.5 border-t pt-3">
        <span className="text-xs text-muted-foreground">Today&apos;s cuisines:</span>
        {cuisineTags.slice(0, 6).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium capitalize text-primary"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
