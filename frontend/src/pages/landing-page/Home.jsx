import Navbar from "../../components/Navbar";
import Hero from "../../components/Home-Page/Hero";
import FeatureCards from "../../components/Home-Page/FeatureCards";
import DevotionBanner from "../../components/Home-Page/DevotionBanner";
import UpcomingEvents from "../../components/Home-Page/UpcomingEvents";
import LeadershipTeam from "../../components/Home-Page/LeadershipTeam";
import ChurchInfoFooter from "../../components/Home-Page/ChurchInfoFooter";
import ReflectionPrompts from "../../components/Home-Page/ReflectionPrompts";
import BackgroundMusic from "../../components/BackgroundMusic";
import GlobalLayout from "../../components/PersistentLayout";
export default function Home() {
  return (
    <>
      <GlobalLayout> 
        <Navbar />
        <Hero />
        <FeatureCards />
        <DevotionBanner />
        <ReflectionPrompts />
        <UpcomingEvents />
        <LeadershipTeam />
        <ChurchInfoFooter />
        <BackgroundMusic />
      </GlobalLayout>
     
    </>
  );
}
