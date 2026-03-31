
import Hero from "../components/Home/Hero";
import HomeStats from "../components/Home/HomeStats";
import LogoSlider from "../components/Home/LogoSlider";
import JobSeekers from "../components/Home/JobSeekers";
import HomeRecruiters from "../components/Home/HomeRecruiters";
import Footer from "../components/Home/Footer";

function Home() {
  return (
    <div className="bg-[#0D0F12]">
      <section className="pt-16"><Hero /></section>
      <section className="mt-16"><HomeStats /></section>
      <section className="mt-16"><LogoSlider /></section>
      <section className="mt-20"><JobSeekers /></section>
      <section className="mt-20"><HomeRecruiters /></section>
      <Footer />
    </div>
  );
}

export default Home;