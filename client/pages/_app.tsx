import type { AppProps } from "next/app";
import "../components/ui/global.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
