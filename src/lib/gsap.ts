"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Registering here — and importing gsap only through this module — keeps a
// single registration point and keeps every plugin out of the server bundle.
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/**
 * The `prefers-reduced-motion` block in globals.css only neutralises CSS
 * animations and transitions. GSAP writes inline styles from JS and sails
 * straight through it, so every animation has to branch on this explicitly.
 */
export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
export const FULL_MOTION = "(prefers-reduced-motion: no-preference)";

/** Matches the `xl:` hover gate used across the components. */
export const DESKTOP_HOVER = "(min-width: 1280px) and (hover: hover)";

export { gsap, useGSAP, ScrollTrigger, SplitText };
