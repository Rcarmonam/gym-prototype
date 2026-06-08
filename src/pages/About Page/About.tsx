import './About.css';
import TextButtons from '../../components/atoms/Buttons/GeneralButton/generalButton.tsx';
import guyLift from '../../assets/aboutPage1.svg';
import treadmill from '../../assets/aboutPage2.svg';
import helping from '../../assets/aboutPage3.svg';

const About = () => {
  return (
    <div id="about" className="about-page">
      <div className="mainTitle-container">
        <div className="mainHeader-container">
          Discover How Power Pit <br />
          Transforms Your Fitness Journey
        </div>
        <div className="mainText-container">
          <span className="greenText">
            Power Pit is not just a workout; it's a revolution. &nbsp;
          </span>
          Where each workout is a step towards surpassing your limits. Dive into
          a fitness journey that not only tracks your progress but also
          motivates you to achieve excellence in strength and endurance. Your
          peak potential awaits.
        </div>
      </div>

      <div className="container1">
        <div className="guy-lift">
          <img src={guyLift} alt="guyLift" />
        </div>
        <div className="container1-text">
          <div className="container1-header">
            Personalized
            <br />
            Workout Plans
          </div>
          <div className="container1-subtext">
            Discover workout plans tailored to your goals at Power Pit. Whether
            you're focused on muscle gain or endurance, our customized approach
            ensures you have the perfect roadmap to success, crafted just for
            you.
          </div>
          <div className="button1">
            <TextButtons
              text="Create a Plan"
              navigationLink="/CreateAcc"
              styleType="style3"
              buttonSize="medium"
            />
          </div>
        </div>
      </div>

      <div className="container2">
        <div className="container2-text">
          <div className="container2-header">
            Fitness Tracking
            <br />
            Made Easy
          </div>
          <div className="container2-subtext">
            With Power Pit, tracking your fitness journey is effortless. Log
            your workouts, watch your progress through dynamic analytics, and
            celebrate every milestone with clear, motivating insights into your
            growth.
          </div>
          <div className="button2">
            <TextButtons
              text="Start Tracking"
              navigationLink="/CreateAcc"
              styleType="style3"
              buttonSize="medium"
            />
          </div>
        </div>
        <div className="treadmill">
          <img src={treadmill} alt="treadmill" />
        </div>
      </div>

      <div className="container3">
        <div className="helping">
          <img src={helping} alt="helping" />
        </div>
        <div className="container3-text">
          <div className="container3-header">
            Engaging Community
            <br />
            and Challenges
          </div>
          <div className="container3-subtext">
            Dive into the Power Pit community, where fitness enthusiasts unite.
            Share experiences, gain insights, and find encouragement among peers
            eager to support your journey towards peak performance.
          </div>
          <div className="button3">
            <TextButtons
              text="Start a Chat"
              navigationLink="/CreateAcc"
              styleType="style3"
              buttonSize="medium"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
