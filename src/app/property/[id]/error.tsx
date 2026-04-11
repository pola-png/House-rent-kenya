"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
      <p className="text-muted-foreground mb-6">We couldn’t open this property. Please try again.</p>
      <div className="text-xs text-muted-foreground mb-6">{error?.message}</div>
      <button
        onClick={() => reset()}
        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}

