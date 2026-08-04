import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  beforeLoad: () => {
    // Default landing – the AdminGate + sidebar will handle
    // routing staff to their permitted modules.
    // Admins go to properties, staff will be redirected by AdminGate
    // to /admin/tasks (their default allowed page).
    throw redirect({ to: "/admin/properties" });
  },
});
