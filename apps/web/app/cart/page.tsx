import Link from 'next/link';

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Your Cart</h1>
      <p className="mt-1 text-muted-foreground">
        Review your match-day order
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {/* Empty State */}
          <div className="rounded-xl border-2 border-dashed border-muted p-12 text-center">
            <span className="text-4xl">&#128722;</span>
            <h3 className="mt-4 text-lg font-semibold">Your cart is empty</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Head to the menu to add some match-day dishes
            </p>
            <Link
              href="/menu"
              className="mt-6 inline-flex items-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Browse Menu
            </Link>
          </div>

          {/* Sample Cart Item (hidden when empty, shown when items exist) */}
          {/* 
          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-xl border p-4">
              <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center text-2xl">
                🍝
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Risotto alla Milanese</h3>
                <p className="text-sm text-muted-foreground">Italian</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="h-8 w-8 rounded-full border flex items-center justify-center">-</button>
                <span className="w-8 text-center text-sm font-medium">1</span>
                <button className="h-8 w-8 rounded-full border flex items-center justify-center">+</button>
              </div>
              <span className="font-semibold">&pound;12.50</span>
            </div>
          </div>
          */}
        </div>

        {/* Order Summary */}
        <div className="rounded-xl border p-6">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>&pound;0.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery fee</span>
              <span>&pound;3.50</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>&pound;3.50</span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Free delivery on orders over &pound;25
          </p>
          <button
            disabled
            className="mt-6 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
