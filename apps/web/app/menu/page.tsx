import { Mic } from 'lucide-react';

export default function MenuPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Match Context Banner */}
      <div className="mb-8 rounded-xl border bg-gradient-to-r from-primary/5 to-football-gold/5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-muted-foreground">
              Today&apos;s Match
            </h2>
            <p className="mt-1 text-2xl font-bold">Italy vs. Spain</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Group F &middot; Kick-off 20:00 BST &middot; MetLife Stadium, New
              York
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Menu Live
            </span>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Match-Day Menu</h1>
          <p className="mt-1 text-muted-foreground">
            Dishes inspired by tonight&apos;s fixture &mdash; Italian &amp;
            Spanish flavours
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20">
          <Mic className="h-4 w-4" />
          <span className="hidden sm:inline">Ask about a dish</span>
        </button>
      </div>

      {/* Dish Grid (placeholder cards) */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {placeholderDishes.map((dish) => (
          <div
            key={dish.id}
            className="group overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md"
          >
            {/* Image placeholder */}
            <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              <span className="text-4xl">{dish.emoji}</span>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{dish.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {dish.cuisine}
                  </p>
                </div>
                <span className="text-sm font-bold text-primary">
                  {dish.price}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {dish.description}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex gap-1.5">
                  {dish.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Surprise Me */}
      <div className="mt-12 text-center">
        <button className="inline-flex items-center gap-2 rounded-full border-2 border-dashed border-primary/30 px-6 py-3 text-sm font-medium text-primary transition-colors hover:border-primary hover:bg-primary/5">
          <span className="text-lg">&#10024;</span>
          Surprise Me &mdash; generate a unique dish
        </button>
      </div>
    </div>
  );
}

// Placeholder data (will be replaced by API calls)
const placeholderDishes = [
  {
    id: '1',
    name: 'Risotto alla Milanese',
    cuisine: 'Italian',
    price: '\u00A312.50',
    description:
      'Creamy saffron risotto with parmesan, inspired by the heart of Milan. Rich, golden, and comforting.',
    emoji: '\U0001F35A',
    tags: ['vegetarian', 'celebration'],
  },
  {
    id: '2',
    name: 'Patatas Bravas Remix',
    cuisine: 'Spanish',
    price: '\u00A38.90',
    description:
      'Crispy potatoes with a smoky paprika aioli and a modern twist. Perfect for sharing.',
    emoji: '\U0001F954',
    tags: ['vegan', 'shareable'],
  },
  {
    id: '3',
    name: 'Ossobuco Fusion Bowl',
    cuisine: 'Italian',
    price: '\u00A316.00',
    description:
      'Slow-braised veal shank with gremolata, served over saffron polenta. A celebration of Italian comfort.',
    emoji: '\U0001F356',
    tags: ['comfort', 'hearty'],
  },
  {
    id: '4',
    name: 'Gazpacho Andaluz',
    cuisine: 'Spanish',
    price: '\u00A39.50',
    description:
      'Chilled tomato soup with cucumber, peppers, and sherry vinegar. Refreshing and light.',
    emoji: '\U0001F963',
    tags: ['vegan', 'light'],
  },
  {
    id: '5',
    name: 'Panna Cotta al Limoncello',
    cuisine: 'Italian',
    price: '\u00A37.50',
    description:
      'Silky vanilla panna cotta with a bright limoncello glaze and candied lemon zest.',
    emoji: '\U0001F36E',
    tags: ['vegetarian', 'dessert'],
  },
  {
    id: '6',
    name: 'Churros con Chocolate',
    cuisine: 'Spanish',
    price: '\u00A36.90',
    description:
      'Golden fried churros dusted with cinnamon sugar, served with rich dark chocolate dipping sauce.',
    emoji: '\U0001F36B',
    tags: ['vegetarian', 'dessert'],
  },
];
