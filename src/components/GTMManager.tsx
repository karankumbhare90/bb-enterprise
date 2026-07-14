"use client";

import { useEffect } from "react";

export default function GTMManager({ gtmId, gaId }: { gtmId?: string; gaId?: string }) {
  useEffect(() => {
    let initialized = false;

    const initScripts = () => {
      if (initialized) return;
      initialized = true;

      // Initialize GTM if provided
      if (gtmId) {
        (function(w: any, d, s, l, i) {
          w[l] = w[l] || [];
          w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
          const f = d.getElementsByTagName(s)[0];
          const j = d.createElement(s) as HTMLScriptElement;
          const dl = l !== "dataLayer" ? "&l=" + l : "";
          j.async = true;
          j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
          if (f && f.parentNode) {
            f.parentNode.insertBefore(j, f);
          } else {
            d.head.appendChild(j);
          }
        })(window, document, "script", "dataLayer", gtmId);
      }

      // Initialize GA4 (GTAG) if provided
      if (gaId) {
        // Create the gtag library script
        const gtagScript = document.createElement("script");
        gtagScript.async = true;
        gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=" + gaId;
        document.head.appendChild(gtagScript);

        // Create the inline config script
        (window as any).dataLayer = (window as any).dataLayer || [];
        function gtag(){(window as any).dataLayer.push(arguments);}
        // @ts-ignore
        gtag('js', new Date());
        // @ts-ignore
        gtag('config', gaId);
      }

      // Remove event listeners once initialized
      removeListeners();
    };

    const listeners = ["mousemove", "scroll", "keydown", "click", "touchstart"];

    const addListeners = () => {
      listeners.forEach((event) => {
        window.addEventListener(event, initScripts, { passive: true, once: true });
      });
    };

    const removeListeners = () => {
      listeners.forEach((event) => {
        window.removeEventListener(event, initScripts);
      });
    };

    addListeners();

    // Fallback: load after a certain time if no interaction
    const timeout = setTimeout(initScripts, 5000);

    return () => {
      removeListeners();
      clearTimeout(timeout);
    };
  }, [gtmId, gaId]);

  return null;
}
