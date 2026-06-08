import "./Login.css";
import NavBar from "../../components/organisms/NavbarOut/navbarOut.tsx";
import LoginForm from "../../components/atoms/Forms/LoginForm/LoginForm.tsx";
import LoginPic from "../../assets/LoginPic.svg";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="login-page">
      <NavBar />
      <div className="login-First-Box">
        <div className="signin-form">
          <div className="text-box">
            <div className="login-welcome">Welcome back!</div>
            <div className="login-sub">Please log in to your account</div>
          </div>
          <div className="log-form">
            <LoginForm />
          </div>
          <div className="sign-up">
            Not registered yet?&nbsp;{" "}
            <Link to="/Membership" className="create-account-link">
              Create an account
            </Link>
          </div>
        </div>
      </div>
      <div className="login-second-Box">
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

export default Login;
