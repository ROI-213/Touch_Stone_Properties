import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/customer-dashboard/notifications")({
  component: CustomerNotificationsPage,
});

function CustomerNotificationsPage() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: "/notifications" });
  }, [navigate]);

  return null;
}
