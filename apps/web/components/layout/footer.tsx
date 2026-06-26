import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container flex flex-col items-center gap-4 py-8 md:flex-row md:justify-between">
        <div className="flex flex-col items-center gap-1 md:items-start">
          <p className="text-sm font-semibold text-primary">Footballeroo</p>
          <p className="text-xs text-muted-foreground">
            Mood Food — matching dishes to the beautiful game
          </p>
        </div>

        <nav className="flex gap-4">
          <Link
            href="/menu"
            className="text-xs text-muted-foreground hover:text-primary"
          >
            Menu
          </Link>
          <Link
            href="/profile"
            className="text-xs text-muted-foreground hover:text-primary"
          >
            Profile
          </Link>
          <Link
            href="/orders"
            className="text-xs text-muted-foreground hover:text-primary"
          >
            Orders
          </Link>
        </nav>

        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Footballeroo. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
