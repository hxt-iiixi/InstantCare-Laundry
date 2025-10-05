import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeatureCards from "../components/Home-Page/FeatureCards";
import DevotionBanner from "../components/Home-Page/DevotionBanner";
import UpcomingEvents from "../components/Home-Page/UpcomingEvents";
import LeadershipTeam from "../components/Home-Page/LeadershipTeam";
import ChurchInfoFooter from "../components/Home-Page/ChurchInfoFooter";
export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeatureCards />
      <DevotionBanner />
      <UpcomingEvents />
      <LeadershipTeam />
      <ChurchInfoFooter />
    </>
  );
}
