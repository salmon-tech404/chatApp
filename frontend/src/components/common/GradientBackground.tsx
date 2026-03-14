import styles from "./GradientBackground.module.css";

interface BubbleConfig {
  size: number;
  x: string;
  y: string;
  delay: string;
  opacity: number;
}

const DEFAULT_BUBBLES: BubbleConfig[] = [
  { size: 380, x: "-120px", y: "-100px", delay: "0s",    opacity: 0.55 },
  { size: 220, x: "62%",    y: "-50px",  delay: "1.8s",  opacity: 0.35 },
  { size: 160, x: "82%",    y: "58%",    delay: "3.2s",  opacity: 0.25 },
  { size: 280, x: "-60px",  y: "62%",    delay: "2.1s",  opacity: 0.30 },
  { size: 130, x: "74%",    y: "12%",    delay: "0.9s",  opacity: 0.20 },
];

interface GradientBackgroundProps {
  bubbles?: BubbleConfig[];
}

export default function GradientBackground({
  bubbles = DEFAULT_BUBBLES,
}: GradientBackgroundProps) {
  return (
    <div className={styles.root} aria-hidden="true">
      {/* Mesh gradient layers */}
      <div className={styles.meshTop} />
      <div className={styles.meshBottom} />

      {/* Floating bubbles */}
      {bubbles.map((b, i) => (
        <div
          key={i}
          className={styles.bubble}
          style={{
            width:            b.size,
            height:           b.size,
            left:             b.x,
            top:              b.y,
            animationDelay:   b.delay,
            opacity:          b.opacity,
          }}
        />
      ))}
    </div>
  );
}
