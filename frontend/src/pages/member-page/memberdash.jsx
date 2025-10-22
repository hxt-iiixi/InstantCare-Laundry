import Navbar from "../../components/member-pages/NavbarAndHero";
import Hero from "../../components/Home-Page/Hero";
import FeatureCards from "../../components/Home-Page/FeatureCards";
import DevotionBanner from "../../components/Home-Page/DevotionBanner";
import UpcomingEvents from "../../components/Home-Page/UpcomingEvents";
import LeadershipTeam from "../../components/Home-Page/LeadershipTeam";
import ChurchInfoFooter from "../../components/Home-Page/ChurchInfoFooter";
import ReflectionPrompts from "../../components/Home-Page/ReflectionPrompts";

export default function MemberDash() {
  return (
    <>
        <Navbar />
        <FeatureCards />
        <DevotionBanner />
        <ReflectionPrompts />
        <UpcomingEvents />
    </>
  );
}
