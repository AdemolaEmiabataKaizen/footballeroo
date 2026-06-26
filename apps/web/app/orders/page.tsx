export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Order History</h1>
      <p className="mt-1 text-muted-foreground">
        Your past match-day orders
      </p>

      <div className="mt-8">
        {/* Empty State */}
        <div className="rounded-xl border-2 border-dashed border-muted p-12 text-center">
          <span className="text-4xl">&#128203;</span>
          <h3 className="mt-4 text-lg font-semibold">No orders yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Once you place your first order, it&apos;ll appear here with all the
            details
          </p>
        </div>

        {/* Sample Order (will be rendered when orders exist) */}
        {/*
        <div className="space-y-4">
          <div className="rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Order #FB-001</p>
                <p className="font-medium">Italy vs. Spain Match Day</p>
                <p className="text-sm text-muted-foreground">Sat, 14 Jun 2026</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">&pound;28.90</p>
                <span className="inline-flex rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">
                  Delivered
                </span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-lg">🍝</div>
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-lg">🥔</div>
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-lg">🍫</div>
            </div>
            <button className="mt-4 text-sm font-medium text-primary hover:underline">
              Re-order
            </button>
          </div>
        </div>
        */}
      </div>
    </div>
  );
}
