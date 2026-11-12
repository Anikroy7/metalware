export const THEMES = ["stage", "heritage", "studio"] as const;
export type Theme = (typeof THEMES)[number];

export const THEME_STORAGE_KEY = "metal-world:theme";

export function isTheme(value: unknown): value is Theme {
  return THEMES.includes(value as Theme);
}

/** Runs in <head> before first paint so a saved theme never flashes the default. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(${JSON.stringify(
  THEMES.filter((t) => t !== "stage"),
)}.indexOf(t)>-1)document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
