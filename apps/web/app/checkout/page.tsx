export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <p className="mt-1 text-muted-foreground">
        Confirm your delivery details and place your order
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Delivery Details */}
        <section className="space-y-6">
          <div className="rounded-xl border p-6">
            <h2 className="text-lg font-semibold">Delivery Address</h2>
            <div className="mt-4 space-y-4">
              <input
                type="text"
                placeholder="Address line 1"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Address line 2 (optional)"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  defaultValue="London"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Postcode"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border p-6">
            <h2 className="text-lg font-semibold">Payment</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Payment integration coming soon (Stripe)
            </p>
            <div className="mt-4 rounded-lg border-2 border-dashed border-muted p-8 text-center text-sm text-muted-foreground">
              Card input placeholder
            </div>
          </div>
        </section>

        {/* Order Summary */}
        <section className="rounded-xl border p-6 h-fit">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <div className="mt-4 space-y-3 text-sm">
            <p className="text-muted-foreground">No items in cart</p>
          </div>
          <button
            disabled
            className="mt-6 w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Place Order
          </button>
        </section>
      </div>
    </div>
  );
}
