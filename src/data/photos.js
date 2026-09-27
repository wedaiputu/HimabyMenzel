/* ---------------------------- PHOTO SLOTS -------------------------------
   Leave any of these as "" to show a drawn placeholder instead. Files are
   expected under the public/ folder, matching the rest of the project
   (public/Images, public/Images/HimaResto, public/videos). */

export const HERO_VIDEO = {
  desktop:
    "https://res.cloudinary.com/dimnv9sq5/video/upload/v1789888455/HimaRestaurant_xz3rpf.mp4",
  mobile:
    "https://res.cloudinary.com/dimnv9sq5/video/upload/v1789888455/HimaRestaurant1_yj94cx.mp4",
};

export const HERO_POSTER = {
  desktop:
    "https://res.cloudinary.com/dimnv9sq5/video/upload/so_2,w_1600,q_auto/v1789888455/HimaRestaurant_xz3rpf.jpg",
  mobile:
    "https://res.cloudinary.com/dimnv9sq5/video/upload/so_2,w_800,q_auto/v1789888455/HimaRestaurant1_yj94cx.jpg",
};

export const EXPERIENCE_PHOTO =
  "https://res.cloudinary.com/dimnv9sq5/image/upload/v1790495733/Pixflux.AI_1790495670687_1_cbi0o3.png"; // section 01, right-hand photo
export const DINING_PHOTO = "/Images/HimaResto/DineImage.jpeg"; // section 02, full-bleed background

export const SUITE_STRIP_PHOTOS = [
  "/Images/HimaVenue2.jpg",
  "/Images/HimaVenue4.jpg",
  "/Images/HimaVenue5.jpg",
  "/Images/HimaVenue6.jpg",
  "/Images/HimaVenue7.jpg",
];

export const EVENTS_PHOTO = "https://res.cloudinary.com/dimnv9sq5/image/upload/v1790503185/Hapus_Tombol_Event_1_zecdpd.png"; // section 04, event setup photo
export const BEAUTY_PHOTOS = {
  left: "https://res.cloudinary.com/dimnv9sq5/image/upload/v1790503429/Screenshot_2026-09-27_at_3.31.52_PM_nvdfyu.png", // guests relaxing, overlooking the caldera
  right: "https://res.cloudinary.com/dimnv9sq5/image/upload/v1790503431/Screenshot_2026-09-27_at_3.32.05_PM_oh3wxw.png", // a celebration on the terrace
};

export const HERO_SECTION_VIDEO_POSTER_ALT = "Hima by Menzel, seen from the terrace";

// Logo shown over the hero video's middle panel. Put the file in your public
// folder (public/Images/HimaLogo.png) — reference it here by its web path,
// not the full disk path. Falls back to a drawn mark + wordmark if it 404s.
export const HERO_LOGO = "/Images/HimaLogo.png";