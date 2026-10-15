/* ---------------------------- PHOTO SLOTS -------------------------------
   Leave any of these as "" to show a drawn placeholder instead. Files are
   expected under the public/ folder, matching the rest of the project
   (public/Images, public/Images/HimaResto, public/videos). */

export const HERO_VIDEO = {
  desktop:
    "https://res.cloudinary.com/dimnv9sq5/video/upload/v1791960014/revisi_2_1_q1ugdw.mp4",
  mobile:
    "https://res.cloudinary.com/dimnv9sq5/video/upload/v1791960014/revisi_2_1_q1ugdw.mp4",
};

export const HERO_POSTER = {
  desktop:
    "https://res.cloudinary.com/dimnv9sq5/video/upload/so_2,w_1600,q_auto/v1789888455/HimaRestaurant_xz3rpf.jpg",
  mobile:
    "https://res.cloudinary.com/dimnv9sq5/video/upload/so_2,w_800,q_auto/v1789888455/HimaRestaurant1_yj94cx.jpg",
};

export const EXPERIENCE_VIDEO =
  "https://res.cloudinary.com/dimnv9sq5/video/upload/v1792051289/revisi_3_1_ugbtj1.mp4"; // section 01, right-hand video

// First frame of the video, shown while it loads (same trick as your hero poster)
export const EXPERIENCE_VIDEO_POSTER =
  "https://res.cloudinary.com/dimnv9sq5/video/upload/so_0,w_1200,q_auto/v1792051289/revisi_3_1_ugbtj1.jpg";
export const DINING_PHOTO = "/Images/HimaResto/DineImage.jpeg"; // section 02, full-bleed background

export const SUITE_STRIP_PHOTOS = [
  "https://res.cloudinary.com/dimnv9sq5/image/upload/f_auto,q_auto/v1792067170/Screenshot_2026-10-15_at_5.54.33_PM_rhnnyw.png", // 1
  "https://res.cloudinary.com/dimnv9sq5/image/upload/f_auto,q_auto/v1792067167/Screenshot_2026-10-15_at_5.54.51_PM_sxcaih.png", // 2
  "https://res.cloudinary.com/dimnv9sq5/image/upload/f_auto,q_auto/v1792067165/Screenshot_2026-10-15_at_5.54.43_PM_o04yng.png", // 3
  "https://res.cloudinary.com/dimnv9sq5/image/upload/f_auto,q_auto/v1792067166/Screenshot_2026-10-15_at_5.54.57_PM_udatfa.png", // 4
  "https://res.cloudinary.com/dimnv9sq5/image/upload/f_auto,q_auto/v1792067168/Screenshot_2026-10-15_at_5.55.19_PM_fxgzkm.png", // 5
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