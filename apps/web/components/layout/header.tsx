'use client';

import Link from 'next/link';
import { ShoppingCart, User, Mic, Menu } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">Footballeroo</span>
          <span className="hidden text-sm text-muted-foreground sm:inline-block">
            Mood Food
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/menu"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Menu
          </Link>
          <Link
            href="/orders"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Orders
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Voice Button */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20"
            aria-label="Voice command"
          >
            <Mic className="h-4 w-4" />
          </button>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-muted"
          >
            <ShoppingCart className="h-5 w-5" />
            {/* Cart badge - will be dynamic */}
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              0
            </span>
          </Link>

          {/* Profile */}
          <Link
            href="/profile"
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-muted"
          >
            <User className="h-5 w-5" />
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-muted md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t md:hidden">
          <nav className="container flex flex-col gap-2 py-4">
            <Link
              href="/menu"
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Menu
            </Link>
            <Link
              href="/orders"
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Orders
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
