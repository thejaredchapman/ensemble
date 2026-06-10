// Accent color profiles, derived from the original fixed palette.
// Each accent keeps its hue offset, saturation, and lightness relative to
// accent-1's hue, so rotating the base hue recolors the whole gradient
// theme while preserving the existing look and contrast.
const ACCENT_PROFILES = {
  dark: {
    defaultHue: 255,
    accents: [
      { offset: 0, sat: 92, light: 76 },
      { offset: 74, sat: 86, light: 70 },
      { offset: -42, sat: 94, light: 68 },
    ],
  },
  light: {
    defaultHue: 262,
    accents: [
      { offset: 0, sat: 83, light: 58 },
      { offset: 71, sat: 71, light: 51 },
      { offset: -41, sat: 83, light: 53 },
    ],
  },
};

export function getDefaultHue(theme) {
  return ACCENT_PROFILES[theme].defaultHue;
}

export function computeAccentVars(hue, theme) {
  const profile = ACCENT_PROFILES[theme];
  const vars = {};
  profile.accents.forEach(({ offset, sat, light }, i) => {
    const h = ((hue + offset) % 360 + 360) % 360;
    vars[`--accent-${i + 1}`] = `hsl(${h}, ${sat}%, ${light}%)`;
  });
  return vars;
}
