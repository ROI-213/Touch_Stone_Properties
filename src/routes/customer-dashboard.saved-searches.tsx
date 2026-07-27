import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPanel } from "@/components/dashboard/PlaceholderPanel";

export const Route = createFileRoute("/customer-dashboard/saved-searches")({
  component: () => (
    <PlaceholderPanel
      eyebrow="Saved Searches"
      title="My Saved Searches"
      subtitle="Save your search filters to revisit them in one click."
    />
  ),
});
