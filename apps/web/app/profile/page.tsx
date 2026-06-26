export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Your Profile</h1>
      <p className="mt-1 text-muted-foreground">
        Manage your preferences to get personalised recommendations
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {/* Personal Info */}
        <section className="rounded-xl border p-6">
          <h2 className="text-lg font-semibold">Personal Info</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm"
                defaultValue=""
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm"
                defaultValue=""
              />
            </div>
          </div>
        </section>

        {/* Dietary Restrictions */}
        <section className="rounded-xl border p-6">
          <h2 className="text-lg font-semibold">Dietary Restrictions</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            We&apos;ll never recommend dishes that don&apos;t match your needs
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {dietaryOptions.map((option) => (
              <label
                key={option}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
              >
                <input type="checkbox" className="rounded" />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Favourite Teams */}
        <section className="rounded-xl border p-6">
          <h2 className="text-lg font-semibold">Favourite Teams</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            We&apos;ll prioritise cuisines from your teams&apos; countries
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {sampleTeams.map((team) => (
              <label
                key={team}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
              >
                <input type="checkbox" className="rounded" />
                <span>{team}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Cuisine Preferences */}
        <section className="rounded-xl border p-6">
          <h2 className="text-lg font-semibold">Cuisine Preferences</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Select cuisines you love &mdash; we&apos;ll lean into these
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {cuisineOptions.map((cuisine) => (
              <label
                key={cuisine}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
              >
                <input type="checkbox" className="rounded" />
                <span>{cuisine}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Delivery Addresses */}
        <section className="rounded-xl border p-6 md:col-span-2">
          <h2 className="text-lg font-semibold">Delivery Addresses</h2>
          <div className="mt-4 rounded-lg border-2 border-dashed border-muted p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No addresses saved yet
            </p>
            <button className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Add Address
            </button>
          </div>
        </section>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
          Save Profile
        </button>
      </div>
    </div>
  );
}

const dietaryOptions = [
  'Vegan',
  'Vegetarian',
  'Pescatarian',
  'Halal',
  'Kosher',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
];

const sampleTeams = [
  'England',
  'Brazil',
  'Germany',
  'Spain',
  'Italy',
  'France',
  'Argentina',
  'Japan',
  'Nigeria',
  'Mexico',
];

const cuisineOptions = [
  'Italian',
  'Spanish',
  'Japanese',
  'Mexican',
  'Indian',
  'French',
  'Brazilian',
  'Korean',
  'Middle Eastern',
  'West African',
];
