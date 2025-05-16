// pages/_app.tsx
import type { AppProps } from "next/app";
import { useEffect } from "react";
import "../components/ui/global.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => console.log("SW registered:", reg.scope))
          .catch((err) => console.error("SW registration failed:", err));
      });
    }
  }, []);

  return <Component {...pageProps} />;
}
