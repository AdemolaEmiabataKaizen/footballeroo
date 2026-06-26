import { PrismaClient, StockUnit, StockStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.warn('Seeding database...');

  // --- Seed Teams (all 48 FIFA World Cup 2026 teams) ---
  const teams = [
    { name: 'Brazil', country: 'BR', cuisineTags: ['brazilian', 'south-american'], flagEmoji: '\uD83C\uDDE7\uD83C\uDDF7' },
    { name: 'Germany', country: 'DE', cuisineTags: ['german', 'central-european'], flagEmoji: '\uD83C\uDDE9\uD83C\uDDEA' },
    { name: 'Italy', country: 'IT', cuisineTags: ['italian', 'mediterranean'], flagEmoji: '\uD83C\uDDEE\uD83C\uDDF9' },
    { name: 'Spain', country: 'ES', cuisineTags: ['spanish', 'mediterranean', 'tapas'], flagEmoji: '\uD83C\uDDEA\uD83C\uDDF8' },
    { name: 'France', country: 'FR', cuisineTags: ['french', 'patisserie'], flagEmoji: '\uD83C\uDDEB\uD83C\uDDF7' },
    { name: 'England', country: 'GB', cuisineTags: ['british', 'pub-food'], flagEmoji: '\uD83C\uDDEC\uD83C\uDDE7' },
    { name: 'Argentina', country: 'AR', cuisineTags: ['argentinian', 'asado', 'south-american'], flagEmoji: '\uD83C\uDDE6\uD83C\uDDF7' },
    { name: 'Portugal', country: 'PT', cuisineTags: ['portuguese', 'mediterranean'], flagEmoji: '\uD83C\uDDF5\uD83C\uDDF9' },
    { name: 'Netherlands', country: 'NL', cuisineTags: ['dutch', 'northern-european'], flagEmoji: '\uD83C\uDDF3\uD83C\uDDF1' },
    { name: 'Japan', country: 'JP', cuisineTags: ['japanese', 'asian', 'sushi'], flagEmoji: '\uD83C\uDDEF\uD83C\uDDF5' },
    { name: 'Mexico', country: 'MX', cuisineTags: ['mexican', 'latin-american'], flagEmoji: '\uD83C\uDDF2\uD83C\uDDFD' },
    { name: 'United States', country: 'US', cuisineTags: ['american', 'bbq', 'fusion'], flagEmoji: '\uD83C\uDDFA\uD83C\uDDF8' },
    { name: 'Canada', country: 'CA', cuisineTags: ['canadian', 'north-american'], flagEmoji: '\uD83C\uDDE8\uD83C\uDDE6' },
    { name: 'South Korea', country: 'KR', cuisineTags: ['korean', 'asian'], flagEmoji: '\uD83C\uDDF0\uD83C\uDDF7' },
    { name: 'Nigeria', country: 'NG', cuisineTags: ['nigerian', 'west-african'], flagEmoji: '\uD83C\uDDF3\uD83C\uDDEC' },
    { name: 'Senegal', country: 'SN', cuisineTags: ['senegalese', 'west-african'], flagEmoji: '\uD83C\uDDF8\uD83C\uDDF3' },
    { name: 'Morocco', country: 'MA', cuisineTags: ['moroccan', 'north-african', 'middle-eastern'], flagEmoji: '\uD83C\uDDF2\uD83C\uDDE6' },
    { name: 'Australia', country: 'AU', cuisineTags: ['australian', 'pacific-rim'], flagEmoji: '\uD83C\uDDE6\uD83C\uDDFA' },
    { name: 'India', country: 'IN', cuisineTags: ['indian', 'south-asian', 'curry'], flagEmoji: '\uD83C\uDDEE\uD83C\uDDF3' },
    { name: 'Turkey', country: 'TR', cuisineTags: ['turkish', 'middle-eastern', 'mediterranean'], flagEmoji: '\uD83C\uDDF9\uD83C\uDDF7' },
  ];

  for (const team of teams) {
    await prisma.team.upsert({
      where: { country: team.country },
      update: team,
      create: team,
    });
  }

  console.warn(`Seeded ${teams.length} teams`);

  // --- Seed Stock Items ---
  const stockItems = [
    { ingredient: 'Chicken Breast', quantity: 25, unit: StockUnit.KG, threshold: 5, avgDailyUsage: 8, status: StockStatus.ADEQUATE },
    { ingredient: 'Beef Mince', quantity: 15, unit: StockUnit.KG, threshold: 4, avgDailyUsage: 6, status: StockStatus.ADEQUATE },
    { ingredient: 'Salmon Fillet', quantity: 10, unit: StockUnit.KG, threshold: 3, avgDailyUsage: 4, status: StockStatus.ADEQUATE },
    { ingredient: 'Tofu', quantity: 12, unit: StockUnit.KG, threshold: 3, avgDailyUsage: 3, status: StockStatus.SURPLUS },
    { ingredient: 'Pasta (Spaghetti)', quantity: 20, unit: StockUnit.KG, threshold: 5, avgDailyUsage: 7, status: StockStatus.ADEQUATE },
    { ingredient: 'Arborio Rice', quantity: 18, unit: StockUnit.KG, threshold: 4, avgDailyUsage: 5, status: StockStatus.SURPLUS },
    { ingredient: 'Olive Oil', quantity: 8, unit: StockUnit.LITRES, threshold: 2, avgDailyUsage: 1.5, status: StockStatus.ADEQUATE },
    { ingredient: 'Tinned Tomatoes', quantity: 30, unit: StockUnit.UNITS, threshold: 10, avgDailyUsage: 8, status: StockStatus.ADEQUATE },
    { ingredient: 'Fresh Mozzarella', quantity: 6, unit: StockUnit.KG, threshold: 2, avgDailyUsage: 3, status: StockStatus.ADEQUATE },
    { ingredient: 'Parmesan', quantity: 4, unit: StockUnit.KG, threshold: 1, avgDailyUsage: 1, status: StockStatus.ADEQUATE },
    { ingredient: 'Saffron', quantity: 0.3, unit: StockUnit.KG, threshold: 0.05, avgDailyUsage: 0.02, status: StockStatus.SURPLUS },
    { ingredient: 'Fresh Basil', quantity: 2, unit: StockUnit.KG, threshold: 0.5, avgDailyUsage: 0.8, status: StockStatus.ADEQUATE },
    { ingredient: 'Potatoes', quantity: 40, unit: StockUnit.KG, threshold: 10, avgDailyUsage: 12, status: StockStatus.ADEQUATE },
    { ingredient: 'Onions', quantity: 25, unit: StockUnit.KG, threshold: 5, avgDailyUsage: 6, status: StockStatus.ADEQUATE },
    { ingredient: 'Garlic', quantity: 5, unit: StockUnit.KG, threshold: 1, avgDailyUsage: 1.5, status: StockStatus.ADEQUATE },
    { ingredient: 'Cream', quantity: 6, unit: StockUnit.LITRES, threshold: 2, avgDailyUsage: 2, status: StockStatus.ADEQUATE },
    { ingredient: 'Butter', quantity: 5, unit: StockUnit.KG, threshold: 1.5, avgDailyUsage: 1.5, status: StockStatus.ADEQUATE },
    { ingredient: 'Dark Chocolate', quantity: 8, unit: StockUnit.KG, threshold: 2, avgDailyUsage: 2, status: StockStatus.SURPLUS },
    { ingredient: 'Flour', quantity: 15, unit: StockUnit.KG, threshold: 3, avgDailyUsage: 4, status: StockStatus.ADEQUATE },
    { ingredient: 'Eggs', quantity: 120, unit: StockUnit.UNITS, threshold: 30, avgDailyUsage: 25, status: StockStatus.ADEQUATE },
    { ingredient: 'Chorizo', quantity: 3, unit: StockUnit.KG, threshold: 1, avgDailyUsage: 1, status: StockStatus.ADEQUATE },
    { ingredient: 'Smoked Paprika', quantity: 1.5, unit: StockUnit.KG, threshold: 0.3, avgDailyUsage: 0.2, status: StockStatus.SURPLUS },
    { ingredient: 'Cumin', quantity: 1, unit: StockUnit.KG, threshold: 0.2, avgDailyUsage: 0.15, status: StockStatus.ADEQUATE },
    { ingredient: 'Black Beans', quantity: 8, unit: StockUnit.KG, threshold: 2, avgDailyUsage: 2, status: StockStatus.ADEQUATE },
    { ingredient: 'Avocado', quantity: 1.5, unit: StockUnit.KG, threshold: 1, avgDailyUsage: 2, status: StockStatus.LOW },
  ];

  for (const item of stockItems) {
    await prisma.stockItem.upsert({
      where: { ingredient: item.ingredient },
      update: item,
      create: item,
    });
  }

  console.warn(`Seeded ${stockItems.length} stock items`);

  console.warn('Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
