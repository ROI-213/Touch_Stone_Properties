import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPanel } from "@/components/dashboard/PlaceholderPanel";

export const Route = createFileRoute("/customer-dashboard/notifications")({
  component: () => (
    <PlaceholderPanel
      eyebrow="Notifications"
      title="My Notifications"
      subtitle="You'll see new property matches, enquiry updates, and visit reminders here."
    />
  ),
});
