import Navbar from "@/components/Navbar";

import NeuraDetails from "@/components/AboutCard1";
import Footer from '@/components/Footer';
// import Footer from './../components/Footer';
import AboutDetails from '@/components/AboutCardRe';

const Index = () => {
  return (
    <div className="flex m-0 flex-col min-h-screen">
      <Navbar />
        <main>
            <AboutDetails />
            <Footer />
        </main>
    </div>
  );
};

export default Index;