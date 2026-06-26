export default function TitleScreen({ onStart }) {
  return (
    <div style={styles.titleScreen}>
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
    background:
      "linear-gradient(180deg, #ff7a18 0%, #af002d 55%, #240000 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontFamily: "Arial, sans-serif",
    overflow: "hidden",
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