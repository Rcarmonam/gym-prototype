import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import './navbarOut.css';
import GenButton from '../../atoms/Buttons/GeneralButton/generalButton.tsx';

const NavbarOut = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 0); 
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbarOut-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbarOut-title">
        <RouterLink to="/" className="navbarOut-power-pit-text">
          POWER PIT
        </RouterLink>
      </div>
      <div className="navbarOut-buttons-container">
        <div className="navbarOut-login-button">
          <GenButton
            text="Log in"
            navigationLink="/Login"
            styleType="style1"
            buttonSize="medium"
          />
        </div>
        <div className="navbarOut-acc-button">
          <GenButton
            text="Join Now"
            navigationLink="/Membership"
            styleType="style2"
            buttonSize="medium"
          />
        </div>
      </div>
    </header>
  );
};

export default NavbarOut;
