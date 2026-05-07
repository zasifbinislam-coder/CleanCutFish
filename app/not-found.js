import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <div className="text-6xl mb-4">🌊</div>
      <h1 className="section-title">This catch slipped away.</h1>
      <p className="mt-2 text-brand-deep/70">The page you're looking for doesn't exist.</p>
      <Link href="/" className="btn-primary mt-8">Back to home</Link>
    </div>
  );
}
