// somewhere global (e.g. types/gtag.d.ts)
declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
  }
}
