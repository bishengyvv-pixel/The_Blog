import { useCallback, useEffect, useRef, useState } from 'react';

// 8x7 pixel art — 1 = filled, 0 = transparent
const PACMAN_SHAPES: Record<'open' | 'closed', number[][]> = {
  open: [
    [0,0,1,1,1,0,0,0],
    [0,1,1,1,1,1,0,0],
    [1,1,0,1,1,0,0,0],
    [1,1,1,1,0,0,0,0],
    [1,1,1,1,1,0,0,0],
    [0,1,1,1,1,1,0,0],
    [0,0,1,1,1,0,0,0],
  ],
  closed: [
    [0,0,1,1,1,0,0,0],
    [0,1,1,1,1,1,0,0],
    [1,1,0,1,1,1,1,0],
    [1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,0,0],
    [0,0,1,1,1,0,0,0],
  ],
};

// ---- crumb particles ----

interface Crumb {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

let crumbId = 0;

function spawnCrumbs(origin: DOMRect): Crumb[] {
  const crumbs: Crumb[] = [];
  const cx = origin.left;
  const cy = origin.top + origin.height / 2;
  for (let i = 0; i < 6; i++) {
    crumbs.push({
      id: crumbId++,
      x: cx,
      y: cy,
      vx: (Math.random() - 0.3) * 3,
      vy: (Math.random() - 0.5) * 2.5,
      life: 1,
    });
  }
  return crumbs;
}

// ---- PixelPacman ----

function PixelPacman({
  color = '#FFD700',
  canvasRef,
  offsetX,
  onClick,
}: {
  color?: string;
  canvasRef?: (el: HTMLCanvasElement | null) => void;
  offsetX: number;
  onClick?: () => void;
}) {
  const internalRef = useRef<HTMLCanvasElement>(null);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    canvasRef?.(internalRef.current);
  }, [canvasRef]);

  useEffect(() => {
    const timer = setInterval(() => setIsOpen((prev) => !prev), 200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const canvas = internalRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let resolvedColor = color;
    const varMatch = color.match(/^var\((--[\w-]+)\)$/);
    if (varMatch) {
      resolvedColor =
        getComputedStyle(document.documentElement).getPropertyValue(varMatch[1]).trim() || '#FFD700';
    }

    const pixelSize = 3;
    const shape = isOpen ? PACMAN_SHAPES.open : PACMAN_SHAPES.closed;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = resolvedColor;

    shape.forEach((row, y) => {
      row.forEach((pixel, x) => {
        if (pixel === 1) {
          ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
      });
    });
  }, [isOpen, color]);

  return (
    <canvas
      ref={internalRef}
      width={24}
      height={21}
      onClick={onClick}
      style={{
        flexShrink: 0,
        zIndex: 1,
        position: 'relative',
        cursor: 'pointer',
        transform: `translateX(${offsetX}px)`,
        transition: 'transform 0.25s ease-out',
      }}
      aria-hidden="true"
    />
  );
}

// ---- Pixel Bean ----

const BEAN_COUNT = 10;
const BEAN_SIZE = 6;
const BEAN_GAP = 10;
const PACMAN_STEP = BEAN_SIZE + BEAN_GAP; // 16px

function PixelBean({ color, eaten }: { color: string; eaten: boolean }) {
  return (
    <div
      style={{
        width: BEAN_SIZE,
        height: BEAN_SIZE,
        flexShrink: 0,
        backgroundColor: eaten ? 'transparent' : color,
        opacity: eaten ? 0 : 1,
        transform: eaten ? 'scale(0) rotate(45deg)' : 'scale(1) rotate(0deg)',
        transition: 'opacity 0.2s ease-out, transform 0.2s ease-out, background-color 0.2s ease-out',
      }}
    />
  );
}

function Footer() {
  const pacmanElRef = useRef<HTMLCanvasElement | null>(null);
  const [crumbs, setCrumbs] = useState<Crumb[]>([]);
  const [step, setStep] = useState(0);
  const [beansAlive, setBeansAlive] = useState(() => Array.from({ length: BEAN_COUNT }, () => true));
  const rafRef = useRef(0);

  const handleClick = useCallback(() => {
    setStep((prev) => {
      const next = prev + 1;
      if (next > BEAN_COUNT) {
        // Reset: all beans respawn, Pacman back to start
        setBeansAlive(Array.from({ length: BEAN_COUNT }, () => true));
        return 0;
      }
      // Eat the bean at current position
      setBeansAlive((alive) => {
        const next2 = [...alive];
        next2[prev] = false;
        return next2;
      });
      // Spawn crumbs at Pacman's mouth
      const pacmanRect = pacmanElRef.current?.getBoundingClientRect();
      if (pacmanRect) {
        setCrumbs((prev2) => [...prev2, ...spawnCrumbs(pacmanRect)]);
      }
      return next;
    });
  }, []);

  const offsetX = step * PACMAN_STEP +8 ;

  // Animate crumbs
  useEffect(() => {
    if (crumbs.length === 0) return;
    let running = true;

    const tick = () => {
      if (!running) return;
      setCrumbs((prev) => {
        const next = prev
          .map((c) => ({ ...c, x: c.x + c.vx, y: c.y + c.vy, life: c.life - 0.03 }))
          .filter((c) => c.life > 0);
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [crumbs.length]);

  return (
    <footer
      className="mt-16 py-8"
      style={{
        borderTop: `1px solid var(--border-color)`,
        backgroundColor: 'var(--bg-secondary)',
      }}
    >
      {/* Crumb overlay */}
      {crumbs.map((c) => (
        <div
          key={c.id}
          className="fixed pointer-events-none"
          style={{
            left: c.x,
            top: c.y,
            width: 3,
            height: 3,
            opacity: c.life,
            backgroundColor: 'var(--text-secondary)',
          }}
        />
      ))}

      <div className="container">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center" style={{ gap: BEAN_GAP }}>
            <PixelPacman
              color="var(--text-secondary)"
              canvasRef={(el) => { pacmanElRef.current = el; }}
              offsetX={offsetX}
              onClick={handleClick}
            />
            {beansAlive.map((alive, i) => (
              <PixelBean
                key={i}
                color="var(--text-secondary)"
                eaten={!alive}
              />
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="btn-icon"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="mailto:your@email.com"
              aria-label="Email"
              className="btn-icon"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
