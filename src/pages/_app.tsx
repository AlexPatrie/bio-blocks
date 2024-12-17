import type { AppProps } from "next/app";
import "../styles/globals.css";
import { useEffect, useState } from "react";

function BioBlocksApp({ Component, pageProps }: AppProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient ? <Component {...pageProps} /> : <h1>Not Rendered.</h1>;
}

export default BioBlocksApp;
