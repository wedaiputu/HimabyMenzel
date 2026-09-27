export const SITE = {
  name: "Hima by Menzel",
  tagline: "Asian Fusion Bistro & Suites",
  place: "Kintamani · Bali",
  whatsapp: "+628213849221", // digits only, with country code, no + sign
  phone: "+628213849221",
  instagram: "himabymenzel",
  email: "hello@himabymenzel.com",
  addressLines: [
    "Jl. Raya Penelokan No. 890",
    "Batur Selatan, Kintamani, Bangli, Bali 80652",
  ],
  addressShort: "Penelokan, Kintamani, Bali",
  mapsQuery: "Hima by Menzel Kintamani",
  hours: "Open daily · 05:30 AM — 09:00 PM",
  hoursShort: "OPEN DAILY  05:30 AM — 09:00 PM",
};

export const suites = [
  {
    name: "Hima Suite",
    sleeps: "Sleeps 2",
    blurb:
      "A calm room with a king bed, a writing desk and a hot shower for cool mornings.",
    features: ["King bed", "Hot shower", "Breakfast included"],
    price: "Rp 850K",
    variant: 2,
    images: [
      "/Images/HimaVenue1.jpg",
      "/Images/HimaVenue2.jpg",
      "/Images/HimaVenue3.jpg",
    ],
  },
  {
    name: "Menzel Suite",
    sleeps: "Sleeps 2 to 3",
    blurb:
      "More room to spread out, with a sitting area and a wide window facing the hills.",
    features: ["King bed and daybed", "Sitting area", "Breakfast included"],
    price: "Rp 1.2M",
    variant: 3,
    images: ["/Images/HimaVenue4.jpg", "/Images/HimaVenue5.jpg"],
  },
  {
    name: "Family Suite",
    sleeps: "Sleeps 4",
    blurb:
      "Two bedrooms and a shared lounge, made for four people who want to stay close.",
    features: ["Two bedrooms", "Private lounge", "Breakfast included"],
    price: "Rp 1.8M",
    variant: 1,
    images: ["/Images/HimaVenue6.jpg", "/Images/HimaVenue7.jpg"],
  },
];

const NUMBER_WORDS = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
];
export const suiteCountWord = NUMBER_WORDS[suites.length] || String(suites.length);

export const wa = (text) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;