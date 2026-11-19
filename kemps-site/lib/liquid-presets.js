// Shared presets for <LiquidImage>. Kept out of the "use client" module so server components can read them.
/** Presets measured on the source images (fractions of width/height). */
export const SPLASH_BOTTLE = [0.36, 0.02, 0.745, 0.99];
/** Kemp's 1 L bottle photo: protect box in the bottle's own (upright) frame, plus its tilt in radians. */
export const KEMPS_BOTTLE = { protect: [0.35, 0.15, 0.705, 1.03], angle: 0.28 };
/** Photoreal hero shot: bottle standing in the lake (protect box + lean), ripples spread from its base. */
export const HERO_SHOT = { protect: [0.585, 0.12, 0.775, 0.79], angle: -0.14, center: [0.665, 0.745], focus: [0.64, 0.5], focusMobile: [0.69, 0.5] };
export const DROPLET = { center: [0.5, 0.62], drop: [0.5, 0.28, 0.06] };

