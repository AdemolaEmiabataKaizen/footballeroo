import Link from 'next/link';

export default function AuthErrorPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Authentication Error</h1>
        <p className="mt-3 text-muted-foreground">
          Something went wrong during sign-in. Please try again.
        </p>
        <Link
          href="/auth/signin"
          className="mt-6 inline-flex items-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}
