import { useEffect } from "react";

// Keeps a phone's screen on while `wanted`; the browser drops the lock on a hidden tab, so it's asked for again on return.
export function useWakeLock(wanted: boolean) {
  useEffect(() => {
    if (!wanted || !("wakeLock" in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    let done = false;
    const request = () => {
      navigator.wakeLock
        .request("screen")
        .then((granted) => {
          if (done) void granted.release();
          else lock = granted;
        })
        .catch(() => {});
    };
    const onVisibilityChange = () => {
      if (!document.hidden) request();
    };
    request();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      done = true;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      void lock?.release();
    };
  }, [wanted]);
}
