import { useEffect, useRef } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const goldIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:28px;height:28px;border-radius:50% 50% 50% 0;
    background:#b8962e;transform:rotate(-45deg);
    border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,.3);
    display:grid;place-items:center;">
    <div style="width:8px;height:8px;border-radius:50%;background:#fff;transform:rotate(45deg)"></div>
  </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

export default function LocationPickerMapInner({
  lat,
  lng,
  draggable = false,
  onChange,
}: {
  lat: number;
  lng: number;
  draggable?: boolean;
  onChange?: (lat: number, lng: number) => void;
}) {
  const markerRef = useRef<L.Marker | null>(null);

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={[lat, lng]}
        icon={goldIcon}
        draggable={draggable}
        eventHandlers={{
          dragend: () => {
            const m = markerRef.current;
            if (m && onChange) {
              const ll = m.getLatLng();
              onChange(ll.lat, ll.lng);
            }
          },
        }}
        ref={(m) => {
          markerRef.current = m as unknown as L.Marker | null;
        }}
      />
      <Recenter lat={lat} lng={lng} />
    </MapContainer>
  );
}
