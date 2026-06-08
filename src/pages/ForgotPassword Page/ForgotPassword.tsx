import "./ForgotPassword.css";
import NavBar from "../../components/organisms/NavbarOut/navbarOut.tsx";
import ForgotPassForm from "../../components/atoms/Forms/ForgotPassForm/ForgotPassForm.tsx";
import LoginPic from "../../assets/LoginPic.svg";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  return (
    <div className="forgot-page">
      <NavBar />
      <div className="forgot-First-Box">
        <div className="signin-form">
          <div className="text-box">
            <div className="forgot-title">Forgot Password?</div>
            <div className="forgot-sub">
              No worries, we’ll send you reset instructions.
            </div>
          </div>
          <div className="log-form">
            <ForgotPassForm />
          </div>
          <div className="login-line">
            <Link to="/Login" className="login-redirection">
              Back to log in
            </Link>
          </div>
        </div>
      </div>
      <div className="forgot-second-Box">
        <div className="image-caption">
          <div className="big-caption">
            CHASE YOUR <br />
            GREATNESS <br />
            AGAIN.
          </div>
        </div>
        <img src={LoginPic} alt="LoginPic" className="LoginPic-image" />
      </div>
    </div>
  );
};

export default ForgotPassword;
