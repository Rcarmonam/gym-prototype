import Home from '../Home Page/Home.tsx';
import About from '../About Page/About.tsx';
import NavBar from '../../components/organisms/NavbarOut/navbarOut.tsx';
import Membership from '../Membership Page/Membership.tsx';
// import NavBar from '../../components/organisms/NavbarIn/navbarIn.tsx';

const Landing = () => {
  return (
    <div>
      <NavBar />
      <Home />
      <About />
      <Membership buttonText="Join Now" />
    </div>
  );
};

export default Landing;
