import { Component, lazy, Suspense, useEffect, useState, type ErrorInfo, type ReactNode } from "react";

const Inner = lazy(() => import("./PropertyMapInner"));

class MapErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error("[PropertyMap] failed", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div className="grid h-full place-items-center px-4 text-center text-charcoal/50">Map temporarily unavailable</div>;
    }
    return this.props.children;
  }
}

export function PropertyMap({
  lat,
  lng,
  title,
}: {
  lat: number;
  lng: number;
  title: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div className="h-[400px] w-full overflow-hidden rounded-xl border border-charcoal/10 bg-sand">
      {mounted && (
        <MapErrorBoundary>
          <Suspense
            fallback={<div className="grid h-full place-items-center text-charcoal/40">Loading map…</div>}
          >
            <Inner lat={lat} lng={lng} title={title} />
          </Suspense>
        </MapErrorBoundary>
      )}
    </div>
  );
}
