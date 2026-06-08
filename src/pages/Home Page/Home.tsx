import './Home.css';

const Home = () => {
  return (
    <div id="home" className="home-page">
      <video autoPlay loop muted className="background-video">
        <source src="/PowerPitVid.mp4" type="video/mp4" />
      </video>
      <div className="title-container">
        <div>POWER PIT</div>
      </div>
    </div>
  );
};

export default Home;
