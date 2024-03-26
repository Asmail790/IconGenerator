export const styles = [
  "metallic",
  "polygonic",
  "pixelated",
  "clayey",
  "gradient",
  "flat",
  "illustrated",
] as const;

export type TStyle = (typeof styles)[number];


export function isTStyle(value:string):value is TStyle {
  if (styles.includes(value)){
    return true
  }
  return false
}