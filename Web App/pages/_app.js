import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import Script from "next/script";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  const [sdkLoaded, setSdkLoaded] = useState(false);

  useEffect(() => {
    console.log("✅ Checking Cashfree SDK...");

    const loadCashfreeSDK = () => {
      if (window.Cashfree && typeof window.Cashfree.init === "function") {
        console.log("✅ Cashfree SDK Already Loaded");
        setSdkLoaded(true);
      } else {
        console.log("🚀 Injecting Cashfree SDK...");

        // Remove existing script if any
        const existingScript = document.querySelector('script[src="https://sdk.cashfree.com/js/v3/cashfree.js"]');
        if (existingScript) existingScript.remove();

        // Create and append the new script
        const script = document.createElement("script");
        script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
        script.async = true;
        script.onload = () => {
          console.log("✅ Cashfree SDK Loaded!");
          setSdkLoaded(true);
        };
        script.onerror = () => console.error("❌ Cashfree SDK Failed to Load");
        document.body.appendChild(script);
      }
    };

    loadCashfreeSDK();
  }, []);

  return (
    <>
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} sdkLoaded={sdkLoaded} />
      </SessionProvider>
    </>
  );
}
