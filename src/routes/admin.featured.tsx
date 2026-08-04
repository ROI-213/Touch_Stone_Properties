import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/featured")({
  component: () => <Navigate to="/admin/properties" replace />,
});
