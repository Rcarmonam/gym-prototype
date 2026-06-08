import './CreateAcc.css';
import NavBar from '../../components/organisms/NavbarOut/navbarOut.tsx';
import AccForm from '../../components/atoms/Forms/CreateAccForm/CreateAccForm.tsx';
import accPic from '../../assets/CreatePic.svg';
import { Link } from 'react-router-dom';

const CreateAcc = () => {
  return (
    <div className="acc-page">
      <NavBar />
      <div className="acc-First-Box">
        <div className="create-form">
          <div className="text-box">
            <div className="acc-welcome">Create an Account</div>
            <div className="acc-sub">
              Already have an account?&nbsp;{' '}
              <Link to="/Login" className="login-link">
                Login
              </Link>
            </div>
          </div>
          <div className="acc-form">
            <AccForm />
          </div>
        </div>
      </div>
      <div className="acc-second-Box">
        <div className="image-caption-acc">
          <div className="big-caption-acc">TELL US ABOUT <br/>YOURSELF</div>
        </div>
        <img src={accPic} alt="accPic" className="accPic-image" />
      </div>
    </div>
  );
};

export default CreateAcc;
