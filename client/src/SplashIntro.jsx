import "./SplashIntro.css";

function SplashIntro({ onFinish }) {
  return (
    <div className="splash-screen">
      <div className="camera-layer"></div>

      <div className="night-sky">
        <span className="star s1"></span>
        <span className="star s2"></span>
        <span className="star s3"></span>
        <span className="star s4"></span>
        <span className="star s5"></span>
        <span className="star s6"></span>
        <span className="star s7"></span>
        <span className="star s8"></span>
        <span className="star s9"></span>
        <span className="star s10"></span>
        <span className="star s11"></span>
        <span className="star s12"></span>
        <span className="star s13"></span>
        <span className="star s14"></span>
        <span className="star s15"></span>
        <span className="star s16"></span>
      </div>

      <div className="mist mist-1"></div>
      <div className="mist mist-2"></div>
      <div className="mist mist-3"></div>

      <div className="scene-wrap">
        <div className="moon-wrap">
          <div className="moon-frame">
            <img src="/moon.png" alt="Moon" className="moon-img" />
          </div>

          <img src="/earth.png" alt="Earth" className="earth-img" />
        </div>

        <div className="splash-text-wrap">
          <h1 className="splash-title">Sunora</h1>
          <p className="splash-tagline">me hun tumhare liye</p>

          <button className="continue-btn" onClick={onFinish}>
            Continue <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SplashIntro;