export default function TitleScreen({
  onStart,
  selectedDinosaur,
  setSelectedDinosaur,
}) {
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
<div style={styles.dinoSelector}>
  {dinosaurs.map((dino) => (
    <button
      key={dino}
      style={{
        ...styles.dinoButton,
        ...(selectedDinosaur === dino ? styles.dinoButtonActive : {}),
      }}
      onClick={() => setSelectedDinosaur(dino)}
    >
      {dino}
    </button>
  ))}
</div>
      <button style={styles.startButton} onClick={onStart}>
        START GAME
      </button>
    </div>
  );
}
const dinosaurs = [
  "velociraptor",
  "trex",
  "triceratops",
  "stegosaurus",
  "parasaurolophus",
  "apatosaurus",
];
const styles = {
  dinoSelector: {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "8px",
  width: "85%",
  maxWidth: "360px",
  marginBottom: "22px",
  zIndex: 2,
},

dinoButton: {
  padding: "10px 8px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.45)",
  background: "rgba(0,0,0,0.5)",
  color: "white",
  fontSize: "12px",
  fontWeight: "bold",
  textTransform: "capitalize",
},

dinoButtonActive: {
  background: "rgba(255,120,0,0.95)",
  boxShadow: "0 0 14px rgba(255,120,0,0.85)",
},titleScreen: {
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