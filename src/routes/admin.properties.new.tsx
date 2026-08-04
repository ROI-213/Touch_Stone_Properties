import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { createProperty, addPropertyImage, setPropertyAmenities } from "@/lib/admin-properties";
import { saveAssignments } from "@/lib/property-assignments";

export const Route = createFileRoute("/admin/properties/new")({
  component: NewProperty,
});

function NewProperty() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const m = useMutation({
    mutationFn: async ({ values, images, amenityIds, assignments }: any) => {
      const created = await createProperty(values);
      for (const img of images) {
        await addPropertyImage(created.id, img.url, img.image_type, img.caption || "");
      }
      await setPropertyAmenities(created.id, amenityIds);
      await saveAssignments(created.id, assignments ?? []);
      return created;
    },
    onSuccess: (p) => {
      toast.success("Property created");
      qc.invalidateQueries({ queryKey: ["admin-properties"] });
      qc.invalidateQueries({ queryKey: ["public-properties"] });
      qc.invalidateQueries({ queryKey: ["recent-property-notifications"] });
      navigate({ to: "/admin/properties/$id", params: { id: p.id } });
    },
    onError: (e: any) => toast.error(e.message || "Failed to create"),
  });

  return (
    <div>
      <Link to="/admin/properties" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
        <ChevronLeft size={14} /> Back to properties
      </Link>
      <h1 className="mt-2 font-display text-3xl font-bold text-[#0a1f44]">New Property</h1>
      <p className="mt-1 text-sm text-slate-500">Fill in the details and save — it goes live on the site immediately.</p>
      <div className="mt-6">
        <PropertyForm
          onSubmit={async (values, images, amenityIds, assignments) => { await m.mutateAsync({ values, images, amenityIds, assignments }); }}
          submitting={m.isPending}
          submitLabel="Create Property"
        />
      </div>
    </div>
  );
}
