import { useEffect } from "react";
import { toast } from "sonner";
import { getSocket } from "./socket";
import { api } from "./api";

const SEEN_KEY = "last_announcement_id";

export function useGlobalAnnouncement() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // only when logged in

    const role = localStorage.getItem("role") || "member";
    const socket = getSocket();

    // Live announcements
    const onIncoming = (payload) => {
      const { id, content, audience = "all" } = payload || {};
      if (!id || !content) return;

      // client-side audience check
      const allowed = audience === "all" || audience === role;
      if (!allowed) return;

      const last = localStorage.getItem(SEEN_KEY);
      if (last !== id) {
        toast.info(content, { duration: 6000 });
        localStorage.setItem(SEEN_KEY, id);
      }
    };

    socket.on("announcement:new", onIncoming);

    // On mount (or post-login): fetch latest if unseen
    (async () => {
      try {
        const { data } = await api.get("/api/announcements/latest");
        const ann = data?.announcement;
        if (!ann) return;
        const last = localStorage.getItem(SEEN_KEY);
        if (last !== ann.id) {
          toast.info(ann.content, { duration: 6000 });
          localStorage.setItem(SEEN_KEY, ann.id);
        }
      } catch {
        /* ignore */
      }
    })();

    return () => socket.off("announcement:new", onIncoming);
  }, []);
}
