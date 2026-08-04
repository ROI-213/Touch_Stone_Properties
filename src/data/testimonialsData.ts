export type TestimonialCategory = "Buyer" | "Seller" | "Tenant" | "Owner";
export type TestimonialPropertyType = "Buy" | "Sell" | "Rent";

export interface ClientTestimonial {
  id: string;
  name: string;
  location: string;
  photo?: string;
  rating: number;
  text: string;
  category: TestimonialCategory;
  propertyType: TestimonialPropertyType;
  featured?: boolean;
}

export const clientTestimonials: ClientTestimonial[] = [
  { id: "t1", name: "Ramesh Kumar", location: "Whitefield, Bangalore", rating: 5, category: "Buyer", propertyType: "Buy", featured: true,
    text: "Touch Stone Properties helped me find a verified apartment in Whitefield within my budget. The team was transparent, professional, and very supportive throughout the process." },
  { id: "t2", name: "Priya Nair", location: "Indiranagar, Bangalore", rating: 5, category: "Tenant", propertyType: "Rent",
    text: "I was looking for a rental home close to my workplace. Touch Stone Properties shortlisted the right options and arranged visits quickly. The entire rental process was smooth." },
  { id: "t3", name: "Suresh Reddy", location: "Sarjapur Road, Bangalore", rating: 5, category: "Seller", propertyType: "Sell",
    text: "The team helped me sell my property with proper market guidance and serious buyer enquiries. Their support during negotiation and documentation was excellent." },
  { id: "t4", name: "Anjali Sharma", location: "Jayanagar, Bangalore", rating: 5, category: "Buyer", propertyType: "Buy",
    text: "We wanted a family-friendly apartment with good amenities. Touch Stone Properties understood our requirements clearly and helped us choose the right property." },
  { id: "t5", name: "Mohammed Imran", location: "Electronic City, Bangalore", rating: 4.9, category: "Owner", propertyType: "Rent",
    text: "As a property owner, I wanted genuine tenants. Touch Stone Properties helped me list the property professionally and connected me with verified tenant enquiries." },
  { id: "t6", name: "Deepak Menon", location: "HSR Layout, Bangalore", rating: 5, category: "Buyer", propertyType: "Buy",
    text: "Their property suggestions were accurate and practical. I liked the way they explained location benefits, pricing, and documentation clearly." },
  { id: "t7", name: "Kavya Gowda", location: "Marathahalli, Bangalore", rating: 5, category: "Tenant", propertyType: "Rent",
    text: "The rental options shown to me were clean, verified, and matched my budget. The team made the process simple and stress-free." },
  { id: "t8", name: "Naveen Rao", location: "Koramangala, Bangalore", rating: 5, category: "Seller", propertyType: "Sell",
    text: "Touch Stone Properties gave me proper pricing advice and helped attract genuine buyers. Their communication was very professional." },
  { id: "t9", name: "Meera Iyer", location: "JP Nagar, Bangalore", rating: 4.8, category: "Buyer", propertyType: "Buy",
    text: "They helped us compare multiple properties and choose the right one. Their legal and loan assistance made the process much easier." },
  { id: "t10", name: "Arun Prakash", location: "Hebbal, Bangalore", rating: 5, category: "Owner", propertyType: "Rent",
    text: "I listed my property with Touch Stone Properties and received genuine rental enquiries. The team managed coordination very well." },
  { id: "t11", name: "Neha Kulkarni", location: "Bannerghatta Road, Bangalore", rating: 5, category: "Buyer", propertyType: "Buy",
    text: "The team was patient, transparent, and knowledgeable. They helped us understand each property properly before making a final decision." },
  { id: "t12", name: "Vikram Shetty", location: "Yelahanka, Bangalore", rating: 5, category: "Seller", propertyType: "Sell",
    text: "I had a great experience selling my property through Touch Stone Properties. Their buyer coordination and closing support were very helpful." },
];

export function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}
