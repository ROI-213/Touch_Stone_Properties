import { createFileRoute } from "@tanstack/react-router";
import { AdminStubPage } from "@/components/admin/AdminStubPage";

export const Route = createFileRoute("/admin/compare")({
  component: () => (
    <AdminStubPage
      title="Compare"
      description="Side-by-side property comparisons created by visitors will appear here."
    />
  ),
});
