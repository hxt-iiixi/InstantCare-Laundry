import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../../lib/api";
import Navbar from "../../components/member-pages/NavbarAndHero";
import Hero from "../../components/Home-Page/Hero";
import FeatureCards from "../../components/Home-Page/FeatureCards";
import DevotionBanner from "../../components/Home-Page/DevotionBanner";
import UpcomingEvents from "../../components/Home-Page/UpcomingEvents";
import LeadershipTeam from "../../components/Home-Page/LeadershipTeam";
import ChurchInfoFooter from "../../components/Home-Page/ChurchInfoFooter";
import ReflectionPrompts from "../../components/Home-Page/ReflectionPrompts";
import { io as socketIO } from "socket.io-client";
export default function MemberChurch() {
  const [church, setChurch] = useState(null);
  const [events, setEvents] = useState([]);
  const socketRef = useRef(null);

  // get member’s church
  useEffect(() => {
    (async () => {
      const { data } = await api.get("/api/members/me/church");
      setChurch(data?.church || null);
    })();
  }, []);

  // fetch initial events when church known
  useEffect(() => {
    if (!church?.id) return;
    (async () => {
      const { data } = await api.get("/api/events", { params: { churchId: church.id } });
      setEvents(data || []);
    })();
  }, [church?.id]);

  // connect socket and subscribe to church room
  useEffect(() => {
    // connect once
    socketRef.current = socketIO(import.meta.env.VITE_API_BASE_URL || "http://localhost:4000");
    return () => socketRef.current?.disconnect();
  }, []);

  useEffect(() => {
    if (!church?.id || !socketRef.current) return;

    const s = socketRef.current;
    s.emit("join:church", church.id);

    const onNew = (ev) => setEvents((prev) => [...prev, ev]);
    const onUpd = (ev) => setEvents((prev) => prev.map((e) => (e._id === ev._id ? ev : e)));
    const onDel = ({ id }) => setEvents((prev) => prev.filter((e) => e._id !== id));

    s.on("event:new", onNew);
    s.on("event:updated", onUpd);
    s.on("event:deleted", onDel);

    return () => {
      s.off("event:new", onNew);
      s.off("event:updated", onUpd);
      s.off("event:deleted", onDel);
    };
  }, [church?.id]);

  return (
    <>
      <Navbar />
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-3 text-sm text-slate-700">
          {church ? (
            <>You are joined to <span className="font-semibold text-orange-600">{church.name}</span>
              {church.joinCode ? <> (code <span className="tracking-widest">{church.joinCode}</span>)</> : null}.
            </>
          ) : (
            <>You are not linked to a church yet.</>
          )}
        </div>
      </div>

      <FeatureCards />
      <DevotionBanner />
      <ReflectionPrompts />
      <UpcomingEvents />
    </>
  );
}
