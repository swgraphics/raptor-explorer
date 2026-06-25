export default function TitleScreen({ onStart }) {
  return (
    <div style={styles.titleScreen}>
      <h1 style={styles.titleText}>THE WORLD IS LAVA</h1>
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
  },
  titleText: {
    fontSize: "52px",
    letterSpacing: "4px",
    textAlign: "center",
    marginBottom: "30px",
    textShadow: "0 6px 18px rgba(0,0,0,0.45)",
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
  },
};