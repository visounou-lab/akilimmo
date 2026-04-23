declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, any>
) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params || {});
}

// Exemple d'utilisation future (quand on aura les IDs conversion) :
// trackEvent("conversion", {
//   send_to: "AW-17185310519/XXXXX",
//   value: 10.0,
//   currency: "XOF",
// });

export function trackContactFormSubmit() {
  trackEvent("conversion", {
    send_to: "AW-17185310519/HojbCMPC2t0aELeOzIJA",
  });
}

export function trackPageView(url: string) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("config", "AW-17185310519", {
    page_path: url,
  });
}
