import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/member-pages/NavbarAndHero";
import Hero from "../../components/Home-Page/Hero";
import FeatureCards from "../../components/Home-Page/FeatureCards";
import DevotionBanner from "../../components/Home-Page/DevotionBanner";
import UpcomingEvents from "../../components/Home-Page/UpcomingEvents";
import LeadershipTeam from "../../components/Home-Page/LeadershipTeam";
import ChurchInfoFooter from "../../components/Home-Page/ChurchInfoFooter";
import ReflectionPrompts from "../../components/Home-Page/ReflectionPrompts";

export default function MemberDash() {
  const [church, setChurch] = useState(null);

  useEffect(() => {
    const api = axios.create({
      baseURL: "http://localhost:4000",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    api.get("/api/members/me/church").then(({ data }) => setChurch(data.church)).catch(() => setChurch(null));
  }, []);

  return (
    <>
      <Navbar />
      {/* Simple banner to verify code linkage */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-3 text-sm text-slate-700">
          {church ? (
            <>You are joined to <span className="font-semibold text-orange-600">{church.name}</span>{church.joinCode ? <> (code <span className="tracking-widest">{church.joinCode}</span>)</> : null}.</>
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
