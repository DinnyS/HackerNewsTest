import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function PageLoader() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const startLoading = () => setLoading(true);
    const endLoading = () => setLoading(false);

    router.events.on("routeChangeStart", startLoading);
    router.events.on("routeChangeComplete", endLoading);

    return () => {
      router.events.off("routeChangeStart", startLoading);
      router.events.off("routeChangeComplete", endLoading);
    };
  }, []);

  if (!loading) return null;

  return (
      <div className="loading-container">
        <div className="loader"></div>
        <p className="loading-text">Loading...</p>
      </div>
  );
}
