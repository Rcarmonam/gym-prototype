import './Membership.css';
import MembershipButton from '../../components/atoms/Buttons/GeneralButton/generalButton.tsx';

interface MembershipProps {
  buttonText?: string;
}

const Membership: React.FC<MembershipProps> = ({ buttonText = 'Select' }) => {
  return (
    <div className="membership-page">
      <div className="membership-title">
        <div>Choose Your Power Pit Membership</div>
      </div>
      <div className="membership-box-containers">
        <div className="startpower-membership">
          <div className="startpower-title">Starter Power</div>
          <div className="startpower-prices">Free</div>
          <ul className="startpower-description">
            <li>Standard progress tracking</li>
            <li>Access to over 100+ excerices</li>
            <li>Workout Duration Tracker</li>
            <li>Muscle Group Tracker</li>
            <li>"Goal Set" Notepad</li>
          </ul>
          <div className="startpower-button">
            <MembershipButton
              text={buttonText}
              navigationLink="/CreateAcc"
              styleType="style3"
              buttonSize="large"
            />
          </div>
        </div>
        <div className="powerboost-membership">
          <div className="powerboost-title">Power Boost</div>
          <div className="powerboost-prices">$19.99/month</div>
          <ul className="powerboost-description">
            <li>All Basic Plan features</li>
            <li>Customizable Workout Plans</li>
            <li>Access to our expert trainers </li>
            <li>Premade expert workouts</li>
            <li>Early access to new features</li>
          </ul>
          <div className="powerboost-button">
            <MembershipButton
              text={buttonText}
              navigationLink="/CreateAcc"
              styleType="style2"
              buttonSize="large"
              textColor="var(--fontColor)"
              backgroundColor="var(--background)"
            />
          </div>
        </div>
        <div className="ultimatepower-membership">
          <div className="ultimatepower-title">Ultimate Power</div>
          <div className="ultimatepower-prices">$29.99/month</div>
          <ul className="ultimatepower-description">
            <li>All Premium Plan features</li>
            <li>Personalized nutrition planning</li>
            <li>Healthy recipe cook book </li>
            <li>Priority customer support</li>
            <li>BMI Calculator </li>
            <li>Guac</li>
          </ul>
          <div className="ultimatepower-button">
            <MembershipButton
              text={buttonText}
              navigationLink="/CreateAcc"
              styleType="style3"
              buttonSize="large"
            />
          </div>
        </div>
      </div>
      <div className="membership-footer">
        <div className="mem-footer-text">Already have an account?</div>
        <div className="mem-footer-button">
          <MembershipButton
            text="Log in"
            navigationLink="/login"
            styleType="style2"
            buttonSize="large"
          />
        </div>
      </div>
    </div>
  );
};

export default Membership;
