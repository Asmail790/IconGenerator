import { z } from "zod";

const metallic ="metallic" as const
const polygonic ="polygonic" as const
const pixelated ="pixelated" as const
const clayey ="clayey" as const
const gradient ="gradient" as const
const flat ="flat" as const
const illustrated ="illustrated" as const

export const styles = [
  metallic,
  polygonic,
  pixelated,
  clayey,
  gradient,
  flat,
  illustrated,
] as const;

export const styleValidator = z.union([
  z.literal(metallic),
  z.literal(polygonic),
  z.literal(pixelated),
  z.literal(clayey),
  z.literal(gradient),
  z.literal(polygonic),
  z.literal(flat),
  z.literal(illustrated),
]);

export type TStyle = (typeof styles)[number];

export function isTStyle(value: string): value is TStyle {
  if (styles.includes(value)) {
    return true;
  }
  return false;
}
