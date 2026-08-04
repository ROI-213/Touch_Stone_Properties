export type StoryType = "Rent" | "Buy" | "Sell" | "Property Management";

import aprRental1 from "@/assets/images/success-stories/apr-rental-1.png";
import aprRental2 from "@/assets/images/success-stories/apr-rental-2.png";
import aprRental3 from "@/assets/images/success-stories/apr-rental-3.png";
import villaBuy1 from "@/assets/images/success-stories/villa-buy-1.png";
import villaBuy2 from "@/assets/images/success-stories/villa-buy-2.png";
import villaBuy3 from "@/assets/images/success-stories/villa-buy-3.png";
import krishivi1 from "@/assets/images/success-stories/krishivi-1.png";
import krishivi2 from "@/assets/images/success-stories/krishivi-2.png";
import krishivi3 from "@/assets/images/success-stories/krishivi-3.png";

export interface SuccessStory {
  id: string;
  slug?: string;
  title: string;
  category: string;
  clientName: string;
  clientLabel?: string;
  badgeText?: string;
  storyType: StoryType;
  description: string;
  fullStory: string;
  images: string[];
  location: string;
  ctaText: string;
  buttonText?: string;
  contactLink?: string;
  whatsappLink?: string;
  services?: string[];
}

export const successStories: SuccessStory[] = [
  {
    id: "apr-rental-aayush",
    title: "Rental House @ Adarsh Palm Retreat",
    category: "Property Management / Rental Success",
    clientName: "Mr. Aayush",
    storyType: "Rent",
    location: "Adarsh Palm Retreat, Bellandur, Bangalore",
    description:
      "Mr. Aayush was searching for rental accommodation in Adarsh Palm Retreat. Touchstone Properties helped him find the right flat at the right price and complete the process smoothly.",
    fullStory:
      "Our client Mr. Aayush approached Touchstone Properties looking for the perfect rental within Adarsh Palm Retreat. We curated handpicked options matching his lifestyle, budget and family needs, negotiated terms with the owner, drafted the rental agreement and supported the entire onboarding process — from token advance to handover. A seamless move-in, with zero stress.",
    images: [aprRental1, aprRental2, aprRental3],
    services: ["Tenant Sourcing", "Property Walkthroughs", "Rental Agreement", "Move-in Coordination"],
    ctaText: "View Rental Success",
  },
  {
    id: "villa-bangalore-east",
    title: "Villa Search in Bangalore East",
    category: "Villa Buying Success",
    clientName: "Bangalore East Client",
    storyType: "Buy",
    location: "Adarsh Palm Retreat, Bangalore East",
    description:
      "A client residing in Bangalore East was searching for a villa in APR. Touchstone Properties helped the client find and buy a villa at a very reasonable cost.",
    fullStory:
      "Our client wanted a premium villa in Adarsh Palm Retreat that matched both lifestyle aspirations and long-term investment value. Our team shortlisted off-market villas, arranged private tours, negotiated aggressively on price, and supported documentation through registration — closing the deal at a remarkably reasonable cost.",
    images: [villaBuy1, villaBuy2, villaBuy3],
    services: ["Off-Market Sourcing", "Site Visits", "Price Negotiation", "Documentation & Registration"],
    ctaText: "View Buying Success",
  },
  {
    id: "krishivi-gavakshi-bellandur",
    title: "2BHK Flat @ Krishivi Gavakshi, Bellandur",
    category: "Buy & Sell Success",
    clientName: "Mr. Vijay (Seller) & Mr. Adithya Dewan (Buyer)",
    storyType: "Sell",
    location: "Krishivi Gavakshi, Bellandur, Bangalore",
    description:
      "One of our clients wanted to sell his 2BHK property in Krishivi Gavakshi, Bellandur. Touchstone Properties managed the complete process — legal, ATS, sale deed, registration and E-Khata assistance.",
    fullStory:
      "Mr. Vijay entrusted us with selling his 2BHK at Krishivi Gavakshi, Bellandur. We marketed the unit, sourced a qualified buyer in Mr. Adithya Dewan, and orchestrated the entire transaction end-to-end — legal due diligence, Agreement to Sell, Sale Deed drafting, sub-registrar coordination, and post-sale E-Khata assistance. Both parties closed the deal with confidence and clarity.",
    images: [krishivi1, krishivi2, krishivi3],
    services: ["Legal Support", "ATS Drafting", "Sale Deed", "Sub-Registrar Coordination", "E-Khata Assistance"],
    ctaText: "View Sale Success",
  },
];
