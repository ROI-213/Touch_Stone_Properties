import { Component, lazy, Suspense, useEffect, useState, type ErrorInfo, type ReactNode } from "react";

const Inner = lazy(() => import("./LocationPickerMapInner"));

class MapErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error("[LocationPickerMap] failed", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div className="grid h-full place-items-center px-4 text-center text-charcoal/50">Map temporarily unavailable</div>;
    }
    return this.props.children;
  }
}

export function LocationPickerMap({
  lat,
  lng,
  draggable,
  onChange,
  height = 320,
}: {
  lat: number;
  lng: number;
  draggable?: boolean;
  onChange?: (lat: number, lng: number) => void;
  height?: number;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div
      style={{ height }}
      className="w-full overflow-hidden rounded-xl border border-charcoal/10 bg-sand"
    >
      {mounted && (
        <MapErrorBoundary>
          <Suspense fallback={<div className="grid h-full place-items-center text-charcoal/40">Loading map…</div>}>
            <Inner lat={lat} lng={lng} draggable={draggable} onChange={onChange} />
          </Suspense>
        </MapErrorBoundary>
      )}
    </div>
  );
}
