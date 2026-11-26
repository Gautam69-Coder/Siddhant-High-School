import { useCallback, useEffect, useRef, useState } from "react";

const readLocation = () => ({
  pathname: window.location.pathname.replace(/\/+$/, "") || "/",
  search: window.location.search,
});

export default function useClientNavigation(onLocationChange) {
  const [location, setLocation] = useState(readLocation);
  const cleanupCallbacks = useRef(new Set());

  const runNavigationCleanups = useCallback(() => {
    cleanupCallbacks.current.forEach((cleanup) => cleanup());
  }, []);

  const registerNavigationCleanup = useCallback((cleanup) => {
    cleanupCallbacks.current.add(cleanup);
    return () => cleanupCallbacks.current.delete(cleanup);
  }, []);

  const navigate = useCallback((to, { replace = false } = {}) => {
    const url = new URL(to, window.location.origin);
    const nextLocation = {
      pathname: url.pathname.replace(/\/+$/, "") || "/",
      search: url.search,
    };
    const nextUrl = `${nextLocation.pathname}${nextLocation.search}`;
    window.history[replace ? "replaceState" : "pushState"]({}, "", nextUrl);
    setLocation(nextLocation);
    onLocationChange?.(nextLocation);
    runNavigationCleanups();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [onLocationChange, runNavigationCleanups]);

  const replaceLocation = useCallback((to) => {
    const url = new URL(to, window.location.origin);
    const nextLocation = {
      pathname: url.pathname.replace(/\/+$/, "") || "/",
      search: url.search,
    };
    window.history.replaceState({}, "", `${nextLocation.pathname}${nextLocation.search}`);
    setLocation(nextLocation);
    onLocationChange?.(nextLocation);
  }, [onLocationChange]);

  useEffect(() => {
    const handlePopState = () => {
      const nextLocation = readLocation();
      setLocation(nextLocation);
      onLocationChange?.(nextLocation);
      runNavigationCleanups();
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [onLocationChange, runNavigationCleanups]);

  return { location, navigate, replaceLocation, registerNavigationCleanup };
}
