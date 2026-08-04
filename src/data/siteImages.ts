// Central image map for Touch Stone Properties
// All images are Bangalore-themed AI-generated premium real-estate visuals.

import welcome from "@/assets/images/hero/welcome.jpg";
import sell from "@/assets/images/hero/sell.jpg";
import sellPropertyConfidence from "@/assets/images/hero/sell-property-confidence.png";
import buy from "@/assets/images/hero/buy.jpg";
import rent from "@/assets/images/hero/rent.jpg";
import about from "@/assets/images/hero/about.jpg";
import skyline from "@/assets/images/hero/bangalore-skyline.jpg";
import aboutVilla from "@/assets/images/about/about-villa.png";
import aboutInterior from "@/assets/images/about/about-interior.png";
import aboutWhyChoose from "@/assets/images/about/about-why-choose.png";

import whitefieldVilla from "@/assets/images/properties/whitefield-villa.jpg";
import sarjapurTower from "@/assets/images/properties/sarjapur-tower.jpg";
import manyataApartment from "@/assets/images/properties/manyata-apartment.jpg";
import electronicCityGated from "@/assets/images/properties/electronic-city-gated.jpg";
import hebbalLakeview from "@/assets/images/properties/hebbal-lakeview.jpg";
import indiranagarApartment from "@/assets/images/properties/indiranagar-apartment.jpg";
import jpnagarApartment from "@/assets/images/properties/jpnagar-apartment.jpg";
import yelahankaVilla from "@/assets/images/properties/yelahanka-villa.jpg";
import kanakapuraPlot from "@/assets/images/properties/kanakapura-plot.jpg";
import northBangaloreTownship from "@/assets/images/properties/north-bangalore-township.jpg";
import bangaloreCommercial from "@/assets/images/properties/bangalore-commercial.jpg";
import luxuryInterior from "@/assets/images/properties/luxury-interior.jpg";
import sumadhuraEpitome from "@/assets/images/properties/sumadhura-epitome.png";
import sumadhuraPanorama from "@/assets/images/properties/sumadhura-panorama.png";
import sarangBySumadhura from "@/assets/images/properties/sarang-by-sumadhura.png";
import sumadhuraCapitolResidences from "@/assets/images/properties/sumadhura-capitol-residences.png";
import godrejLakesideOrchard from "@/assets/images/properties/godrej-lakeside-orchard.jpg";
import sumadhuraFoliumWhitefield from "@/assets/images/properties/sumadhura-folium-whitefield.png";
import arvindGreatLands from "@/assets/images/properties/arvind-great-lands.png";
import lodhaHosaRoad from "@/assets/images/properties/lodha-hosa-road.png";
import paradiseOnEarthVilla from "@/assets/images/properties/paradise-on-earth-villa.jpg";
import sobhaLogo from "@/assets/images/partners/sobha.png";
import rankaLogo from "@/assets/images/partners/ranka.png";
import prestigeLogo from "@/assets/images/partners/prestige.png";
import brigadeLogo from "@/assets/images/partners/brigade.png";
import embassyLogo from "@/assets/images/partners/embassy.png";
import snnLogo from "@/assets/images/partners/snn.png";
import puravankaraLogo from "@/assets/images/partners/puravankara.png";
import providentLogo from "@/assets/images/partners/provident.png";
import godrejLogo from "@/assets/images/partners/godrej.png";
import salarpuriaLogo from "@/assets/images/partners/salarpuria-sattva.png";
import lodhaLogo from "@/assets/images/partners/lodha.png";
import casaGrandeLogo from "@/assets/images/partners/casa-grande.png";
import associatedPartners from "@/assets/images/partners/associated-partners.png";
import aprRental1 from "@/assets/images/success-stories/apr-rental-1.png";
import aprRental2 from "@/assets/images/success-stories/apr-rental-2.png";
import aprRental3 from "@/assets/images/success-stories/apr-rental-3.png";
import villaBuy1 from "@/assets/images/success-stories/villa-buy-1.png";
import villaBuy2 from "@/assets/images/success-stories/villa-buy-2.png";
import villaBuy3 from "@/assets/images/success-stories/villa-buy-3.png";
import krishivi1 from "@/assets/images/success-stories/krishivi-1.png";
import krishivi2 from "@/assets/images/success-stories/krishivi-2.png";
import krishivi3 from "@/assets/images/success-stories/krishivi-3.png";

export const siteImages = {
  hero: {
    welcome,
    sell,
    sellPropertyConfidence,
    buy,
    rent,
    about,
    skyline,
  },
  about: {
    villa: aboutVilla,
    interior: aboutInterior,
    whyChoose: aboutWhyChoose,
  },
  properties: {
    whitefieldVilla,
    sarjapurTower,
    manyataApartment,
    electronicCityGated,
    hebbalLakeview,
    indiranagarApartment,
    jpnagarApartment,
    yelahankaVilla,
    kanakapuraPlot,
    northBangaloreTownship,
    bangaloreCommercial,
    luxuryInterior,
    sumadhuraEpitome,
    sumadhuraPanorama,
    sarangBySumadhura,
    sumadhuraCapitolResidences,
    godrejLakesideOrchard,
    sumadhuraFoliumWhitefield,
    arvindGreatLands,
    lodhaHosaRoad,
    paradiseOnEarthVilla,
  },
};

export const FALLBACK_PROPERTY_IMAGE = sumadhuraEpitome;

const localImageMap: Record<string, string> = {
  "sell-property-confidence.png": sellPropertyConfidence,
  "about-villa.png": aboutVilla,
  "about-interior.png": aboutInterior,
  "about-why-choose.png": aboutWhyChoose,
  "sumadhura-epitome.png": sumadhuraEpitome,
  "sumadhura-panorama.png": sumadhuraPanorama,
  "sarang-by-sumadhura.png": sarangBySumadhura,
  "sumadhura-capitol-residences.png": sumadhuraCapitolResidences,
  "godrej-lakeside-orchard.jpg": godrejLakesideOrchard,
  "godrej-lakeside-orchard.png": godrejLakesideOrchard,
  "sumadhura-folium-whitefield.png": sumadhuraFoliumWhitefield,
  "arvind-great-lands.png": arvindGreatLands,
  "lodha-hosa-road.png": lodhaHosaRoad,
  "paradise-on-earth-villa.jpg": paradiseOnEarthVilla,
  "sobha.png": sobhaLogo,
  "ranka.png": rankaLogo,
  "prestige.png": prestigeLogo,
  "brigade.png": brigadeLogo,
  "embassy.png": embassyLogo,
  "snn.png": snnLogo,
  "puravankara.png": puravankaraLogo,
  "provident.png": providentLogo,
  "godrej.png": godrejLogo,
  "salarpuria-sattva.png": salarpuriaLogo,
  "lodha.png": lodhaLogo,
  "casa-grande.png": casaGrandeLogo,
  "associated-partners.png": associatedPartners,
  "apr-rental-1.png": aprRental1,
  "apr-rental-2.png": aprRental2,
  "apr-rental-3.png": aprRental3,
  "villa-buy-1.png": villaBuy1,
  "villa-buy-2.png": villaBuy2,
  "villa-buy-3.png": villaBuy3,
  "krishivi-1.png": krishivi1,
  "krishivi-2.png": krishivi2,
  "krishivi-3.png": krishivi3,
};

export function resolveLocalImage(src: string | null | undefined, fallback = FALLBACK_PROPERTY_IMAGE) {
  if (!src) return fallback;
  const path = src.includes("assets-v1/") ? new URL(src, "https://local.invalid").pathname : src;
  const filename = path.split("/").pop() ?? "";
  if (src.includes("assets-v1/")) return localImageMap[filename] ?? fallback;
  // Allow DB-stored filenames (e.g. "sumadhura-epitome.png") to resolve to bundled assets.
  if (filename && localImageMap[filename]) return localImageMap[filename];
  return src;
}

// Ordered list of all 10 hot Bangalore property images (for cards / fallback galleries)
export const propertyImageList: string[] = [
  whitefieldVilla,
  sarjapurTower,
  manyataApartment,
  electronicCityGated,
  hebbalLakeview,
  indiranagarApartment,
  jpnagarApartment,
  yelahankaVilla,
  kanakapuraPlot,
  northBangaloreTownship,
];

// Initial-based avatar generated inline so it never depends on an external image service.
export function initialsAvatar(name: string, bg = "B8962E", color = "ffffff") {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><rect width="256" height="256" rx="128" fill="#${bg}"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="82" font-weight="700" fill="#${color}">${initials}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
