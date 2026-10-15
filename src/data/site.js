export const SITE = {
  name: "Hima by Menzel",
  tagline: "Asian Fusion Bistro & Suites",
  place: "Kintamani · Bali",
  whatsapp: "+628213849221", // digits only, with country code, no + sign
  phone: "082 1384 9221",
  instagram: "himabymenzel",
  email: "himabymenzel@gmail.com",
  addressLines: [
    "Jl. Raya Penelokan No. 890",
    "Batur Selatan, Kintamani, Bangli, Bali 80652",
  ],
  addressShort: "Penelokan, Kintamani, Bali",
  mapsQuery: "Hima by Menzel Kintamani",
  hours: "Open daily · 05:30 AM — 09:00 PM",
  hoursShort: "OPEN DAILY  05:30 AM — 09:00 PM",
};

// Cloudinary delivery: f_auto picks the best format, q_auto the quality,
// w_1600 caps the width (some originals are 7000px wide).
const CLD = "https://res.cloudinary.com/dimnv9sq5/image/upload/f_auto,q_auto,w_1600";

// One entry per folder inside HimaSuites on Cloudinary.
// NOTE: prices below are placeholders - replace them with your real rates.
export const suites = [
  {
    name: "Hima Suites",
    sleeps: "Sleeps 2 to 4",
    blurb:
      "Our signature stay, with generous space, soft light and the quiet of the Kintamani highlands right outside.",
    features: ["King bed", "Sitting area", "Hot shower", "Breakfast included"],
    price: "Rp 2.2M",
    variant: 1,
    images: [
      `${CLD}/v1792070143/10_ewc4af.jpg`,
      `${CLD}/v1792070146/12_ow11rh.jpg`,
      `${CLD}/v1792070149/DSC06260_ihz1hf.jpg`,
      `${CLD}/v1792070152/DSC06265_bqnux3.jpg`,
    ],
  },
  {
    name: "Luxury Suite",
    sleeps: "Sleeps 2 to 3",
    blurb:
      "Our most refined room, with a king bed, warm finishes and space to settle in after a day in the hills.",
    features: ["King bed", "Lounge corner", "Hot shower", "Breakfast included"],
    price: "Rp 1.8M",
    variant: 2,
    images: [
      `${CLD}/v1792070160/DSC08852_i8b2uj.jpg`,
      `${CLD}/v1792070165/DSC08853_gtvmha.jpg`,
      `${CLD}/v1792070167/DSC08876_y7ctad.jpg`,
      `${CLD}/v1792070168/DSC08885_mtmqxs.jpg`,
      `${CLD}/v1792070171/DSC08889_vqzopq.jpg`,
    ],
  },
  {
    name: "Family Suite",
    sleeps: "Sleeps 4",
    blurb:
      "Plenty of room for four, with separate sleeping areas and a shared space to relax together.",
    features: ["Two beds", "Shared lounge", "Hot shower", "Breakfast included"],
    price: "Rp 2M",
    variant: 3,
    images: [
      `${CLD}/v1792070107/12_abnipz.jpg`,
      `${CLD}/v1792070111/DSC06260_jrjckn.jpg`,
      `${CLD}/v1792070113/DSC06265_mct7se.jpg`,
    ],
  },
  {
    name: "Deluxe Suite",
    sleeps: "Sleeps 2",
    blurb:
      "A comfortable, well-lit room with a king bed and a little extra space to unwind.",
    features: ["King bed", "Writing desk", "Hot shower", "Breakfast included"],
    price: "Rp 1.1M",
    variant: 1,
    images: [
      `${CLD}/v1792070091/1_hvlawa.jpg`,
      `${CLD}/v1792070095/DSC06382_lvkksr.jpg`,
      `${CLD}/v1792070097/DSC08852_tzalsv.jpg`,
    ],
  },
  {
    name: "Premium Suite",
    sleeps: "Sleeps 2 to 3",
    blurb:
      "A bright, spacious room with a king bed, a sitting area and big windows that bring in the cool mountain air.",
    features: ["King bed", "Sitting area", "Hot shower", "Breakfast included"],
    price: "Rp 1.4M",
    variant: 2,
    images: [
      `${CLD}/v1792069761/10_peendt.jpg`,
      `${CLD}/v1792069763/12_qpwjti.jpg`,
      `${CLD}/v1792069766/DSC06260_wihr9v.jpg`,
      `${CLD}/v1792069766/DSC06265_rvkq8p.jpg`,
    ],
  },
  {
    name: "Hill Suite",
    sleeps: "Sleeps 2",
    blurb:
      "A cosy hideaway tucked into the hillside, made for slow mornings and cool, quiet evenings.",
    features: ["King bed", "Hill views", "Hot shower", "Breakfast included"],
    price: "Rp 950K",
    variant: 3,
    images: [
      `${CLD}/v1792070123/DSC06260_rtkqwn.jpg`,
      `${CLD}/v1792070126/DSC06265_o6lwqp.jpg`,
    ],
  },
  {
    name: "Regular Suite",
    sleeps: "Sleeps 2",
    blurb:
      "A calm, simple room with everything you need for a restful night in Kintamani.",
    features: ["Queen bed", "Hot shower", "Breakfast included"],
    price: "Rp 850K",
    variant: 1,
    images: [
      `${CLD}/v1792069793/1_xcbw2d.jpg`,
      `${CLD}/v1792069795/DSC06382_ktxjzj.jpg`,
    ],
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