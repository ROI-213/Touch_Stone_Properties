import { useEffect } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
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

export default function PropertyMapInner({
  lat,
  lng,
  title,
}: {
  lat: number;
  lng: number;
  title: string;
}) {
  useEffect(() => {
    // ensure leaflet container resizes correctly
    window.dispatchEvent(new Event("resize"));
  }, []);
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={14}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={goldIcon} title={title} />
    </MapContainer>
  );
}
