import { useQuery } from "@tanstack/react-query";
import { getNewEnquiryCount } from "@/lib/enquiries";

export function useEnquiryCount() {
  const q = useQuery({
    queryKey: ["enquiry-new-count"],
    queryFn: getNewEnquiryCount,
    refetchInterval: 30_000,
    staleTime: 15_000,
  });
  return q.data ?? 0;
}
