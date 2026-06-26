import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-football-gold/5 px-4 py-20 md:py-32">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            <span className="text-primary">Mood Food</span> for the
            <br />
            Beautiful Game
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            AI-powered menus that react to live football. Every match brings a
            fresh culinary journey — dishes inspired by the teams, the mood, and
            what&apos;s in season.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/menu"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Explore Today&apos;s Menu
            </Link>
            <Link
              href="/menu"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Surprise Me
            </Link>
          </div>
        </div>
      </section>

      {/* Match Banner (placeholder) */}
      <section className="border-y bg-muted/30 py-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-600">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              LIVE
            </span>
            <span className="font-medium">Today&apos;s Matches:</span>
            <span className="text-muted-foreground">
              Loading fixtures...
            </span>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto">
          <h2 className="text-center text-3xl font-bold">How It Works</h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-muted-foreground">
            Three signals combine to create your unique menu every match day.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {/* Signal 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
                &#9917;
              </div>
              <h3 className="mt-4 text-lg font-semibold">Live Football</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Cuisines of today&apos;s playing teams shape the menu.
                Celebration food after a win, comfort after a loss.
              </p>
            </div>
            {/* Signal 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
                &#128100;
              </div>
              <h3 className="mt-4 text-lg font-semibold">Your Taste</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Dietary needs, favourite cuisines, and order history
                personalise every recommendation.
              </p>
            </div>
            {/* Signal 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
                &#127859;
              </div>
              <h3 className="mt-4 text-lg font-semibold">What&apos;s Fresh</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Real stock levels ensure dishes are available and surplus
                ingredients get transformed into creative specials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold">FIFA World Cup 2026</h2>
          <p className="mt-3 text-muted-foreground">
            48 nations. 39 match days. A different culinary journey every single
            day.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            June 11 &ndash; July 19, 2026
          </p>
          <Link
            href="/menu"
            className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            View Today&apos;s Match-Day Menu
          </Link>
        </div>
      </section>
    </div>
  );
}
