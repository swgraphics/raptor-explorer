export default function TitleScreen({ onStart }) {
  return (
    <div style={styles.titleScreen}>
      <div style={styles.overlay} />

      <div className="embers">
        <span className="ember" />
        <span className="ember" />
        <span className="ember" />
        <span className="ember" />
        <span className="ember" />
      </div>

      <div className="smoke one" />
      <div className="smoke two" />

      <img src="/logo.png" alt="The World is Lava" className="title-logo" />

      <button style={styles.startButton} onClick={onStart}>
        START GAME
      </button>
    </div>
  );
}

const styles = {
  titleScreen: {
    position: "fixed",
    inset: 0,
    zIndex: 20,

    backgroundImage: "url('/background.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    zIndex: 0,
  },

  startButton: {
    padding: "18px 34px",
    borderRadius: "999px",
    border: "none",
    background: "white",
    color: "#af002d",
    fontSize: "20px",
    fontWeight: "bold",
    cursor: "pointer",
    zIndex: 2,
  },
};