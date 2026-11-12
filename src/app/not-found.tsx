import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <p className="font-display text-[8rem] leading-none text-amp">404</p>
      <h1 className="mt-2 font-display text-4xl uppercase tracking-wide">This track skipped</h1>
      <p className="mt-3 text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <Link
        href="/shop"
        className="mt-8 rounded-full bg-ink px-8 py-3.5 font-semibold text-white transition hover:bg-amp"
      >
        Back to the Shop
      </Link>
    </div>
  );
}
