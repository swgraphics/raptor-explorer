export default function Hud({ staminaPercent }) {
  return (
    <div style={styles.hud}>
      <div style={styles.staminaLabel}>Stamina</div>
      <div style={styles.staminaOuter}>
        <div
          style={{
            ...styles.staminaInner,
            width: `${staminaPercent}%`,
          }}
        />
      </div>
    </div>
  );
}

const styles = {
  hud: {
    position: "fixed",
    top: "20px",
    left: "20px",
    zIndex: 50,
    width: "180px",
    fontFamily: "Arial, sans-serif",
    color: "white",
    pointerEvents: "none",
  },
  staminaLabel: {
    fontSize: "14px",
    marginBottom: "6px",
  },
  staminaOuter: {
    width: "100%",
    height: "14px",
    borderRadius: "999px",
    background: "rgba(0,0,0,0.45)",
    overflow: "hidden",
  },
  staminaInner: {
    height: "100%",
    background: "linear-gradient(90deg, #37d67a, #fff176)",
  },
};